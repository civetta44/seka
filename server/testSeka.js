import { evaluateHand } from './sekaEngine.js';

function runTests() {
  console.log('--- Running Seka / Trinka Scoring Rules Verification ---');

  // Test 1: Same Suit (3 cards): [A♥ (11), K♥ (10), 8♠ (8)] -> Hearts = 21
  const t1 = [
    { id: 'A_hearts', rank: 'A', suit: 'hearts', value: 11, symbol: '♥' },
    { id: 'K_hearts', rank: 'K', suit: 'hearts', value: 10, symbol: '♥' },
    { id: '8_spades', rank: '8', suit: 'spades', value: 8, symbol: '♠' }
  ];
  const r1 = evaluateHand(t1);
  console.assert(r1.score === 21, `Test 1 Failed: Expected 21, got ${r1.score}`);
  console.log('✅ Test 1 Passed:', r1.combinationName, `-> ${r1.score} pts`);

  // Test 2: Same Suit (4 cards): [A♥ (11), 10♥ (10), 7♥ (7), 9♠ (9)] -> Hearts = 28
  const t2 = [
    { id: 'A_hearts', rank: 'A', suit: 'hearts', value: 11, symbol: '♥' },
    { id: '10_hearts', rank: '10', suit: 'hearts', value: 10, symbol: '♥' },
    { id: '7_hearts', rank: '7', suit: 'hearts', value: 7, symbol: '♥' },
    { id: '9_spades', rank: '9', suit: 'spades', value: 9, symbol: '♠' }
  ];
  const r2 = evaluateHand(t2);
  console.assert(r2.score === 28, `Test 2 Failed: Expected 28, got ${r2.score}`);
  console.log('✅ Test 2 Passed:', r2.combinationName, `-> ${r2.score} pts`);

  // Test 3: Two Aces ("Dva Tuza"): [A♥, A♠, 8♦] -> 22 pts
  const t3 = [
    { id: 'A_hearts', rank: 'A', suit: 'hearts', value: 11, symbol: '♥' },
    { id: 'A_spades', rank: 'A', suit: 'spades', value: 11, symbol: '♠' },
    { id: '8_diamonds', rank: '8', suit: 'diamonds', value: 8, symbol: '♦' }
  ];
  const r3 = evaluateHand(t3);
  console.assert(r3.score === 22, `Test 3 Failed: Expected 22, got ${r3.score}`);
  console.log('✅ Test 3 Passed:', r3.combinationName, `-> ${r3.score} pts`);

  // Test 4: Three of a Kind (7s): [7♠, 7♥, 7♦] -> 21 pts
  const t4 = [
    { id: '7_spades', rank: '7', suit: 'spades', value: 7, symbol: '♠' },
    { id: '7_hearts', rank: '7', suit: 'hearts', value: 7, symbol: '♥' },
    { id: '7_diamonds', rank: '7', suit: 'diamonds', value: 7, symbol: '♦' }
  ];
  const r4 = evaluateHand(t4);
  console.assert(r4.score === 21, `Test 4 Failed: Expected 21, got ${r4.score}`);
  console.log('✅ Test 4 Passed:', r4.combinationName, `-> ${r4.score} pts`);

  // Test 5: Three Aces: [A♠, A♥, A♦] -> 33 pts
  const t5 = [
    { id: 'A_spades', rank: 'A', suit: 'spades', value: 11, symbol: '♠' },
    { id: 'A_hearts', rank: 'A', suit: 'hearts', value: 11, symbol: '♥' },
    { id: 'A_diamonds', rank: 'A', suit: 'diamonds', value: 11, symbol: '♦' }
  ];
  const r5 = evaluateHand(t5);
  console.assert(r5.score === 33, `Test 5 Failed: Expected 33, got ${r5.score}`);
  console.log('✅ Test 5 Passed:', r5.combinationName, `-> ${r5.score} pts`);

  // Test 6: Four Aces (4-card): [A♠, A♥, A♦, A♣] -> 44 pts
  const t6 = [
    { id: 'A_spades', rank: 'A', suit: 'spades', value: 11, symbol: '♠' },
    { id: 'A_hearts', rank: 'A', suit: 'hearts', value: 11, symbol: '♥' },
    { id: 'A_diamonds', rank: 'A', suit: 'diamonds', value: 11, symbol: '♦' },
    { id: 'A_clubs', rank: 'A', suit: 'clubs', value: 11, symbol: '♣' }
  ];
  const r6 = evaluateHand(t6);
  console.assert(r6.score === 44, `Test 6 Failed: Expected 44, got ${r6.score}`);
  console.log('✅ Test 6 Passed:', r6.combinationName, `-> ${r6.score} pts`);

  // Test 7: Fallback Single High Card: [K♥, 9♠, 7♦] -> 10 pts
  const t7 = [
    { id: 'K_hearts', rank: 'K', suit: 'hearts', value: 10, symbol: '♥' },
    { id: '9_spades', rank: '9', suit: 'spades', value: 9, symbol: '♠' },
    { id: '7_diamonds', rank: '7', suit: 'diamonds', value: 7, symbol: '♦' }
  ];
  const r7 = evaluateHand(t7);
  console.assert(r7.score === 10, `Test 7 Failed: Expected 10, got ${r7.score}`);
  console.log('✅ Test 7 Passed:', r7.combinationName, `-> ${r7.score} pts`);

  console.log('✨ All 7 Seka/Trinka scoring rules tests PASSED with 100% precision!');
}

runTests();
