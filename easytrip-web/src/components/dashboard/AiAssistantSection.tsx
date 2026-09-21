import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  Car, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Compass,
  UtensilsCrossed 
} from 'lucide-react';

interface AssistantQnA {
  question: string;
  summary: string;
  transit: string;
  safety: string;
  budget: string;
  destination: string;
  recommendation: string;
}

const KNOWLEDGE_BASE: Record<string, AssistantQnA> = {
  vizag: {
    question: 'What is the best local seafood & sunset spot in Vizag?',
    summary: 'For authentic coastal Andhra seafood, head directly to Sea Inn (Kabab House) near Lawson\'s Bay for spicy Prawn Fry and Royyala Biryani, or The Park Bamboo Bay right on Beach Road. For golden hour sunsets, take the Kailasagiri Ropeway cable car to the hilltop plateau overlooking the entire Bay of Bengal curve.',
    transit: 'Fly into Visakhapatnam Intl Airport (VTZ) or arrive at Visakhapatnam Junction (VSKP). App-based cabs and prepaid airport counters operate 24/7.',
    safety: 'Safety Score 98% • RK Beach and Rushikonda are well-lit with active marine police patrols. Rushikonda has certified Blue Flag lifeguards.',
    budget: '₹450 - ₹900 per meal at Sea Inn / Daspalla; ₹1,200 - ₹2,200 at Bamboo Bay. Total 3-day couple budget ~₹18,000 - ₹24,000 including stays.',
    destination: 'Vizag',
    recommendation: 'Pair the INS Kursura Submarine Museum at 09:00 AM before crowds, then head to Rushikonda for lunch and water sports.'
  },
  ooty: {
    question: 'Is it safe to drive to Ooty via the 36 hairpin bends at night?',
    summary: 'Driving up the 36 Hairpin Bends via Kalhatty Ghat road at night is strongly discouraged due to thick mountain fog, unlit hairpins, and wild elephant crossings. For night travel, use the smoother NH181 route via Mettupalayam and Coonoor, or schedule your ascent for daylight (07:00 AM - 05:00 PM).',
    transit: 'Coimbatore Intl Airport (CJB) is 88 km away. Alternatively, take the scenic UNESCO Nilgiri Mountain Toy Train from Mettupalayam.',
    safety: 'Safety Score 99% • Tamil Nadu highway checkposts strictly regulate vehicle permits. Daytime drive is safe and panoramic.',
    budget: 'Highland stays range from ₹2,400 (Zostel) to ₹14,500 (Savoy IHCL). Daily fuel & cab budget ~₹2,500 - ₹4,000.',
    destination: 'Ooty',
    recommendation: 'Start your drive early morning from Bengaluru or Coimbatore to enjoy tea plantation viewpoints in clear light.'
  },
  manali: {
    question: 'What is the realistic 3-day budget for a couple visiting Manali in INR?',
    summary: 'A realistic 3-day comfortable trip for a couple in Manali is ₹18,500 - ₹28,000 total. This covers a boutique cedar wood retreat in Old Manali (₹3,500 - ₹5,500/nt), riverside trout dining at Cafe 1947 and Johnson\'s Cafe (₹1,500 - ₹2,200/day), local sightseeing cabs, and Rohtang/Solang permits.',
    transit: 'Dedicated outstation AC Cab from Delhi/Chandigarh via NH3 Kiratpur expressway (8-11 hrs), or fly to Kullu-Bhuntar Airport (KUU - 50 km).',
    safety: 'Safety Score 97% • Border Roads Organisation maintains Atal Tunnel and NH3. Always check weather advisories for high-altitude passes.',
    budget: '₹22,500 - ₹28,000 all-inclusive for moderate tier; Backpacker tier can be managed around ₹12,000 - ₹15,000.',
    destination: 'Manali',
    recommendation: 'Spend Day 1 exploring Old Manali and Hadimba Temple on foot, and reserve Day 2 for Solang and Atal Tunnel.'
  },
  rajahmundry: {
    question: 'Should I take the train or fly from Vijayawada to Rajahmundry?',
    summary: 'Take the train! The Vande Bharat Express or Godavari Express takes only 2 hours from Vijayawada to Rajahmundry (RJY) and crosses the iconic Godavari Arch Bridge with breathtaking river panoramas for just ₹380 - ₹850. Driving via NH16 takes ~3.5 hours.',
    transit: 'Rajahmundry Railway Station (RJY) is centrally located right near Pushkar Ghat. Direct trains depart every 45 minutes.',
    safety: 'Safety Score 99% • Very safe heritage town with friendly local culture and easy riverfront promenades.',
    budget: 'Dining is ultra-affordable: ₹500 - ₹1,100 for legendary Godavari Pulasa fish curry at Srikanya Comfort, and ₹80 for Rose Milk Centre.',
    destination: 'Rajahmundry',
    recommendation: 'Arrive around sunset to catch the evening Godavari Aarti at Pushkar Ghat.'
  },
  paris: {
    question: 'Can you recommend iconic heritage dining and photo spots in Paris?',
    summary: 'For quintessentially Parisian dining, book Le Comptoir du Relais in Saint-Germain for duck confit, Carette at Place des Vosges for legendary hot chocolate, or historic Bouillon Chartier. For timeless photography, visit Champ de Mars at blue hour, Pont Alexandre III, and the stairs of Montmartre Sacré-Cœur.',
    transit: 'Paris Charles de Gaulle (CDG) / Orly (ORY), or Eurostar from London St Pancras arriving at Gare du Nord in 2h 15m.',
    safety: 'Safety Score 96% • Safe tourist districts; stay mindful of pickpockets on Metro Line 1 and around major monuments.',
    budget: 'Moderate travel budget: ₹18,000 - ₹25,000/day for couple including central boutique stay, museum passes, and bistro dining.',
    destination: 'Paris',
    recommendation: 'Book Louvre Museum and Eiffel Tower summit tickets 2-3 weeks in advance to skip 2-hour queues.'
  }
};

