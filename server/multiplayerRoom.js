import { createDeck, shuffleDeck, evaluateHand } from './sekaEngine.js';

export class MultiplayerRoom {
  constructor({ id, hostId, hostName, mode = 3, ante = 10, maxPlayers = 10 }) {
    this.id = id || `room_${Date.now().toString(36)}`;
    this.hostId = String(hostId);
    this.hostName = hostName || 'Boshlovchi';
    this.mode = mode; // 3 yoki 4
    this.ante = ante;
    this.maxPlayers = Math.min(10, Math.max(2, maxPlayers));
    
    this.players = []; // 10 tagacha o'rindiq
    
    this.phase = 'lobby'; // 'lobby', 'dealing', 'betting', 'showdown', 'round_over'
    this.pot = 0;
    this.carriedPot = 0; // Svara (durang) dan qolgan bank
    this.isSvara = false;
    this.dealerIndex = 0;
    this.currentTurnIndex = 0;
    this.currentBet = 0;
    this.minRaise = 10;
    this.roundMessage = 'O\'yinchilar qo\'shilishi kutilmoqda...';
    this.roundWinner = null;
    this.winningScore = null;
    this.turnTimer = null;
    this.turnTimeLeft = 20;
    this.createdAt = new Date().toISOString();
  }

  addPlayer(user) {
    const userId = String(user.id);
    const existingIndex = this.players.findIndex(p => p && p.id === userId);
    if (existingIndex !== -1) {
      this.players[existingIndex].isOnline = true;
      return { success: true, seatIndex: existingIndex, player: this.players[existingIndex] };
    }

    let emptySeat = -1;
    for (let i = 0; i < this.maxPlayers; i++) {
      if (!this.players[i]) {
        emptySeat = i;
        break;
      }
    }

    if (emptySeat === -1) {
      return { success: false, error: 'Stol to\'ldi (Maksimal 10 o\'yinchi).' };
    }

    const newPlayer = {
      id: userId,
      name: user.firstName || user.name || 'O\'yinchi',
      username: user.username || '',
      chips: user.chips !== undefined ? user.chips : 1000,
      seatIndex: emptySeat,
      isHost: userId === this.hostId,
      isOnline: true,
      cards: [],
      score: null,
      currentBet: 0,
      hasActed: false,
      folded: false,
      isAllIn: false
    };

    this.players[emptySeat] = newPlayer;
    this.roundMessage = `${newPlayer.name} #${emptySeat + 1}-o'ringa o'tirdi`;
    return { success: true, seatIndex: emptySeat, player: newPlayer };
  }

  removePlayer(userId) {
    const pIndex = this.players.findIndex(p => p && p.id === String(userId));
    if (pIndex !== -1) {
      const p = this.players[pIndex];
      if (this.phase === 'betting' && !p.folded) {
        p.folded = true;
      }
      this.players[pIndex] = null;

      if (p.isHost) {
        const nextHost = this.players.find(pl => pl !== null);
        if (nextHost) {
          nextHost.isHost = true;
          this.hostId = nextHost.id;
          this.hostName = nextHost.name;
        }
      }

      this.checkRoundCompletion();
      return true;
    }
    return false;
  }

  getActivePlayers() {
    return this.players.filter(p => p !== null && p.isOnline);
  }

  getInHandPlayers() {
    return this.players.filter(p => p !== null && !p.folded);
  }

  startRound() {
    const active = this.getActivePlayers();
    if (active.length < 2) {
      return { success: false, error: 'O\'yinni boshlash uchun kamida 2 ta o\'yinchi kerak.' };
    }

    this.pot = this.carriedPot || 0;
    this.currentBet = this.ante;
    this.minRaise = this.ante;
    this.roundWinner = null;
    this.winningScore = null;

    for (const p of active) {
      const anteAmt = Math.min(this.ante, p.chips);
      p.chips -= anteAmt;
      p.currentBet = anteAmt;
      p.folded = false;
      p.hasActed = false;
      p.cards = [];
      p.score = null;
      this.pot += anteAmt;
    }

    const deck = shuffleDeck(createDeck());
    const cardCount = this.mode;

    for (const p of active) {
      p.cards = deck.splice(0, cardCount);
      p.score = evaluateHand(p.cards);
    }

    this.dealerIndex = (this.dealerIndex + 1) % this.maxPlayers;
    this.currentTurnIndex = this.findNextActiveSeat(this.dealerIndex);
    this.phase = 'betting';
    this.roundMessage = `Raund boshlandi! Ante tikildi. Navbat: ${this.players[this.currentTurnIndex]?.name}`;
    
    return { success: true };
  }

  findNextActiveSeat(fromIndex) {
    for (let i = 1; i <= this.maxPlayers; i++) {
      const checkIndex = (fromIndex + i) % this.maxPlayers;
      const p = this.players[checkIndex];
      if (p && !p.folded && p.chips > 0) {
        return checkIndex;
      }
    }
    return fromIndex;
  }

