import React from 'react';

function Card({ card, hidden = false, index = 0 }) {
  if (hidden) {
    return (
      <div className="w-16 h-24 md:w-20 md:h-28 bg-neutral-700 rounded-xl border-2 border-neutral-600 flex items-center justify-center shadow-inner select-none">
        <div className="w-12 h-16 bg-neutral-800 rounded-lg" />
      </div>
    );
  }
  const isRed = card.suit === '♥' || card.suit === '♦';
  return (
    <div
      className="w-16 h-24 md:w-20 md:h-28 bg-white rounded-xl border-2 border-neutral-200 shadow-md relative select-none"
      style={{ transform: `translateY(${Math.min(index * 4, 16)}px)` }}
    >
      <div className={`absolute top-1 left-1 text-sm md:text-base ${isRed ? 'text-red-600' : 'text-neutral-900'}`}>{card.rank}</div>
      <div className={`absolute bottom-1 right-1 text-sm md:text-base ${isRed ? 'text-red-600' : 'text-neutral-900'}`}>{card.suit}</div>
      <div className={`absolute inset-0 flex items-center justify-center text-2xl md:text-3xl ${isRed ? 'text-red-600' : 'text-neutral-900'}`}>{card.suit}</div>
    </div>
  );
}

export default function GameTable({ playerHand, dealerHand, revealDealer, totals }) {
  return (
    <div className="w-full bg-gradient-to-b from-emerald-900/30 to-emerald-950/40 rounded-2xl border border-emerald-800/40 p-4 md:p-6">
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="uppercase tracking-widest text-xs text-neutral-400">Dealer</h3>
            <div className="text-sm text-neutral-300">Total: {totals.dealer}</div>
          </div>
          <div className="flex gap-2 md:gap-3">
            {dealerHand.map((c, i) => (
              <Card key={c.id} card={c} hidden={i === 1 && !revealDealer} index={i} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="uppercase tracking-widest text-xs text-neutral-400">Player</h3>
            <div className="text-sm text-neutral-300">Total: {totals.player}</div>
          </div>
          <div className="flex gap-2 md:gap-3">
            {playerHand.map((c, i) => (
              <Card key={c.id} card={c} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
