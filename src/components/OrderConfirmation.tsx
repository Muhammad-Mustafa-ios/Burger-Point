import React from 'react';
import { CheckCircle, Clock, MapPin, ArrowRight, Phone, Receipt } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../lib/format';

interface OrderConfirmationProps {
  orderId: string;
  onNavigateHome: () => void;
  onViewOrders: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  onNavigateHome,
  onViewOrders
}) => {
  const { orders, settings } = useRestaurant();
  const order = orders.find((o) => o.id === orderId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-white text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10 border border-emerald-500/30 animate-bounce">
        <CheckCircle className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-black text-white tracking-wide">
        Order Received & Cooking!
      </h1>
      <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
        Your fast food order has been sent to our kitchen counter. We are grilling it fresh right now.
      </p>

      {/* Order Reference Box */}
      <div className="mt-8 bg-[#181b22] border border-white/10 rounded-2xl p-6 text-left space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs text-gray-400 block">Order Number</span>
            <span className="text-lg font-black text-orange-400">{orderId}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Fulfillment Type</span>
            <span className="text-xs uppercase font-bold px-2.5 py-1 rounded bg-white/10 text-white inline-block mt-0.5">
              {order?.orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
            </span>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="p-4 bg-[#12141a] rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-orange-500" />
              Estimated Time:
            </span>
            <span className="text-white font-bold">
              {order?.orderType === 'delivery'
                ? settings.estimatedDeliveryTime
                : settings.estimatedPickupTime}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-orange-500" />
              Destination:
            </span>
            <span className="text-white font-medium max-w-[240px] truncate">
              {order?.deliveryAddress || settings.address}
            </span>
          </div>
        </div>

        {/* Items summary */}
        {order && (
          <div className="border-t border-white/10 pt-3 text-xs space-y-2">
            <div className="flex justify-between text-gray-400 font-semibold">
              <span>Items Ordered:</span>
              <span>Total Paid: {formatPrice(order.total)}</span>
            </div>
            <ul className="space-y-1 text-gray-300">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {i.quantity}x {i.name}
                  </span>
                  <span>{formatPrice(i.subtotal)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onViewOrders}
          className="px-6 py-3 rounded-xl bg-[#181b22] hover:bg-[#222733] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <Receipt className="w-4 h-4 text-orange-400" />
          View in Order History
        </button>

        <button
          onClick={onNavigateHome}
          className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition"
        >
          <span>Back to Main Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-8 flex items-center justify-center gap-1.5">
        Need assistance with your order? Call the shop at
        <a href={`tel:${settings.phone}`} className="text-orange-400 underline font-medium">
          {settings.phone}
        </a>
      </p>
    </div>
  );
};
