import React, { useMemo } from 'react';

function HandSummary({ playerHand, dealerUpCard }) {
  const countRanks = (hand) => hand.reduce((acc, c) => ({ ...acc, [c.rank]: (acc[c.rank] || 0) + 1 }), {});
  const playerCounts = useMemo(() => countRanks(playerHand), [playerHand]);

  return (
    <div className="text-xs text-neutral-400">
      <div className="mb-2">Dealer upcard: <span className="text-neutral-200">{dealerUpCard ? `${dealerUpCard.rank}${dealerUpCard.suit}` : '—'}</span></div>
      <div>Your hand composition:</div>
      <div className="mt-1 grid grid-cols-6 gap-1">
        {Object.entries(playerCounts).map(([r, n]) => (
          <div key={r} className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-center">{r}×{n}</div>
        ))}
        {Object.keys(playerCounts).length === 0 && (
          <div className="col-span-6 text-center text-neutral-600">No cards yet</div>
        )}
      </div>
    </div>
  );
}

export default function StatusPanel({ bank, bet, phase, message, advice, playerHand, dealerUpCard }) {
  return (
    <div className="bg-neutral-900/70 rounded-xl border border-neutral-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">Status</div>
        <div className="text-sm text-neutral-400">Bank: <span className="text-neutral-200">${bank}</span> • Bet: <span className="text-neutral-200">${bet}</span></div>
      </div>
      <div className="rounded-lg bg-neutral-800/60 border border-neutral-700 p-3">
        <div className="text-sm">{message}</div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-neutral-300">AI Advice</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xl font-bold tracking-wide">
            {advice}
          </div>
          <div className="text-xs text-neutral-400">Strategy based on your hand vs dealer upcard</div>
        </div>
      </div>

      <div className="mt-4">
        <HandSummary playerHand={playerHand} dealerUpCard={dealerUpCard} />
      </div>

      <div className="mt-4 text-xs text-neutral-500">
        Note: Double is recommended only when allowed on first decision and sufficient bank.
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
        <div className="p-2 rounded bg-neutral-900 border border-neutral-800">Phases: betting → player → dealer → roundOver</div>
        <div className="p-2 rounded bg-neutral-900 border border-neutral-800">Blackjack pays 3:2. Dealer stands on all 17.</div>
      </div>
    </div>
  );
}
