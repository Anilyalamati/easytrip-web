import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  X, 
  Trash2, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Printer, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiUrl } from '../../utils/api';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    clearCart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    currentTrip,
    latestConfirmation,
    setLatestConfirmation
  } = useTrip();

  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@easytrip.com');
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.12);
  const discount = Math.round(subtotal * 0.05);
  const total = subtotal + tax - discount;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch(apiUrl('/api/bookings/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          traveler: { name, email, phone },
          paymentMethod,
          tripId: currentTrip?.id
        })
      });

      const data = await res.json();
      if (data.success) {
        setLatestConfirmation(data.data);
        clearCart();
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Ignore
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setLatestConfirmation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090c]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141b26] border border-[#222d3d] rounded-md p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222d3d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#182232] border border-[#f3b740]/40 flex items-center justify-center p-2">
              <CreditCard className="w-5 h-5 text-[#f3b740]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {latestConfirmation ? 'Reservation Voucher' : 'Complete Your Booking'}
              </h2>
              <p className="text-xs text-slate-400">
                {latestConfirmation ? 'EasyTrip Concierge Pass Issued' : 'Instant confirmation with EasyTrip 24/7 Concierge Protection'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-sm text-slate-400 hover:text-white hover:bg-[#182232] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Pass Screen */}
        {latestConfirmation ? (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-md bg-gradient-to-b from-[#182232] to-[#141b26] border border-[#f3b740]/40 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#222d3d] pb-4">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/easytrip_logo.png" alt="EasyTrip" className="w-7 h-7 object-contain" />
                  <span className="text-lg font-bold text-white">Easy<span className="gold-gradient-text">Trip</span> Pass</span>
                </div>
                <span className="px-3 py-1 rounded-sm bg-[#062c20] border border-[#059669]/40 text-[#34d399] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                </span>
              </div>

              {/* Pass Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#222d3d] text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Booking ID</span>
                  <span className="text-sm font-black text-[#f3b740] font-mono">{latestConfirmation.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Lead Traveler</span>
                  <span className="font-bold text-white">{latestConfirmation.traveler.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Paid</span>
                  <span className="font-bold text-[#34d399]">₹{latestConfirmation.pricing.total.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-bold text-slate-200">Guaranteed</span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-3 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Reserved Services:</span>
                {latestConfirmation.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-200 py-1 border-b border-[#222d3d]">
                    <span>{it.title} <span className="text-slate-400">({it.subtitle})</span></span>
                    <span className="font-semibold text-[#f3b740]">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Support & Concierge */}
              <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#f3b740]" />
                  {latestConfirmation.supportContact}
                </span>
                <span className="font-mono text-slate-500">2026-ET-SECURE</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-sm bg-[#182232] hover:bg-[#1f2c3f] text-slate-200 font-bold text-xs border border-[#222d3d] transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Voucher</span>
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-sm gold-gradient-bg text-[#0e131f] font-bold text-xs transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="mt-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <p className="text-sm">Your booking cart is empty.</p>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-sm bg-[#182232] text-[#f3b740] text-xs font-semibold border border-[#222d3d]"
                >
                  Browse Stays & Transport
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Cart Items List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Items ({cart.length})
                  </span>
                  {cart.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-sm bg-[#182232] border border-[#222d3d] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                      </div>
                      <div className="font-bold text-[#f3b740]">
                        ₹{item.price.toLocaleString('en-IN')} {item.quantity > 1 ? `x ${item.quantity}` : ''}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Traveler Information */}
                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Lead Traveler Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="px-3.5 py-2.5 rounded-sm bg-[#161e2b] border border-[#222d3d] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#f3b740] focus:ring-1 focus:ring-[#f3b740]"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="px-3.5 py-2.5 rounded-sm bg-[#161e2b] border border-[#222d3d] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#f3b740] focus:ring-1 focus:ring-[#f3b740]"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Mobile Number"
                      required
                      className="px-3.5 py-2.5 rounded-sm bg-[#161e2b] border border-[#222d3d] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#f3b740] focus:ring-1 focus:ring-[#f3b740]"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-md bg-[#182232] border border-[#222d3d] space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxes & Service Fees (12%)</span>
                    <span className="font-semibold text-slate-200">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#34d399]">
                    <span>EasyTrip Concierge Discount (5%)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#222d3d] text-sm font-bold text-white">
                    <span>Final Amount</span>
                    <span className="text-base text-[#f3b740] font-black">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-md gold-gradient-bg text-[#0e131f] font-extrabold text-sm tracking-wide shadow-gold-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? 'Issuing Reservation Pass...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
