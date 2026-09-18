import { ChefHat, ShieldCheck, ThermometerSnowflake, Heart, Zap, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-white/10 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-900">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Temperature Controlled Pods</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Heated insulation chambers maintain 145°F core temperature during high-velocity transport.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4CAF50]/15 text-[#4CAF50] border border-[#4CAF50]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Traceable Farming</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Direct partnerships with verified regenerative farms. No seed oils or refined fillers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed 18-30m Dispatch</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Algorithmic kitchen staging optimizes order firing moments to ensure zero shelf idling.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ChefHat className="w-4 h-4 text-[#FF5722]" />
            <span className="font-extrabold text-white">AuraBite Gastronomy System</span>
            <span className="text-slate-600">|</span>
            <span>Architect-Grade Food-Tech Application</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Engineered with React 19, Motion, and Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
