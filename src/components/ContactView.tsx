import React from 'react';
import { Phone, Mail, MapPin, Clock, Bike, ShieldCheck, Utensils } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../lib/format';

export const ContactView: React.FC<{ onNavigateMenu: () => void }> = ({ onNavigateMenu }) => {
  const { settings } = useRestaurant();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-white">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black uppercase text-white tracking-wide">
          Visit Us or Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Serving hot, fresh burgers and crispy sides daily. Pickup at the counter or get it delivered to your door.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address Card */}
        <div className="bg-[#181b22] border border-white/10 rounded-3xl p-6 text-center flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Restaurant Location</h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
            {settings.address}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 underline pt-2"
          >
            Get Directions in Maps
          </a>
        </div>

        {/* Hours Card */}
        <div className="bg-[#181b22] border border-white/10 rounded-3xl p-6 text-center flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Operating Hours</h3>
          <p className="text-xs text-gray-300 font-semibold">{settings.openingHours}</p>
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full ${
              settings.isOpen
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {settings.isOpen ? 'Currently Open & Cooking' : 'Currently Closed'}
          </span>
        </div>

        {/* Contact Card */}
        <div className="bg-[#181b22] border border-white/10 rounded-3xl p-6 text-center flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Call or Inquire</h3>
          <p className="text-xs text-gray-400">Direct order counter & catering line</p>
          <a
            href={`tel:${settings.phone}`}
            className="text-base font-black text-orange-400 hover:text-orange-300"
          >
            {settings.phone}
          </a>
          <p className="text-xs text-gray-500">{settings.email}</p>
        </div>
      </div>

      {/* Fulfillment Policy Box */}
      <div className="bg-[#161920] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
          Delivery & Pickup Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Bike className="w-5 h-5 text-orange-400" />
              <span>Direct Doorstep Delivery</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Standard local delivery is delivered hot within approx{' '}
              <strong className="text-white">{settings.estimatedDeliveryTime}</strong>. Minimum order requirement is{' '}
              <strong className="text-white">{formatPrice(settings.minDeliveryOrder)}</strong> with a flat fee of{' '}
              <strong className="text-white">{formatPrice(settings.deliveryFee)}</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Utensils className="w-5 h-5 text-orange-400" />
              <span>Counter Pickup / Takeaway</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Skip the queue! Your order is freshly prepared and ready at our counter in approx{' '}
              <strong className="text-white">{settings.estimatedPickupTime}</strong> with zero fulfillment fees.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          <button
            onClick={onNavigateMenu}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition"
          >
            Start Your Order Now
          </button>
        </div>
      </div>
    </div>
  );
};
