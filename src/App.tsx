import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { OffersView } from './components/OffersView';
import { ContactView } from './components/ContactView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmation } from './components/OrderConfirmation';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Product } from './types';
import { ShieldAlert, Lock, ArrowLeft, LogIn } from 'lucide-react';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Navigation router
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderId: string) => {
    setConfirmedOrderId(orderId);
    setCurrentView('order_confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin mode, check if user is authorized admin
  if (currentView === 'admin') {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#0d0f14] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161920] border border-white/10 rounded-3xl p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Admin Access Only</h2>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                The Restaurant Kitchen & Manager Portal is strictly restricted to authorized administrators.
              </p>
              {user && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Logged in as: <span className="text-gray-300 font-mono">{user.email}</span> (Not an admin)
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              {!user ? (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In with Admin Account
                </button>
              ) : null}

              <button
                onClick={() => handleNavigate('home')}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Storefront
              </button>
            </div>
          </div>
          {authModalOpen && <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />}
        </div>
      );
    }

    return <AdminDashboard onExit={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Display */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateMenu={() => handleNavigate('menu')}
            onOrderNow={() => handleNavigate('menu')}
          />
        )}

        {currentView === 'menu' && (
          <MenuView onSelectProduct={(p) => setSelectedProduct(p)} />
        )}

        {currentView === 'offers' && (
          <OffersView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateMenu={() => handleNavigate('menu')}
          />
        )}

        {currentView === 'contact' && (
          <ContactView onNavigateMenu={() => handleNavigate('menu')} />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onBack={() => handleNavigate('menu')}
            onOrderSuccess={handleOrderSuccess}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'order_confirmation' && (
          <OrderConfirmation
            orderId={confirmedOrderId || 'ORD-RECENT'}
            onNavigateHome={() => handleNavigate('home')}
            onViewOrders={() => handleNavigate('profile')}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView onNavigateMenu={() => handleNavigate('menu')} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Floating Bottom Bar */}
      <MobileBottomBar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Product Detail & Customization Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Side Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onCheckout={() => {
          setCartDrawerOpen(false);
          handleNavigate('checkout');
        }}
      />

      {/* Google Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <AppContent />
      </RestaurantProvider>
    </AuthProvider>
  );
}