export const AiAssistantSection: React.FC = () => {
  const { openPlannerWithDestination } = useTrip();

  const [activeKey, setActiveKey] = useState<string>('vizag');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [customQuery, setCustomQuery] = useState<string>('');

  const activeData = KNOWLEDGE_BASE[activeKey] || KNOWLEDGE_BASE.vizag;

  const handleSelectPrompt = (key: string) => {
    if (key === activeKey) return;
    setIsTyping(true);
    setTimeout(() => {
      setActiveKey(key);
      setIsTyping(false);
    }, 450);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = customQuery.toLowerCase();
    if (!q) return;

    setIsTyping(true);
    setTimeout(() => {
      if (q.includes('ooty') || q.includes('nilgiri')) setActiveKey('ooty');
      else if (q.includes('manali') || q.includes('himachal')) setActiveKey('manali');
      else if (q.includes('rajahmundry') || q.includes('godavari')) setActiveKey('rajahmundry');
      else if (q.includes('paris') || q.includes('france')) setActiveKey('paris');
      else setActiveKey('vizag');
      setIsTyping(false);
      setCustomQuery('');
    }, 500);
  };

  return (
    <section id="ai-assistant-section" className="my-16 sm:my-20 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#182232] text-[#f3b740] text-xs font-bold border border-[#f3b740]/30">
          <Bot className="w-3.5 h-3.5" />
          <span>SECTION 04 — AI TRAVEL ASSISTANT</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
          Ask anything. Get instant travel intelligence.
        </h2>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          From ghat road driving safety and local culinary secrets to realistic INR budgeting and transit comparisons, get instant answers backed by real travel data.
        </p>
      </div>

      {/* Main Conversational Box Container */}
      <div className="surface-elevated rounded-md p-6 sm:p-8 border border-[#222d3d] shadow-2xl max-w-5xl mx-auto space-y-6 bg-[#141b26]">
        
        {/* Assistant Header Status */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222d3d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#f3b740] text-[#0e131f] flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#f1f5f9]">EasyTrip Intelligence Concierge</span>
                <span className="w-2 h-2 rounded-sm bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-[#94a3b8]">Live destination knowledge, route safety & INR budgets</p>
            </div>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-bold text-[#34d399] bg-[#062c20] px-2.5 py-1 rounded-sm border border-[#059669]/40">
            Automated Intelligence
          </span>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider block">
            Suggested Traveler Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'vizag', label: 'Vizag Seafood & Sunset Spots' },
              { key: 'ooty', label: 'Ooty 36 Hairpin Ghat Safety' },
              { key: 'manali', label: 'Manali 3-Day Couple Budget in INR' },
              { key: 'rajahmundry', label: 'Train vs Drive to Rajahmundry' },
              { key: 'paris', label: 'Paris Heritage Dining & Photo Spots' },
            ].map(p => (
              <button
                key={p.key}
                type="button"
                onClick={() => handleSelectPrompt(p.key)}
                className={`text-xs px-3.5 py-1.5 rounded-sm border font-semibold transition-all duration-200 active:scale-95 ${
                  activeKey === p.key && !isTyping
                    ? 'bg-[#f3b740] text-[#0e131f] border-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.3)]'
                    : 'bg-[#182232] text-[#cbd5e1] border-[#222d3d] hover:border-[#f3b740]/40 hover:text-[#f3b740]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat / Knowledge Card Display */}
        <div className="p-5 sm:p-6 rounded-md bg-[#121924] border border-[#222d3d] space-y-4 overflow-hidden">
          
          {/* User Prompt Bubble with Spring Slide */}
          <div className="flex items-start gap-3 justify-end animate-fade-in-up">
            <div className="max-w-xl bg-[#182232] text-[#f1f5f9] border border-[#222d3d] text-xs sm:text-sm font-semibold p-3.5 rounded-sm shadow-sm">
              {activeData.question}
            </div>
          </div>

          {/* Assistant Processing Indicator or Staggered Intelligence Cards */}
          {isTyping ? (
            <div className="flex items-center gap-3 py-6 px-4 bg-[#141b26] rounded-sm border border-[#222d3d] text-xs text-[#94a3b8] animate-fade-in">
              <div className="w-8 h-8 rounded-sm bg-[#182232] border border-[#222d3d] text-[#f3b740] flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span>Analyzing travel telemetry & verified local safety</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#f3b740] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#f3b740] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#f3b740] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-sm bg-[#f3b740] text-[#0e131f] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-4 bg-[#141b26] p-4 sm:p-5 rounded-sm border border-[#222d3d] shadow-sm text-xs text-[#cbd5e1]">
                {/* Main Summary */}
                <p className="text-sm font-normal text-[#f1f5f9] leading-relaxed">
                  {activeData.summary}
                </p>

                {/* Staggered Structured Intelligence Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#222d3d]">
                  <div className="p-3.5 rounded-sm bg-[#182232] border border-[#222d3d] space-y-1 animate-telemetry-slide hover:border-[#f3b740]/40 transition-colors">
                    <span className="text-[10px] uppercase font-bold text-[#f3b740] flex items-center gap-1">
                      <Car className="w-3 h-3 text-[#f3b740]" />
                      Transit & Arrival
                    </span>
                    <p className="text-xs text-[#cbd5e1] leading-normal">{activeData.transit}</p>
                  </div>

                  <div className="p-3.5 rounded-sm bg-[#062c20]/60 border border-[#059669]/40 space-y-1 animate-telemetry-slide hover:border-[#059669]/70 transition-colors" style={{ animationDelay: '100ms' }}>
                    <span className="text-[10px] uppercase font-bold text-[#34d399] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                      Safety Assessment
                    </span>
                    <p className="text-xs text-[#a7f3d0] leading-normal">{activeData.safety}</p>
                  </div>

                  <div className="p-3.5 rounded-sm bg-[#182232] border border-[#222d3d] space-y-1 animate-telemetry-slide hover:border-[#f3b740]/40 transition-colors" style={{ animationDelay: '200ms' }}>
                    <span className="text-[10px] uppercase font-bold text-[#34d399] flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-[#34d399]" />
                      Realistic INR Cost
                    </span>
                    <p className="text-xs text-[#cbd5e1] leading-normal">{activeData.budget}</p>
                  </div>
                </div>

                {/* Recommendation Pill & Plan CTA */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#222d3d]">
                  <div className="text-xs text-[#94a3b8]">
                    <strong className="text-[#f1f5f9]">Pro-Tip:</strong> {activeData.recommendation}
                  </div>

                  <button
                    onClick={() => openPlannerWithDestination(activeData.destination)}
                    className="px-4 py-2 rounded-sm bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-[0_0_12px_rgba(243,183,64,0.25)] transition-all self-start sm:self-auto active:scale-95"
                  >
                    <span>Plan {activeData.destination} Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Interactive Query Input Box */}
        <form onSubmit={handleCustomSubmit} className="relative flex items-center">
          <input
            type="text"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            placeholder="Ask anything about a destination, safety, transit, or budget..."
            className="w-full pl-4 pr-24 py-3.5 rounded-sm bg-[#161e2b] border border-[#222d3d] text-sm text-[#f1f5f9] placeholder-[#64748b] focus:bg-[#182232] focus:outline-none focus:border-[#f3b740] focus:ring-2 focus:ring-[#f3b740]/20 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-sm bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
          >
            <span>Ask AI</span>
            <Send className="w-3 h-3" />
          </button>
        </form>

      </div>
    </section>
  );
};
