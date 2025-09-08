import React from 'react';

export default function Controls({
  phase,
  onDeal,
  onHit,
  onStand,
  onDouble,
  onIncreaseBet,
  onDecreaseBet,
  onResetBank,
  canDouble,
  bet,
  bank,
}) {
  const bettingDisabled = phase !== 'betting';
  return (
    <div className="bg-neutral-900/70 rounded-xl border border-neutral-800 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onDecreaseBet}
            disabled={bettingDisabled}
            className={`px-3 py-2 rounded-lg border transition ${bettingDisabled ? 'border-neutral-800 text-neutral-600' : 'border-neutral-700 hover:bg-neutral-800'}`}
          >
            -10
          </button>
          <div className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700">Bet: ${bet}</div>
          <button
            onClick={onIncreaseBet}
            disabled={bettingDisabled}
            className={`px-3 py-2 rounded-lg border transition ${bettingDisabled ? 'border-neutral-800 text-neutral-600' : 'border-neutral-700 hover:bg-neutral-800'}`}
          >
            +10
          </button>
        </div>
        <button
          onClick={onResetBank}
          className="px-3 py-2 rounded-lg border border-red-800 text-red-300 hover:bg-red-900/20 transition"
        >
          Reset Bank
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDeal}
          disabled={phase !== 'betting' || bet <= 0 || bet > bank}
          className={`px-4 py-3 rounded-lg font-semibold transition ${phase === 'betting' && bet > 0 && bet <= bank ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-neutral-800 text-neutral-500'}`}
        >
          Deal
        </button>
        <button
          onClick={onDouble}
          disabled={!canDouble}
          className={`px-4 py-3 rounded-lg font-semibold transition ${canDouble ? 'bg-amber-600 hover:bg-amber-500' : 'bg-neutral-800 text-neutral-500'}`}
        >
          Double
        </button>
        <button
          onClick={onHit}
          disabled={phase !== 'player'}
          className={`px-4 py-3 rounded-lg font-semibold transition ${phase === 'player' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-neutral-800 text-neutral-500'}`}
        >
          Hit
        </button>
        <button
          onClick={onStand}
          disabled={phase !== 'player'}
          className={`px-4 py-3 rounded-lg font-semibold transition ${phase === 'player' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-neutral-800 text-neutral-500'}`}
        >
          Stand
        </button>
      </div>
      <div className="text-xs text-neutral-500">Bank: ${bank} • {phase === 'betting' ? 'Place your bet and Deal' : phase === 'player' ? 'Your turn' : phase === 'dealer' ? 'Dealer playing' : phase === 'roundOver' ? 'Round over' : 'Dealing...'}</div>
    </div>
  );
}
