import express from 'express';
import cors from 'cors';
import { createDeck, shuffleDeck, evaluateHand } from './sekaEngine.js';
import { getBotDecision } from './botAI.js';

export function createGameServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Global Game State (Single-Player vs Server)
  let gameState = {
    mode: 3, // 3-card or 4-card
    ante: 10,
    playerChips: 1000,
    botChips: 1000,
    pot: 0,
    carriedPot: 0, // Svara carried over pot
    isSvara: false,
    phase: 'idle', // idle, betting, showdown, round_over
    playerHand: [],
    botHand: [],
    playerBet: 0,
    botBet: 0,
    currentBet: 0,
    toCall: 0,
    minRaise: 10,
    roundWinner: null,
    roundMessage: 'Place Ante to start round.',
    playerScore: null,
    botScore: null,
    botActionHistory: []
  };

  /**
   * Sanitizes game state to ensure botHand is never leaked until showdown
   */
  function getSanitizedState() {
    const isShowdown = gameState.phase === 'showdown' || gameState.phase === 'round_over';

    return {
      mode: gameState.mode,
      ante: gameState.ante,
      playerChips: gameState.playerChips,
      botChips: gameState.botChips,
      pot: gameState.pot,
      carriedPot: gameState.carriedPot,
      isSvara: gameState.isSvara,
      phase: gameState.phase,
      playerHand: gameState.playerHand,
      // Mask bot hand unless at showdown
      botHand: isShowdown 
        ? gameState.botHand 
        : gameState.botHand.map(c => ({ id: 'hidden', isHidden: true })),
      playerBet: gameState.playerBet,
      botBet: gameState.botBet,
      currentBet: gameState.currentBet,
      toCall: Math.max(0, gameState.botBet - gameState.playerBet),
      minRaise: gameState.minRaise,
      roundWinner: gameState.roundWinner,
      roundMessage: gameState.roundMessage,
      playerScore: gameState.playerScore,
      botScore: isShowdown ? gameState.botScore : null,
      botActionHistory: gameState.botActionHistory
    };
  }

  // 1. Get Current State
  app.get('/api/game/state', (req, res) => {
    res.json(getSanitizedState());
  });

  // 2. Set Game Mode (3-card vs 4-card)
  app.post('/api/game/set-mode', (req, res) => {
    const { mode } = req.body;
    if (mode === 3 || mode === 4) {
      gameState.mode = mode;
      gameState.roundMessage = `Switched to ${mode}-Card Deal mode.`;
    }
    res.json(getSanitizedState());
  });

  // 3. Reset Game (New Match / Bankroll Reset)
  app.post('/api/game/reset', (req, res) => {
    gameState.playerChips = 1000;
    gameState.botChips = 1000;
    gameState.pot = 0;
    gameState.carriedPot = 0;
    gameState.isSvara = false;
    gameState.phase = 'idle';
    gameState.playerHand = [];
    gameState.botHand = [];
    gameState.playerScore = null;
    gameState.botScore = null;
    gameState.roundWinner = null;
    gameState.roundMessage = 'Bankrolls reset to 1000. Ready to deal.';
    gameState.botActionHistory = [];
    res.json(getSanitizedState());
  });

  // 4. Deal / Start New Round
  app.post('/api/game/deal', (req, res) => {
    const ante = gameState.ante;
    
    // Check if players have enough chips for ante
    if (gameState.playerChips < ante || gameState.botChips < ante) {
      return res.status(400).json({ error: 'Insufficient chips to post ante.' });
    }

    // Deduct Ante
    gameState.playerChips -= ante;
    gameState.botChips -= ante;
    gameState.pot = (gameState.carriedPot || 0) + (ante * 2);
    gameState.playerBet = ante;
    gameState.botBet = ante;
    gameState.currentBet = ante;
    gameState.botActionHistory = [];

    // Create & Shuffle 36-Card Deck
    const deck = shuffleDeck(createDeck());
    const cardCount = gameState.mode;

    // Deal cards (N cards to player, N cards to bot)
    gameState.playerHand = deck.splice(0, cardCount);
    gameState.botHand = deck.splice(0, cardCount);

    // Evaluate Player Score immediately for HUD
    gameState.playerScore = evaluateHand(gameState.playerHand);
    gameState.botScore = evaluateHand(gameState.botHand);

    gameState.phase = 'betting';
    gameState.roundWinner = null;
    
    if (gameState.isSvara) {
      gameState.roundMessage = `⚡ SVARA REMATCH! Pot is ${gameState.pot} chips!`;
    } else {
      gameState.roundMessage = `Cards dealt. Your turn to act.`;
    }

    res.json(getSanitizedState());
  });

  // 5. Player Action (Check, Call, Raise, Fold)
  app.post('/api/game/action', (req, res) => {
    if (gameState.phase !== 'betting') {
      return res.status(400).json({ error: 'Not in betting phase.' });
    }

    const { action, raiseAmount = 10 } = req.body;
    const toCall = Math.max(0, gameState.botBet - gameState.playerBet);

    if (action === 'fold') {
      // Player folds -> Bot wins pot
      gameState.phase = 'round_over';
      gameState.roundWinner = 'bot';
      gameState.botChips += gameState.pot;
      gameState.pot = 0;
      gameState.carriedPot = 0;
      gameState.isSvara = false;
      gameState.roundMessage = 'You folded. Server Bot takes the pot.';
      return res.json(getSanitizedState());
    }

    if (action === 'check') {
      if (toCall > 0) {
        return res.status(400).json({ error: 'Cannot check when facing a bet. You must Call or Fold.' });
      }

      // Player checks -> Server Bot responds
      const botDecision = getBotDecision({
        botHand: gameState.botHand,
        currentBet: gameState.currentBet,
        pot: gameState.pot,
        toCall: 0,
        minRaise: gameState.minRaise,
        botChips: gameState.botChips
      });

      gameState.botActionHistory.push(botDecision);

      if (botDecision.action === 'check') {
        // Both checked -> Go to Showdown!
        resolveShowdown();
        return res.json(getSanitizedState());
      } else if (botDecision.action === 'raise') {
        // Bot bets / raises
        const betAmt = Math.min(botDecision.amount, gameState.botChips);
        gameState.botChips -= betAmt;
        gameState.botBet += betAmt;
        gameState.pot += betAmt;
        gameState.currentBet = gameState.botBet;
        gameState.roundMessage = `Bot bets +${betAmt} chips! (${botDecision.reason})`;
        return res.json(getSanitizedState());
      }
    }

    if (action === 'call') {
      const callAmt = Math.min(toCall, gameState.playerChips);
      gameState.playerChips -= callAmt;
      gameState.playerBet += callAmt;
      gameState.pot += callAmt;

      // Both matched bets -> Go to Showdown!
      resolveShowdown();
      return res.json(getSanitizedState());
    }

    if (action === 'raise') {
      const totalRaiseNeeded = toCall + raiseAmount;
      if (gameState.playerChips < totalRaiseNeeded) {
        return res.status(400).json({ error: 'Not enough chips to raise.' });
      }

      gameState.playerChips -= totalRaiseNeeded;
      gameState.playerBet += totalRaiseNeeded;
      gameState.pot += totalRaiseNeeded;
      gameState.currentBet = gameState.playerBet;

      // Now Server Bot responds to Player's raise
      const botToCall = gameState.playerBet - gameState.botBet;
      const botDecision = getBotDecision({
        botHand: gameState.botHand,
        currentBet: gameState.currentBet,
        pot: gameState.pot,
        toCall: botToCall,
        minRaise: gameState.minRaise,
        botChips: gameState.botChips
      });

      gameState.botActionHistory.push(botDecision);

      if (botDecision.action === 'fold') {
        // Bot folds -> Player wins!
        gameState.phase = 'round_over';
        gameState.roundWinner = 'player';
        gameState.playerChips += gameState.pot;
        gameState.pot = 0;
        gameState.carriedPot = 0;
        gameState.isSvara = false;
        gameState.roundMessage = `Bot folded (${botDecision.reason}). You win ${gameState.playerChips} chips!`;
        return res.json(getSanitizedState());
      } else if (botDecision.action === 'call') {
        // Bot calls -> Go to Showdown!
        const botCallAmt = Math.min(botToCall, gameState.botChips);
        gameState.botChips -= botCallAmt;
        gameState.botBet += botCallAmt;
        gameState.pot += botCallAmt;

        resolveShowdown();
        return res.json(getSanitizedState());
      } else if (botDecision.action === 'raise') {
        // Bot re-raises
        const botRaiseAmt = botToCall + gameState.minRaise;
        const actualAmt = Math.min(botRaiseAmt, gameState.botChips);
        gameState.botChips -= actualAmt;
        gameState.botBet += actualAmt;
        gameState.pot += actualAmt;
        gameState.currentBet = gameState.botBet;
        gameState.roundMessage = `Bot re-raises +${actualAmt} chips! Your turn.`;
        return res.json(getSanitizedState());
      }
    }

    res.json(getSanitizedState());
  });

  /**
   * Resolves Showdown & Compares Seka Scores
   */
  function resolveShowdown() {
    gameState.phase = 'showdown';
    const pScore = evaluateHand(gameState.playerHand);
    const bScore = evaluateHand(gameState.botHand);

    gameState.playerScore = pScore;
    gameState.botScore = bScore;

    if (pScore.score > bScore.score) {
      // Player wins
      gameState.roundWinner = 'player';
      gameState.playerChips += gameState.pot;
      gameState.roundMessage = `🎉 YOU WIN! Your ${pScore.score} pts (${pScore.combinationName}) beat Bot's ${bScore.score} pts (${bScore.combinationName})! Won ${gameState.pot} chips!`;
      gameState.pot = 0;
      gameState.carriedPot = 0;
      gameState.isSvara = false;
    } else if (pScore.score < bScore.score) {
      // Bot wins
      gameState.roundWinner = 'bot';
      gameState.botChips += gameState.pot;
      gameState.roundMessage = `💀 BOT WINS! Bot's ${bScore.score} pts (${bScore.combinationName}) beat your ${pScore.score} pts (${pScore.combinationName})!`;
      gameState.pot = 0;
      gameState.carriedPot = 0;
      gameState.isSvara = false;
    } else {
      // SVARA / TIE
      gameState.roundWinner = 'svara';
      gameState.isSvara = true;
      gameState.carriedPot = gameState.pot;
      gameState.roundMessage = `⚡ SVARA! Both scored ${pScore.score} pts! Pot of ${gameState.pot} chips carries over to next round!`;
    }
  }

  return app;
}
