import React, { useCallback, useEffect, useMemo, useState } from 'react';
import HeroSection from './components/HeroSection';
import GameTable from './components/GameTable';
import Controls from './components/Controls';
import StatusPanel from './components/StatusPanel';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({ suit: s, rank: r, id: `${r}${s}-${Math.random().toString(36).slice(2, 9)}` });
    }
  }
  return shuffle(deck);
}

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cardValue(rank) {
  if (rank === 'A') return 11; // handle ace separately
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

function handTotals(hand) {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    if (c.rank === 'A') aces += 1;
    total += cardValue(c.rank);
  }
  // downgrade aces from 11 to 1 while busting
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  const soft = hand.some(c => c.rank === 'A') && total <= 21 && total + 10 <= 31 && (hand.reduce((acc, c) => acc + (c.rank === 'A' ? 1 : 0), 0) > aces);
  // soft indicates at least one ace counted as 11 in the natural sum before adjustments; we compute simpler below
  const isSoft = (() => {
    let t = 0;
    let a = 0;
    for (const c of hand) {
      if (c.rank === 'A') a += 1;
      t += cardValue(c.rank);
    }
    while (t > 21 && a > 0) {
      t -= 10;
      a -= 1;
    }
    // If any ace is still valued at 11, it's soft
    return a < hand.filter(c => c.rank === 'A').length;
  })();
  return { total, isSoft };
}

function isBlackjack(hand) {
  return hand.length === 2 && handTotals(hand).total === 21;
}

function basicStrategyAdvice(playerHand, dealerUp, canDouble) {
  if (!playerHand.length || !dealerUp) return '—';
  const { total, isSoft } = handTotals(playerHand);
  const dealerVal = dealerUp.rank === 'A' ? 11 : cardValue(dealerUp.rank);

  if (isSoft) {
    // Soft totals
    if (total <= 17) {
      // A2/A3/A4/A5/A6 soft 13-17
      if (total === 17) {
        if (canDouble && dealerVal >= 3 && dealerVal <= 6) return 'Double';
        return 'Hit';
      }
      if (total === 16 || total === 15) {
        if (canDouble && dealerVal >= 4 && dealerVal <= 6) return 'Double';
        return 'Hit';
      }
      if (total === 14 || total === 13) {
        if (canDouble && dealerVal >= 5 && dealerVal <= 6) return 'Double';
        return 'Hit';
      }
      return 'Hit';
    }
    if (total === 18) {
      if (canDouble && dealerVal >= 3 && dealerVal <= 6) return 'Double';
      if ([2, 7, 8].includes(dealerVal)) return 'Stand';
      return 'Hit';
    }
    // 19+ soft
    return 'Stand';
  } else {
    // Hard totals
    if (total <= 8) return 'Hit';
    if (total === 9) return canDouble && dealerVal >= 3 && dealerVal <= 6 ? 'Double' : 'Hit';
    if (total === 10) return canDouble && dealerVal >= 2 && dealerVal <= 9 ? 'Double' : 'Hit';
    if (total === 11) return canDouble && dealerVal !== 11 ? 'Double' : 'Hit';
    if (total === 12) return dealerVal >= 4 && dealerVal <= 6 ? 'Stand' : 'Hit';
    if (total >= 13 && total <= 16) return dealerVal >= 2 && dealerVal <= 6 ? 'Stand' : 'Hit';
    return 'Stand';
  }
}

