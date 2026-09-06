import React, { useState } from 'react';
import {
  ArrowLeft,
  Bike,
  Store,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderType } from '../types';
import { formatPrice } from '../lib/format';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderSuccess: (orderId: string) => void;
  onOpenAuth: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBack,
  onOrderSuccess,
  onOpenAuth
}) => {
  const { user, profile } = useAuth();
  const { cart, cartTotal, settings, placeOrder } = useRestaurant();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [userName, setUserName] = useState(user?.displayName || profile?.displayName || '');
  const [userEmail, setUserEmail] = useState(user?.email || profile?.email || '');
  const [userPhone, setUserPhone] = useState(profile?.phoneNumber || '');
  const [deliveryAddress, setDeliveryAddress] = useState(profile?.defaultAddress || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'digital_wallet'>('cash');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Simulated Card inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Calculations
  const deliveryFee = orderType === 'delivery' ? settings.deliveryFee : 0;
  const tax = 0; // Menu prices are all-inclusive
  const finalTotal = Math.round(cartTotal + deliveryFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your basket is empty. Please add items before placing an order.');
      return;
    }

    if (!userName.trim()) {
      setErrorMsg('Please enter your full name for the order.');
      return;
    }

    if (!userPhone.trim()) {
      setErrorMsg('Please enter your contact phone number.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please enter your delivery street address.');
      return;
    }

    if (orderType === 'delivery' && cartTotal < settings.minDeliveryOrder) {
      setErrorMsg(`Minimum order for delivery is ${formatPrice(settings.minDeliveryOrder)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        selectedOptions: c.selectedOptions,
        subtotal: c.price * c.quantity
      }));

      const orderId = await placeOrder({
        userId: user?.uid || 'guest',
        userEmail: userEmail || 'guest@fastfood.local',
        userName,
        userPhone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : settings.address,
        items: orderItems,
        subtotal: cartTotal,
        deliveryFee,
        tax,
        total: finalTotal,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Debit/Credit Card'
            : paymentMethod === 'cash'
            ? (orderType === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Counter')
            : 'Easypaisa / JazzCash',
        paymentStatus: paymentMethod === 'cash' ? 'cash_on_delivery' : 'paid',
        status: 'pending',
        specialInstructions
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe ignore
      }

      onOrderSuccess(orderId);
    } catch (err: any) {
      console.error('Order error:', err);
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form: Fulfillment, Contact, Payment */}
        <div className="flex-1 space-y-6">
          {/* Sign In Banner if Guest */}
          {!user && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-400 font-bold uppercase">Customer Sign-in</p>
                <p className="text-sm text-gray-200">
                  Have an account? Sign in with Google to automatically fill your details.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-bold text-white transition whitespace-nowrap ml-3"
              >
                Sign In
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3.5 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Fulfillment Switch: Delivery vs Pickup */}
          <div className="bg-[#181b22] border border-white/10 rounded-2xl p-4">
            <h2 className="text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
              1. Choose Fulfillment Method
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  orderType === 'delivery'
                    ? 'border-orange-500 bg-orange-500/10 text-white shadow-md'
                    : 'border-white/10 bg-[#12141a] text-gray-400 hover:border-white/20'
                }`}
              >
                <Bike className="w-6 h-6 text-orange-400" />
                <span className="font-bold text-sm">Fast Delivery</span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" /> {settings.estimatedDeliveryTime}
                </span>
                <span className="text-xs font-semibold text-orange-300 mt-1">
                  ${settings.deliveryFee.toFixed(2)} Fee
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  orderType === 'pickup'
                    ? 'border-orange-500 bg-orange-500/10 text-white shadow-md'
                    : 'border-white/10 bg-[#12141a] text-gray-400 hover:border-white/20'
                }`}
              >
                <Store className="w-6 h-6 text-orange-400" />
                <span className="font-bold text-sm">Store Pickup</span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" /> {settings.estimatedPickupTime}
                </span>
                <span className="text-xs font-semibold text-emerald-400 mt-1">Free</span>
              </button>
            </div>

            {orderType === 'pickup' && (
              <div className="mt-3 p-3 bg-white/5 rounded-xl text-xs text-gray-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Pickup Location:</p>
                  <p className="text-gray-300">{settings.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Customer Details Form */}
          <div className="bg-[#181b22] border border-white/10 rounded-2xl p-4 space-y-4">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
              2. Contact & Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2.5 bg-[#12141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="e.g. 0370 0065241 or 0300 1234567"
                  className="w-full px-3.5 py-2.5 bg-[#12141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address (For Order Receipts)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. customer@example.com"
                className="w-full px-3.5 py-2.5 bg-[#12141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {orderType === 'delivery' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Delivery Address (House/Street/Phase) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. House #14, Street 2, Phase 5-B, Ghauri Town, Islamabad"
                  className="w-full px-3.5 py-2.5 bg-[#12141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Special Delivery Notes / Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Near Crown King Mall, call upon arrival"
                className="w-full px-3.5 py-2.5 bg-[#12141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#181b22] border border-white/10 rounded-2xl p-4 space-y-4">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
              3. Payment Selection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition ${
                  paymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-500/10 text-white shadow-md'
                    : 'border-white/10 bg-[#12141a] text-gray-400 hover:border-white/20'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">
                  {orderType === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Counter'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('digital_wallet')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition ${
                  paymentMethod === 'digital_wallet'
                    ? 'border-orange-500 bg-orange-500/10 text-white shadow-md'
                    : 'border-white/10 bg-[#12141a] text-gray-400 hover:border-white/20'
                }`}
              >
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Easypaisa / JazzCash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-500/10 text-white shadow-md'
                    : 'border-white/10 bg-[#12141a] text-gray-400 hover:border-white/20'
                }`}
              >
                <CreditCard className="w-5 h-5 text-orange-400" />
                <span className="text-xs font-bold">Credit/Debit Card</span>
              </button>
            </div>

            {paymentMethod === 'digital_wallet' && (
              <div className="p-3.5 bg-[#12141a] border border-amber-500/20 rounded-xl text-xs space-y-1.5 text-gray-300">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Mobile Wallet Instructions
                </p>
                <p>Send payment to restaurant account <strong className="text-white">0370-0065241</strong> (Burger Joints).</p>
                <p className="text-[11px] text-gray-400">Rider will verify receipt / TRX ID upon delivery.</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 bg-[#12141a] border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Simulated Card Payment Engine</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181b22] border border-white/10 rounded-lg text-xs font-mono text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Expires</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181b22] border border-white/10 rounded-lg text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181b22] border border-white/10 rounded-lg text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Cart list & total */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="bg-[#181b22] border border-white/10 rounded-2xl p-5 sticky top-24">
            <h3 className="text-base font-bold text-white mb-4">Order Summary</h3>

            {/* List of items */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 border-b border-white/10 pb-4 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-xs">
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-gray-200">
                      {item.quantity}x {item.name}
                    </span>
                    {item.selectedOptions && (
                      <p className="text-[10px] text-gray-400 truncate">
                        {Object.values(item.selectedOptions).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-gray-400 pb-4 border-b border-white/10">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Store Pickup'}</span>
                <span className="text-white">
                  {orderType === 'delivery' ? formatPrice(deliveryFee) : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-400">
                <span>GST / Taxes</span>
                <span>Included in Price</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 flex justify-between items-baseline mb-6">
              <span className="text-sm font-bold text-white">Grand Total</span>
              <span className="text-2xl font-black text-orange-400">
                {formatPrice(finalTotal)}
              </span>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting to Kitchen...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Fast Order ({formatPrice(finalTotal)})</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-gray-500 mt-3">
              Order directly sent to kitchen staff display & saved in database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