  handlePlayerAction(userId, action, amount = 0) {
    const currentPlayer = this.players[this.currentTurnIndex];
    if (!currentPlayer || currentPlayer.id !== String(userId)) {
      return { success: false, error: 'Sizning navbatingiz emas.' };
    }

    const toCall = Math.max(0, this.currentBet - currentPlayer.currentBet);

    if (action === 'fold') {
      currentPlayer.folded = true;
      currentPlayer.hasActed = true;
      this.roundMessage = `${currentPlayer.name} pas qildi (tashladi).`;
    } else if (action === 'check') {
      if (toCall > 0) {
        return { success: false, error: 'Stavka bor paytda chek qilib bo\'lmaydi.' };
      }
      currentPlayer.hasActed = true;
      this.roundMessage = `${currentPlayer.name} chek qildi (tekshirdi).`;
    } else if (action === 'call') {
      const callAmt = Math.min(toCall, currentPlayer.chips);
      currentPlayer.chips -= callAmt;
      currentPlayer.currentBet += callAmt;
      this.pot += callAmt;
      currentPlayer.hasActed = true;
      this.roundMessage = `${currentPlayer.name} ${callAmt} chip bilan tengladi.`;
    } else if (action === 'raise') {
      const raiseAmt = parseInt(amount, 10) || this.minRaise;
      const totalNeeded = toCall + raiseAmt;
      if (currentPlayer.chips < totalNeeded) {
        return { success: false, error: 'Oshirish uchun chip yetarli emas.' };
      }

      currentPlayer.chips -= totalNeeded;
      currentPlayer.currentBet += totalNeeded;
      this.pot += totalNeeded;
      this.currentBet = currentPlayer.currentBet;
      currentPlayer.hasActed = true;

      for (const p of this.getInHandPlayers()) {
        if (p.id !== currentPlayer.id) {
          p.hasActed = false;
        }
      }

      this.roundMessage = `${currentPlayer.name} stavkani +${raiseAmt} chipga oshirdi (Jami: ${this.currentBet})!`;
    }

    this.checkRoundCompletion();
    return { success: true };
  }

  checkRoundCompletion() {
    const inHand = this.getInHandPlayers();

    if (inHand.length === 1) {
      const winner = inHand[0];
      winner.chips += this.pot;
      this.roundWinner = winner.name;
      this.roundMessage = `🏆 ${winner.name} ${this.pot} chip yutib oldi (barcha raqiblar tashladi)!`;
      this.pot = 0;
      this.carriedPot = 0;
      this.isSvara = false;
      this.phase = 'round_over';
      return;
    }

    const allActed = inHand.every(p => p.hasActed && p.currentBet === this.currentBet);

    if (allActed) {
      this.resolveShowdown();
    } else {
      this.currentTurnIndex = this.findNextActiveSeat(this.currentTurnIndex);
      this.roundMessage = `Navbat: ${this.players[this.currentTurnIndex]?.name}`;
    }
  }

  resolveShowdown() {
    this.phase = 'showdown';
    const inHand = this.getInHandPlayers();

    inHand.sort((a, b) => (b.score?.score || 0) - (a.score?.score || 0));

    const topScore = inHand[0]?.score?.score || 0;
    const topPlayers = inHand.filter(p => (p.score?.score || 0) === topScore);

    if (topPlayers.length === 1) {
      const winner = topPlayers[0];
      winner.chips += this.pot;
      this.roundWinner = winner.name;
      this.winningScore = winner.score;
      this.roundMessage = `🎉 ${winner.name} ${winner.score.score} ball (${winner.score.combinationName}) bilan ${this.pot} chip yutib oldi!`;
      this.pot = 0;
      this.carriedPot = 0;
      this.isSvara = false;
    } else {
      this.isSvara = true;
      this.carriedPot = this.pot;
      const tiedNames = topPlayers.map(p => p.name).join(' & ');
      this.roundWinner = 'SVARA';
      this.roundMessage = `⚡ SVARA (DURANG)! ${tiedNames} orasida durang (${topScore} ball)! ${this.pot} chip keyingi raundga o'tdi!`;
    }
  }

  getSanitizedState(forUserId) {
    const isShowdown = this.phase === 'showdown' || this.phase === 'round_over';

    return {
      roomId: this.id,
      hostId: this.hostId,
      hostName: this.hostName,
      mode: this.mode,
      ante: this.ante,
      maxPlayers: this.maxPlayers,
      phase: this.phase,
      pot: this.pot,
      carriedPot: this.carriedPot,
      isSvara: this.isSvara,
      dealerIndex: this.dealerIndex,
      currentTurnIndex: this.currentTurnIndex,
      currentTurnPlayerId: this.players[this.currentTurnIndex]?.id || null,
      currentBet: this.currentBet,
      minRaise: this.minRaise,
      roundMessage: this.roundMessage,
      roundWinner: this.roundWinner,
      winningScore: this.winningScore,
      players: this.players.map((p, idx) => {
        if (!p) return null;
        const isSelf = p.id === String(forUserId);
        return {
          id: p.id,
          name: p.name,
          username: p.username,
          chips: p.chips,
          seatIndex: idx,
          isHost: p.isHost,
          isOnline: p.isOnline,
          currentBet: p.currentBet,
          folded: p.folded,
          hasActed: p.hasActed,
          cards: (isSelf || isShowdown) ? p.cards : p.cards.map(() => ({ id: 'hidden', isHidden: true })),
          score: (isSelf || isShowdown) ? p.score : null
        };
      })
    };
  }
}