export default function App() {
  const [deck, setDeck] = useState(() => createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [bank, setBank] = useState(1000);
  const [bet, setBet] = useState(50);
  const [phase, setPhase] = useState('betting'); // betting | player | dealer | reveal | roundOver
  const [message, setMessage] = useState('Place your bet and press Deal');
  const [revealDealer, setRevealDealer] = useState(false);
  const [hasDoubled, setHasDoubled] = useState(false);

  const canDouble = useMemo(() => phase === 'player' && playerHand.length === 2 && bank >= bet && !hasDoubled, [phase, playerHand.length, bank, bet, hasDoubled]);

  const dealCard = useCallback((targetSetter) => {
    setDeck(prev => {
      let d = prev;
      if (d.length === 0) d = createDeck();
      const [card, ...rest] = d;
      targetSetter(h => [...h, card]);
      return rest.length ? rest : createDeck();
    });
  }, []);

  const startRound = useCallback(() => {
    if (phase !== 'betting') return;
    if (bet <= 0 || bet > bank) {
      setMessage('Adjust bet within your bank.');
      return;
    }
    // place bet
    setBank(b => b - bet);
    setPlayerHand([]);
    setDealerHand([]);
    setRevealDealer(false);
    setHasDoubled(false);
    setPhase('dealing');

    // initial deal
    setTimeout(() => dealCard(setPlayerHand), 50);
    setTimeout(() => dealCard(setDealerHand), 150);
    setTimeout(() => dealCard(setPlayerHand), 250);
    setTimeout(() => dealCard(setDealerHand), 350);
  }, [phase, bet, bank, dealCard]);

  useEffect(() => {
    if (phase === 'dealing' && playerHand.length === 2 && dealerHand.length === 2) {
      // evaluate naturals
      const pBJ = isBlackjack(playerHand);
      const dBJ = isBlackjack(dealerHand);
      if (pBJ || dBJ) {
        setRevealDealer(true);
        if (pBJ && dBJ) {
          setMessage('Push! Both have Blackjack.');
          // return bet
          setBank(b => b + bet);
        } else if (pBJ) {
          setMessage('Blackjack! You win 3:2');
          setBank(b => b + bet + Math.floor(bet * 1.5));
        } else {
          setMessage('Dealer has Blackjack. You lose.');
        }
        setPhase('roundOver');
      } else {
        setMessage('Your move. Hit, Stand, or Double.');
        setPhase('player');
      }
    }
  }, [phase, playerHand, dealerHand, bet]);

  const hit = useCallback(() => {
    if (phase !== 'player') return;
    dealCard(setPlayerHand);
  }, [phase, dealCard]);

  const stand = useCallback(() => {
    if (phase !== 'player') return;
    setPhase('dealer');
    setRevealDealer(true);
  }, [phase]);

  const doubleDown = useCallback(() => {
    if (!canDouble) return;
    // take additional bet
    setBank(b => b - bet);
    setHasDoubled(true);
    dealCard(setPlayerHand);
    setTimeout(() => {
      setPhase('dealer');
      setRevealDealer(true);
    }, 250);
  }, [canDouble, bet, dealCard]);

  // Monitor player bust
  useEffect(() => {
    if (phase === 'player') {
      const { total } = handTotals(playerHand);
      if (total > 21) {
        setMessage('Bust! You lose.');
        setRevealDealer(true);
        setPhase('roundOver');
      }
    }
  }, [phase, playerHand]);

  // Dealer play when phase is dealer
  useEffect(() => {
    if (phase !== 'dealer') return;
    const playDealer = () => {
      const { total } = handTotals(dealerHand);
      if (total < 17) {
        dealCard(setDealerHand);
        setTimeout(playDealer, 500);
      } else {
        // settle
        const p = handTotals(playerHand).total;
        const d = total;
        if (d > 21) {
          setMessage('Dealer busts! You win.');
          // pay 2x bet total (since we removed bet from bank already)
          const payout = hasDoubled ? bet * 4 : bet * 2;
          setBank(b => b + payout);
        } else if (p > d) {
          setMessage('You win!');
          const payout = hasDoubled ? bet * 4 : bet * 2;
          setBank(b => b + payout);
        } else if (p < d) {
          setMessage('Dealer wins.');
        } else {
          setMessage('Push. Bet returned.');
          const returned = hasDoubled ? bet * 2 : bet;
          setBank(b => b + returned);
        }
        setPhase('roundOver');
      }
    };
    playDealer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const resetBank = useCallback(() => {
    setBank(1000);
    setBet(50);
    setMessage('Bank reset. Place your bet.');
    setPhase('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setRevealDealer(false);
    setHasDoubled(false);
  }, []);

  const increaseBet = useCallback(() => {
    if (phase !== 'betting') return;
    setBet(b => Math.min(500, Math.min(bank, b + 10)));
  }, [phase, bank]);

  const decreaseBet = useCallback(() => {
    if (phase !== 'betting') return;
    setBet(b => Math.max(10, b - 10));
  }, [phase]);

  const advice = useMemo(() => {
    const dealerUp = dealerHand[0];
    const suggestion = basicStrategyAdvice(playerHand, dealerUp, canDouble);
    return suggestion;
  }, [playerHand, dealerHand, canDouble]);

  const totals = {
    player: handTotals(playerHand).total,
    dealer: revealDealer ? handTotals(dealerHand).total : handTotals(dealerHand.slice(0, 1)).total,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <HeroSection />

      <main className="max-w-6xl w-full mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <div className="bg-neutral-900/70 backdrop-blur rounded-2xl border border-neutral-800 shadow-xl p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GameTable
                playerHand={playerHand}
                dealerHand={dealerHand}
                revealDealer={revealDealer}
                totals={totals}
              />
            </div>
            <div className="flex flex-col gap-4">
              <StatusPanel
                bank={bank}
                bet={bet}
                phase={phase}
                message={message}
                advice={advice}
                playerHand={playerHand}
                dealerUpCard={dealerHand[0]}
              />
              <Controls
                phase={phase}
                onDeal={startRound}
                onHit={hit}
                onStand={stand}
                onDouble={doubleDown}
                onIncreaseBet={increaseBet}
                onDecreaseBet={decreaseBet}
                onResetBank={resetBank}
                canDouble={canDouble}
                bet={bet}
                bank={bank}
              />
            </div>
          </div>
          {phase === 'roundOver' && (
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                onClick={() => {
                  setPlayerHand([]);
                  setDealerHand([]);
                  setRevealDealer(false);
                  setHasDoubled(false);
                  setMessage('Place your bet and press Deal');
                  setPhase('betting');
                }}
              >
                Next Round
              </button>
              <div className="text-sm text-neutral-400">Tip: Adjust your bet before dealing next round.</div>
            </div>
          )}
        </div>
        <footer className="py-10 text-center text-neutral-500 text-sm">Blackjack 2D with AI assistance • Built with React + Tailwind</footer>
      </main>
    </div>
  );
}
