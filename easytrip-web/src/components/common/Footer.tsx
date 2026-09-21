import React from 'react';
import { Compass, ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#222d3d] bg-[#08090c] text-[#94a3b8] py-14 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#182232] border border-[#222d3d] flex items-center justify-center p-1 shadow-sm">
              <img src="/assets/easytrip_logo.png" alt="EasyTrip" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-[#f1f5f9]">
                Easy<span className="text-[#f3b740]">Trip</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-[#182232] text-[#f3b740] border border-[#f3b740]/30 tracking-wider">
                PRO
              </span>
            </div>
          </div>
          
          <p className="text-sm text-[#94a3b8] max-w-sm leading-relaxed">
            Autonomous travel intelligence for modern explorers. Curating verified itineraries, interactive route corridors, and 24/7 tourist safety worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#062c20] border border-[#059669]/40 text-[11px] font-medium text-[#34d399]">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#34d399] animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            <span className="text-xs text-[#475569]">•</span>
            <span className="text-xs text-[#94a3b8]">v2.4 Production</span>
          </div>
        </div>

        {/* Product Capabilities */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#f1f5f9] mb-3.5">
            Platform
          </h4>
          <ul className="space-y-2.5 text-xs text-[#94a3b8]">
            <li><a href="#plan-section" className="hover:text-[#f3b740] transition-colors">AI Trip Planner</a></li>
            <li><a href="#navigation-section" className="hover:text-[#f3b740] transition-colors">Safe Navigation</a></li>
            <li><a href="#ai-assistant-section" className="hover:text-[#f3b740] transition-colors">Intelligence Assistant</a></li>
            <li><a href="#explore" className="hover:text-[#f3b740] transition-colors">Curated Catalog</a></li>
            <li><a href="#safety-section" className="hover:text-[#f3b740] transition-colors">Travel Safety SOS</a></li>
          </ul>
        </div>

        {/* Popular Corridors */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#f1f5f9] mb-3.5">
            Key Routes
          </h4>
          <ul className="space-y-2.5 text-xs text-[#94a3b8]">
            <li><span className="hover:text-[#f3b740] transition-colors cursor-pointer">Hyderabad → Vizag Coast</span></li>
            <li><span className="hover:text-[#f3b740] transition-colors cursor-pointer">Bengaluru → Ooty Ghats</span></li>
            <li><span className="hover:text-[#f3b740] transition-colors cursor-pointer">Delhi → Manali Highway</span></li>
            <li><span className="hover:text-[#f3b740] transition-colors cursor-pointer">London → Paris Express</span></li>
            <li><span className="hover:text-[#f3b740] transition-colors cursor-pointer">Goa Coastal Highway</span></li>
          </ul>
        </div>

        {/* Safety & Trust */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#f1f5f9] mb-3.5">
            Emergency & Trust
          </h4>
          <ul className="space-y-2.5 text-xs text-[#94a3b8]">
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" /> 112 National Police</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" /> 108 Ambulance Dispatch</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" /> 1363 Tourist Helpline</li>
            <li><span className="hover:text-[#f3b740] transition-colors cursor-pointer">Embassy Registry</span></li>
            <li><span className="hover:text-[#f3b740] transition-colors cursor-pointer">Privacy & Terms</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#222d3d] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748b] gap-4">
        <p>© 2026 EasyTrip Inc. All rights reserved. Plan more, worry less.</p>
        <div className="flex items-center gap-4">
          <span className="text-[#94a3b8]">INR (₹) Real Currency Engine</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#94a3b8]">
            Engineered for high-reliability travel worldwide
          </span>
        </div>
      </div>
    </footer>
  );
};
