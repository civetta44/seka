import { evaluateHand } from './sekaEngine.js';

/**
 * Server Bot AI decision logic based on Seka scoring thresholds.
 * Thresholds:
 * - Score < 14: Fold (or Check if toCall === 0)
 * - 15 <= Score <= 21: Call / Check
 * - Score >= 22: Raise / Bet
 */
export function getBotDecision({ botHand, currentBet, pot, toCall, minRaise, botChips }) {
  const evalResult = evaluateHand(botHand);
  const score = evalResult.score;

  // If no cost to call (can check for free)
  if (toCall === 0) {
    if (score >= 22 && botChips >= minRaise) {
      // Strong hand: bet
      const raiseAmount = Math.min(minRaise * 2, botChips);
      return {
        action: 'raise',
        amount: raiseAmount,
        reason: `Bot has strong hand (${score} pts) and opens bet with +${raiseAmount}`,
        score
      };
    }
    // Otherwise check for free
    return {
      action: 'check',
      amount: 0,
      reason: `Bot checks with ${score} pts`,
      score
    };
  }

  // Facing a bet (toCall > 0)
  if (score < 14) {
    // Low score: Fold
    return {
      action: 'fold',
      amount: 0,
      reason: `Bot folds with weak hand (${score} pts)`,
      score
    };
  }

  if (score >= 15 && score <= 21) {
    // Moderate score: Call
    const callAmt = Math.min(toCall, botChips);
    return {
      action: 'call',
      amount: callAmt,
      reason: `Bot calls with solid hand (${score} pts)`,
      score
    };
  }

  // High score (>= 22)
  if (score >= 22) {
    // If bot has enough chips to raise and toCall is reasonable
    if (botChips > toCall + minRaise) {
      const raiseAmt = toCall + minRaise;
      return {
        action: 'raise',
        amount: raiseAmt,
        reason: `Bot raises aggressively with high-value hand (${score} pts)`,
        score
      };
    }
    // Otherwise call
    const callAmt = Math.min(toCall, botChips);
    return {
      action: 'call',
      amount: callAmt,
      reason: `Bot calls all-in with high-value hand (${score} pts)`,
      score
    };
  }

  return {
    action: 'call',
    amount: Math.min(toCall, botChips),
    reason: `Bot calls with ${score} pts`,
    score
  };
}
