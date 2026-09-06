import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Users,
  Eye,
  Search,
  Check,
  X,
  RefreshCw,
  Power,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { formatPrice } from '../lib/format';
import { BannerManager } from './BannerManager';

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { user } = useAuth();
  const {
    settings,
    updateSettings,
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    syncOfficialMenu
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'banners' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [isSyncingMenu, setIsSyncingMenu] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handlePerformSync = async () => {
    setIsSyncingMenu(true);
    setSyncFeedback(null);
    try {
      const res = await syncOfficialMenu();
      setSyncFeedback({
        type: res.persistedToFirestore ? 'success' : 'info',
        message: res.message
      });
      setShowSyncModal(false);
    } catch (err: any) {
      setSyncFeedback({
        type: 'info',
        message: err.message || 'Menu dishes loaded into active session.'
      });
      setShowSyncModal(false);
    } finally {
      setIsSyncingMenu(false);
    }
  };

  // New/Edit product form state
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: 9.99,
    categoryId: categories[0]?.id || '',
    image: '',
    rating: 4.8,
    reviewCount: 100,
    badge: '' as Product['badge'],
    isAvailable: true,
    isPopular: false,
    calories: '650 kcal'
  });

  // Settings form state
  const [settingForm, setSettingForm] = useState({
    name: settings.name,
    tagline: settings.tagline,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    openingHours: settings.openingHours,
    deliveryFee: settings.deliveryFee,
    minDeliveryOrder: settings.minDeliveryOrder,
    estimatedDeliveryTime: settings.estimatedDeliveryTime,
    estimatedPickupTime: settings.estimatedPickupTime,
    isOpen: settings.isOpen
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Calculate statistics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter(
    (o) => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status)
  );

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingProduct(false);
    setProdForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      categoryId: prod.categoryId,
      image: prod.image,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      badge: prod.badge || '',
      isAvailable: prod.isAvailable,
      isPopular: !!prod.isPopular,
      calories: prod.calories || '600 kcal'
    });
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setIsCreatingProduct(true);
    setProdForm({
      name: '',
      description: '',
      price: 550,
      categoryId: categories[0]?.id || '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewCount: 1,
      badge: 'NEW',
      isAvailable: true,
      isPopular: true,
      calories: '650 kcal'
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingProduct) {
      await createProduct(prodForm);
      setIsCreatingProduct(false);
    } else if (editingProduct) {
      await updateProduct(editingProduct.id, prodForm);
      setEditingProduct(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <UtensilsCrossed className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-white">
                Restaurant Kitchen & Manager Portal
              </h1>
              <p className="text-xs text-gray-400">
                Live restaurant operations, menu items, orders queue, and revenue telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Menu Sync */}
          <button
            onClick={() => setShowSyncModal(true)}
            disabled={isSyncingMenu}
            className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Sync all 35 official menu items and categories"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMenu ? 'animate-spin' : ''}`} />
            <span>{isSyncingMenu ? 'Syncing...' : 'Sync Official Menu'}</span>
          </button>

          {/* Kitchen Open Toggle Quick Switch */}
          <button
            onClick={async () => {
              const nextState = !settings.isOpen;
              await updateSettings({ isOpen: nextState });
              setSettingForm((prev) => ({ ...prev, isOpen: nextState }));
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition ${
              settings.isOpen
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Store is {settings.isOpen ? 'ONLINE & ACCEPTING' : 'OFFLINE (CLOSED)'}</span>
          </button>

          <button
            onClick={onExit}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold transition"
          >
            Exit to Storefront
          </button>
        </div>
      </div>

      {/* Sync Status Banner Feedback */}
      {syncFeedback && (
        <div className="max-w-7xl mx-auto mt-4">
          <div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs shadow-lg transition animate-in fade-in slide-in-from-top-2 ${
            syncFeedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                syncFeedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {syncFeedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-bold text-sm text-white">{syncFeedback.message}</p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  All 35 official dishes & 6 categories are now actively loaded and synchronized.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSyncFeedback(null)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Overview Analytics Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-[#161920] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Total Revenue</p>
            <p className="text-2xl font-black text-white mt-1">{formatPrice(totalRevenue)}</p>
            <span className="text-[10px] text-emerald-400 font-medium">All non-cancelled orders</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161920] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Pending Orders</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingOrders.length}</p>
            <span className="text-[10px] text-amber-400 font-medium">Awaiting kitchen confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161920] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">In Preparation</p>
            <p className="text-2xl font-black text-orange-400 mt-1">{activeOrders.length}</p>
            <span className="text-[10px] text-orange-400 font-medium">Cooking or on route</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161920] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Menu Dishes</p>
            <p className="text-2xl font-black text-white mt-1">{products.length}</p>
            <span className="text-[10px] text-gray-400">
              {products.filter((p) => p.isAvailable).length} currently active
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex space-x-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-[#161920] text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Live Orders Queue ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-[#161920] text-gray-400 hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          Menu & Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-[#161920] text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'banners'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-[#161920] text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Banners & Offers
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-[#161920] text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Shop Settings
        </button>
      </div>

      {/* TAB 1: ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {['all', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      orderFilter === st
                        ? 'bg-white/20 text-white'
                        : 'bg-[#161920] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-[#161920] border border-white/10 rounded-2xl p-12 text-center text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="font-bold text-white text-base">No orders matching filter: {orderFilter}</p>
              <p className="text-xs text-gray-400 mt-1">Placed customer orders will appear instantly here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-[#161920] rounded-2xl border p-5 flex flex-col justify-between space-y-4 shadow-lg ${
                    order.status === 'pending'
                      ? 'border-amber-500/50 bg-[#161920]'
                      : 'border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-black text-sm text-orange-400">
                          {order.id}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          order.orderType === 'delivery'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {order.orderType}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="p-2.5 bg-[#101217] rounded-xl text-xs space-y-1">
                      <p className="font-bold text-white">{order.userName}</p>
                      <p className="text-gray-400">{order.userPhone}</p>
                      {order.orderType === 'delivery' && (
                        <p className="text-gray-300 text-[11px]">{order.deliveryAddress}</p>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 text-xs border-t border-white/5 pt-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-gray-200">
                          <span>
                            {it.quantity}x {it.name}
                          </span>
                          <span className="text-gray-400">{formatPrice(it.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    {order.specialInstructions && (
                      <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg italic">
                        Note: {order.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Total:</span>
                      <span className="font-black text-base text-orange-400">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="w-full bg-[#101217] border border-white/10 rounded-lg text-xs py-1.5 px-2 text-white focus:outline-none focus:border-orange-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">Payment</label>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            updateOrderPaymentStatus(order.id, e.target.value as Order['paymentStatus'])
                          }
                          className="w-full bg-[#101217] border border-white/10 rounded-lg text-xs py-1.5 px-2 text-white focus:outline-none focus:border-orange-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cash_on_delivery">Cash on Hand</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Menu Dishes & Inventory ({products.length})</h2>
              <p className="text-xs text-gray-400">Manage pricing, availability, options, and categories.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSyncModal(true)}
                disabled={isSyncingMenu}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMenu ? 'animate-spin' : ''}`} />
                <span>{isSyncingMenu ? 'Syncing...' : 'Sync Official Menu Card'}</span>
              </button>

              <button
                onClick={handleOpenCreateProduct}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                Add New Dish
              </button>
            </div>
          </div>

          {/* Product edit/create modal */}
          {(editingProduct || isCreatingProduct) && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#161920] border border-white/10 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <h3 className="font-black text-lg">
                    {isCreatingProduct ? 'Create New Food Item' : `Edit: ${editingProduct?.name}`}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingProduct(false);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">Dish Name *</label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">Category *</label>
                    <select
                      value={prodForm.categoryId}
                      onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 mb-1 font-semibold">Price (Rs.) *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1 font-semibold">Calories</label>
                      <input
                        type="text"
                        value={prodForm.calories}
                        onChange={(e) => setProdForm({ ...prodForm, calories: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">Image URL *</label>
                    <input
                      type="url"
                      required
                      value={prodForm.image}
                      onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={prodForm.description}
                      onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 mb-1 font-semibold">Badge</label>
                      <select
                        value={prodForm.badge}
                        onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                      >
                        <option value="">None</option>
                        <option value="BESTSELLER">BESTSELLER</option>
                        <option value="CHEF'S PICK">CHEF'S PICK</option>
                        <option value="POPULAR">POPULAR</option>
                        <option value="NEW">NEW</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodForm.isAvailable}
                          onChange={(e) => setProdForm({ ...prodForm, isAvailable: e.target.checked })}
                          className="rounded border-white/20 bg-[#101217] text-orange-500 focus:ring-orange-500"
                        />
                        <span className="font-semibold text-gray-200">In Stock / Available</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingProduct(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/30"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#161920] border border-white/10 rounded-2xl p-4 flex gap-4 items-center justify-between"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover bg-black shrink-0"
                />

                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-bold text-sm text-white truncate">{prod.name}</h4>
                  <p className="text-xs text-orange-400 font-semibold">{formatPrice(prod.price)}</p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${
                      prod.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {prod.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditProduct(prod)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProductToDelete(prod)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white">Menu Categories</h2>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#161920] border border-white/10 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                    {cat.name.charAt(0)}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                    <p className="text-xs text-gray-400">Slug: {cat.slug} • Icon: {cat.iconName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      cat.isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BANNERS & OFFERS */}
      {activeTab === 'banners' && (
        <div className="max-w-7xl mx-auto">
          <BannerManager settings={settings} onUpdateSettings={updateSettings} />
        </div>
      )}

      {/* TAB 5: SHOP SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto bg-[#161920] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-black text-white">Shop Operating Information</h2>
              <p className="text-xs text-gray-400">
                Update restaurant address, contact number, delivery fees, and kitchen hours.
              </p>
            </div>
            {settingsSaved && (
              <span className="text-xs text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved to database
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Restaurant Name</label>
                <input
                  type="text"
                  value={settingForm.name}
                  onChange={(e) => setSettingForm({ ...settingForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Tagline / Slogan</label>
                <input
                  type="text"
                  value={settingForm.tagline}
                  onChange={(e) => setSettingForm({ ...settingForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={settingForm.phone}
                  onChange={(e) => setSettingForm({ ...settingForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Contact Email</label>
                <input
                  type="email"
                  value={settingForm.email}
                  onChange={(e) => setSettingForm({ ...settingForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Physical Shop Address</label>
              <input
                type="text"
                value={settingForm.address}
                onChange={(e) => setSettingForm({ ...settingForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Opening Hours</label>
              <input
                type="text"
                value={settingForm.openingHours}
                onChange={(e) => setSettingForm({ ...settingForm, openingHours: e.target.value })}
                className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Delivery Fee (Rs.)</label>
                <input
                  type="number"
                  step="1"
                  value={settingForm.deliveryFee}
                  onChange={(e) =>
                    setSettingForm({ ...settingForm, deliveryFee: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Min Order for Delivery (Rs.)</label>
                <input
                  type="number"
                  step="1"
                  value={settingForm.minDeliveryOrder}
                  onChange={(e) =>
                    setSettingForm({ ...settingForm, minDeliveryOrder: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Estimated Delivery Time</label>
                <input
                  type="text"
                  value={settingForm.estimatedDeliveryTime}
                  onChange={(e) => setSettingForm({ ...settingForm, estimatedDeliveryTime: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Estimated Pickup Prep Time</label>
                <input
                  type="text"
                  value={settingForm.estimatedPickupTime}
                  onChange={(e) => setSettingForm({ ...settingForm, estimatedPickupTime: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101217] border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 transition"
              >
                Save All Settings to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SYNC OFFICIAL MENU CONFIRMATION MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161920] border border-white/15 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Sync Official Menu Card</h3>
                <p className="text-xs text-gray-400">Printed restaurant menu & pricing</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs space-y-2 text-gray-300">
              <p className="font-bold text-white text-xs">This operation synchronizes:</p>
              <ul className="list-disc pl-4 space-y-1.5 text-gray-300 text-[11px] leading-relaxed">
                <li><strong className="text-white">35 authentic dishes</strong> across Burgers, Sandwiches, Fries, Platters, Deals 1-7, and Drinks.</li>
                <li><strong className="text-white">6 official categories</strong> with custom icons & ordering.</li>
                <li>Exact restaurant prices (e.g. Zinger Rs. 320, Platters Rs. 1,000, Margarita Rs. 250).</li>
                <li>Cleans up any outdated temporary items.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isSyncingMenu}
                onClick={handlePerformSync}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingMenu ? 'animate-spin' : ''}`} />
                <span>{isSyncingMenu ? 'Synchronizing Menu...' : 'Confirm & Sync Menu'}</span>
              </button>
              <button
                type="button"
                disabled={isSyncingMenu}
                onClick={() => setShowSyncModal(false)}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DELETION CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161920] border border-white/15 rounded-3xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Delete Food Item?</h3>
                <p className="text-xs text-gray-400">Remove dish from menu</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-white font-semibold">{productToDelete.name}</strong> from the active restaurant inventory?
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={async () => {
                  if (productToDelete) {
                    await deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
