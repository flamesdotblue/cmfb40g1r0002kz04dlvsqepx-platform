import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSection() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/nnNYb3ZFbRxKghMM/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-neutral-950 pointer-events-none" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Blackjack Arena</h1>
          <p className="mt-3 text-neutral-300 max-w-xl mx-auto">Play classic 2D Blackjack with real-time AI strategy advice. Interactive 3D hero powered by Spline.</p>
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-neutral-400">
            <span className="px-2 py-1 rounded-full bg-neutral-900/70 border border-neutral-800">Basic Strategy Advisor</span>
            <span className="px-2 py-1 rounded-full bg-neutral-900/70 border border-neutral-800">Responsive UI</span>
            <span className="px-2 py-1 rounded-full bg-neutral-900/70 border border-neutral-800">No signup</span>
          </div>
        </div>
      </div>
    </section>
  );
}
