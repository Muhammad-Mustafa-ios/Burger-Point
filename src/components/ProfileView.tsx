import React, { useState } from 'react';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderStatus } from '../types';
import { formatPrice } from '../lib/format';

export const ProfileView: React.FC<{ onNavigateMenu: () => void }> = ({ onNavigateMenu }) => {
  const { user, profile, updateProfileData, signOut } = useAuth();
  const { orders } = useRestaurant();

  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [defaultAddress, setDefaultAddress] = useState(profile?.defaultAddress || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter orders for current customer
  const myOrders = orders.filter(
    (o) =>
      (user && o.userId === user.uid) ||
      (user && o.userEmail?.toLowerCase() === user.email?.toLowerCase())
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData({
        displayName,
        phoneNumber,
        defaultAddress
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded text-[11px] font-bold">Delivered / Completed</span>;
      case 'preparing':
        return <span className="bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded text-[11px] font-bold">Kitchen Preparing</span>;
      case 'ready':
        return <span className="bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded text-[11px] font-bold">Ready for Pickup</span>;
      case 'out_for_delivery':
        return <span className="bg-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded text-[11px] font-bold">Driver on the way</span>;
      case 'cancelled':
        return <span className="bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded text-[11px] font-bold">Order Received</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Profile Header */}
      <div className="bg-[#181b22] border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-600/30">
            {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{displayName || 'Customer'}</h1>
            <p className="text-xs text-gray-400">{user?.email || 'No email registered'}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-orange-400 border border-white/10">
              Role: {profile?.role || 'Customer'}
            </span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Edit Profile Details */}
        <div className="md:col-span-1">
          <div className="bg-[#181b22] border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-orange-500" />
              Default Details
            </h2>

            {saveSuccess && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-[#12141a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Default Delivery Address</label>
                <textarea
                  rows={3}
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  placeholder="Street, apartment, floor, entry code..."
                  className="w-full px-3 py-2 bg-[#12141a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Order History */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              Your Order History ({myOrders.length})
            </h2>

            <button
              onClick={onNavigateMenu}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
            >
              Order More Food <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myOrders.length === 0 ? (
            <div className="bg-[#181b22] border border-white/10 rounded-2xl p-8 text-center text-gray-400 space-y-3">
              <Package className="w-12 h-12 mx-auto text-gray-600" />
              <h3 className="font-bold text-white text-sm">No orders yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                You haven't placed any food orders with this account yet. Check out our delicious burgers!
              </p>
              <button
                onClick={onNavigateMenu}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#181b22] border border-white/10 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-orange-400">
                        {order.id}
                      </span>
                      <span className="text-xs text-gray-400 block">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold px-2 py-0.5 rounded bg-white/5">
                        {order.orderType}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-gray-300">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span className="text-white font-medium">{formatPrice(it.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      Payment: <strong className="text-gray-200">{order.paymentMethod}</strong>
                    </span>
                    <span className="text-sm font-black text-white">
                      Total: <span className="text-orange-400">{formatPrice(order.total)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
