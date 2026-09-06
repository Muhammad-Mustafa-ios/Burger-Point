import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Eye,
  Sparkles,
  ArrowRight,
  Palette,
  Layers
} from 'lucide-react';
import { HeroBanner, OfferBanner, RestaurantSettings } from '../types';

interface BannerManagerProps {
  settings: RestaurantSettings;
  onUpdateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<void>;
}

export const BannerManager: React.FC<BannerManagerProps> = ({ settings, onUpdateSettings }) => {
  const [subTab, setSubTab] = useState<'hero' | 'offer'>('hero');
  const [editingHero, setEditingHero] = useState<HeroBanner | null>(null);
  const [isCreatingHero, setIsCreatingHero] = useState<boolean>(false);
  const [editingOffer, setEditingOffer] = useState<OfferBanner | null>(null);
  const [isCreatingOffer, setIsCreatingOffer] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<{ type: 'hero' | 'offer'; id: string; title: string } | null>(null);

  // Hero form state
  const [heroForm, setHeroForm] = useState<HeroBanner>({
    id: '',
    badge: 'LIMITED TIME OFFER',
    title: 'SMASH BURGER &\nGRILL SANDWICH',
    subtitle: '100% prime beef smashed patties, real cheddar cheese & secret house sauces.',
    buttonText: 'Order Now',
    buttonLink: 'menu',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    backgroundColor: '#073B24',
    textColor: '#FFFFFF',
    isActive: true
  });

  // Offer form state
  const [offerForm, setOfferForm] = useState<OfferBanner>({
    id: '',
    badge: 'SPECIAL PLATTER',
    title: 'ALL PLATTERS AT RS. 1,000',
    subtitle: 'Wings, Shawarma, Chicken Pieces, Paratha Rolls & Fries.',
    buttonText: 'Order Platter',
    discountTag: 'RS. 1000',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
    backgroundColor: '#EAF4EC',
    isActive: true
  });

  const heroBanners: HeroBanner[] = settings.heroBanners || [];
  const offerBanners: OfferBanner[] = settings.offerBanners || [];

  // File upload handler for converting image to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'offer') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (PNG, JPG, WEBP).');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (target === 'hero') {
        setHeroForm(prev => ({ ...prev, imageUrl: dataUrl }));
      } else {
        setOfferForm(prev => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Hero banner actions
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated: HeroBanner[];
      if (isCreatingHero) {
        const newBanner: HeroBanner = {
          ...heroForm,
          id: `hero-${Date.now()}`
        };
        updated = [...heroBanners, newBanner];
      } else if (editingHero) {
        updated = heroBanners.map(b => (b.id === editingHero.id ? { ...heroForm, id: b.id } : b));
      } else {
        return;
      }

      await onUpdateSettings({ heroBanners: updated });
      setIsCreatingHero(false);
      setEditingHero(null);
      notifySuccess('Hero banner saved successfully!');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save hero banner.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteHero = async (id: string) => {
    setIsSaving(true);
    try {
      const updated = heroBanners.filter(b => b.id !== id);
      await onUpdateSettings({ heroBanners: updated });
      notifySuccess('Hero banner removed.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      setBannerToDelete(null);
    }
  };

  const handleToggleHeroActive = async (banner: HeroBanner) => {
    const updated = heroBanners.map(b => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b));
    await onUpdateSettings({ heroBanners: updated });
  };

  // Offer banner actions
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated: OfferBanner[];
      if (isCreatingOffer) {
        const newBanner: OfferBanner = {
          ...offerForm,
          id: `offer-${Date.now()}`
        };
        updated = [...offerBanners, newBanner];
      } else if (editingOffer) {
        updated = offerBanners.map(b => (b.id === editingOffer.id ? { ...offerForm, id: b.id } : b));
      } else {
        return;
      }

      await onUpdateSettings({ offerBanners: updated });
      setIsCreatingOffer(false);
      setEditingOffer(null);
      notifySuccess('Offer banner saved successfully!');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save offer banner.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteOffer = async (id: string) => {
    setIsSaving(true);
    try {
      const updated = offerBanners.filter(b => b.id !== id);
      await onUpdateSettings({ offerBanners: updated });
      notifySuccess('Offer banner removed.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      setBannerToDelete(null);
    }
  };

  const handleToggleOfferActive = async (banner: OfferBanner) => {
    const updated = offerBanners.map(b => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b));
    await onUpdateSettings({ offerBanners: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-400" />
            Storefront Banner Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Update homepage carousel sliders, promo cards, and offer banners with custom image uploads.
          </p>
        </div>

        {/* Sub-tab selection */}
        <div className="flex items-center gap-2 bg-[#161920] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => {
              setSubTab('hero');
              setIsCreatingHero(false);
              setEditingHero(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'hero'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Hero Carousel Banners ({heroBanners.length})
          </button>
          <button
            onClick={() => {
              setSubTab('offer');
              setIsCreatingOffer(false);
              setEditingOffer(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'offer'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Special Deals & Offer Banners ({offerBanners.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ================= HERO BANNERS SECTION ================= */}
      {subTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Hero carousel banners appear at the top of the homepage with prominent call-to-actions.
            </p>
            {!isCreatingHero && !editingHero && (
              <button
                onClick={() => {
                  setHeroForm({
                    id: '',
                    badge: 'NEW PROMOTION',
                    title: 'BETTER BURGERS.\nBETTER TASTE.',
                    subtitle: 'Freshly smashed beef patties and crunchy crispy zingers in Ghauri Town.',
                    buttonText: 'Order Now',
                    buttonLink: 'menu',
                    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
                    backgroundColor: '#073B24',
                    textColor: '#FFFFFF',
                    isActive: true
                  });
                  setIsCreatingHero(true);
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                Add New Hero Banner
              </button>
            )}
          </div>

          {/* Creation / Edit Form for Hero Banner */}
          {(isCreatingHero || editingHero) && (
            <div className="bg-[#161920] border border-orange-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-orange-400" />
                  {isCreatingHero ? 'Create New Hero Banner' : 'Edit Hero Banner'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingHero(false);
                    setEditingHero(null);
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Badge & Title */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={heroForm.badge}
                        onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                        placeholder="e.g. BEST IN TOWN, LIMITED TIME"
                        className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Title (Use Enter / \n for new line)
                      </label>
                      <textarea
                        value={heroForm.title}
                        onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                        placeholder="BETTER BURGERS.&#10;BETTER TASTE."
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Subtitle / Description</label>
                      <textarea
                        value={heroForm.subtitle}
                        onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                        placeholder="Made with 100% prime beef, real cheese & quality toppings."
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Button Label</label>
                        <input
                          type="text"
                          value={heroForm.buttonText}
                          onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                          placeholder="Order Now"
                          className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Card Background Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={heroForm.backgroundColor || '#073B24'}
                            onChange={(e) => setHeroForm({ ...heroForm, backgroundColor: e.target.value })}
                            className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border border-white/20 p-0.5"
                          />
                          <input
                            type="text"
                            value={heroForm.backgroundColor || '#073B24'}
                            onChange={(e) => setHeroForm({ ...heroForm, backgroundColor: e.target.value })}
                            className="flex-1 px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banner Image & Upload */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Banner Image (Upload File or Enter URL)
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={heroForm.imageUrl}
                          onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/... or data:image/..."
                          className="flex-1 px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>

                      {/* File Upload Drop Area */}
                      <label className="border-2 border-dashed border-white/20 hover:border-orange-500/60 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10 transition group">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition mb-1" />
                        <span className="text-xs font-semibold text-gray-300 group-hover:text-white">
                          Click to Browse & Upload Image
                        </span>
                        <span className="text-[10px] text-gray-500">Supports PNG, JPG, WEBP (Auto converted)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'hero')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Live Preview Box */}
                    <div>
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mb-1.5">
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        Live Storefront Preview:
                      </span>
                      <div
                        className="rounded-2xl p-4 overflow-hidden relative shadow-lg min-h-[140px] flex items-center justify-between"
                        style={{ backgroundColor: heroForm.backgroundColor || '#073B24' }}
                      >
                        <div className="space-y-1.5 z-10 max-w-[65%]">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#E31837] text-white text-[9px] font-black tracking-wider uppercase">
                            {heroForm.badge}
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-white leading-tight uppercase whitespace-pre-line">
                            {heroForm.title}
                          </h4>
                          <p className="text-[11px] text-white/80 line-clamp-2">
                            {heroForm.subtitle}
                          </p>
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31837] text-white text-[10px] font-bold">
                              {heroForm.buttonText}
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>

                        {heroForm.imageUrl && (
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-md shrink-0">
                            <img
                              src={heroForm.imageUrl}
                              alt="Banner preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingHero(false);
                      setEditingHero(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition flex items-center gap-2 shadow-md shadow-orange-500/20"
                  >
                    <Check className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Banner'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of existing hero banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroBanners.map((banner, index) => (
              <div
                key={banner.id || index}
                className={`bg-[#161920] border rounded-2xl p-4 flex flex-col justify-between transition ${
                  banner.isActive ? 'border-white/15' : 'border-white/5 opacity-60'
                }`}
              >
                <div>
                  {/* Banner miniature preview */}
                  <div
                    className="h-28 rounded-xl p-3 flex items-center justify-between mb-3 relative overflow-hidden"
                    style={{ backgroundColor: banner.backgroundColor || '#073B24' }}
                  >
                    <div className="max-w-[65%] z-10">
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-[#E31837] text-white text-[8px] font-black uppercase">
                        {banner.badge}
                      </span>
                      <p className="text-xs font-black text-white leading-tight uppercase mt-1 whitespace-pre-line line-clamp-2">
                        {banner.title}
                      </p>
                      <p className="text-[9px] text-white/80 line-clamp-1 mt-0.5">{banner.subtitle}</p>
                    </div>

                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 shrink-0">
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold text-white">Slide #{index + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      banner.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {banner.isActive ? 'Active on Carousel' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
                  <button
                    onClick={() => handleToggleHeroActive(banner)}
                    className="text-xs font-semibold text-gray-300 hover:text-white"
                  >
                    {banner.isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setHeroForm({ ...banner });
                        setEditingHero(banner);
                        setIsCreatingHero(false);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setBannerToDelete({ type: 'hero', id: banner.id, title: banner.title || 'Hero Banner' })}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= OFFER BANNERS SECTION ================= */}
      {subTab === 'offer' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Offer & Deal banners appear on the homepage and special Offers tab to highlight combos.
            </p>
            {!isCreatingOffer && !editingOffer && (
              <button
                onClick={() => {
                  setOfferForm({
                    id: '',
                    badge: 'LIMITED DEAL',
                    title: 'ALL PLATTERS AT RS. 1,000',
                    subtitle: 'Choose between 6 Wings + Shawarma, 3 Pcs Chicken + Paratha, or Shawarma + Paratha Combos!',
                    buttonText: 'Order Platter',
                    discountTag: 'RS. 1000',
                    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
                    backgroundColor: '#EAF4EC',
                    isActive: true
                  });
                  setIsCreatingOffer(true);
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                Add New Offer Banner
              </button>
            )}
          </div>

          {/* Creation / Edit Form for Offer Banner */}
          {(isCreatingOffer || editingOffer) && (
            <div className="bg-[#161920] border border-orange-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-orange-400" />
                  {isCreatingOffer ? 'Create New Offer Banner' : 'Edit Offer Banner'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingOffer(false);
                    setEditingOffer(null);
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveOffer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Badge & Title */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={offerForm.badge}
                          onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                          placeholder="e.g. SPECIAL PLATTER"
                          className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Discount Tag (Pill)</label>
                        <input
                          type="text"
                          value={offerForm.discountTag || ''}
                          onChange={(e) => setOfferForm({ ...offerForm, discountTag: e.target.value })}
                          placeholder="e.g. 30% OFF, RS. 1000"
                          className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={offerForm.title}
                        onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                        placeholder="e.g. ALL PLATTERS AT RS. 1,000"
                        className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Subtitle</label>
                      <textarea
                        value={offerForm.subtitle}
                        onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                        placeholder="Wings, Shawarma, Chicken Pieces & Fries."
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={offerForm.buttonText}
                          onChange={(e) => setOfferForm({ ...offerForm, buttonText: e.target.value })}
                          placeholder="Order Now"
                          className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Background Tint</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={offerForm.backgroundColor || '#EAF4EC'}
                            onChange={(e) => setOfferForm({ ...offerForm, backgroundColor: e.target.value })}
                            className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border border-white/20 p-0.5"
                          />
                          <input
                            type="text"
                            value={offerForm.backgroundColor || '#EAF4EC'}
                            onChange={(e) => setOfferForm({ ...offerForm, backgroundColor: e.target.value })}
                            className="flex-1 px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Offer Image & Upload */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Offer Image (Upload File or Enter URL)
                      </label>
                      <input
                        type="text"
                        value={offerForm.imageUrl}
                        onChange={(e) => setOfferForm({ ...offerForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... or data:image/..."
                        className="w-full px-3 py-2 bg-[#0d0f14] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 mb-2"
                        required
                      />

                      {/* File Upload Drop Area */}
                      <label className="border-2 border-dashed border-white/20 hover:border-orange-500/60 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10 transition group">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition mb-1" />
                        <span className="text-xs font-semibold text-gray-300 group-hover:text-white">
                          Click to Browse & Upload Image
                        </span>
                        <span className="text-[10px] text-gray-500">Supports PNG, JPG, WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'offer')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Live Preview of Offer Banner */}
                    <div>
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mb-1.5">
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        Live Storefront Preview:
                      </span>
                      <div
                        className="rounded-2xl p-4 overflow-hidden relative shadow-sm border border-emerald-900/10 flex items-center justify-between"
                        style={{ backgroundColor: offerForm.backgroundColor || '#EAF4EC' }}
                      >
                        <div className="space-y-1 z-10 max-w-[65%]">
                          <span className="inline-block text-[9px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {offerForm.badge}
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-gray-900 leading-tight uppercase">
                            {offerForm.title}
                          </h4>
                          <p className="text-[11px] text-gray-600 line-clamp-2">
                            {offerForm.subtitle}
                          </p>
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E31837] text-white text-[10px] font-bold">
                              {offerForm.buttonText}
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>

                        <div className="relative shrink-0">
                          {offerForm.discountTag && (
                            <span className="absolute -top-1 -right-1 z-10 bg-[#E31837] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                              {offerForm.discountTag}
                            </span>
                          )}
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <img src={offerForm.imageUrl} alt="Offer preview" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingOffer(false);
                      setEditingOffer(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition flex items-center gap-2 shadow-md shadow-orange-500/20"
                  >
                    <Check className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Offer Banner'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of existing offer banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offerBanners.map((banner, index) => (
              <div
                key={banner.id || index}
                className={`bg-[#161920] border rounded-2xl p-4 flex flex-col justify-between transition ${
                  banner.isActive ? 'border-white/15' : 'border-white/5 opacity-60'
                }`}
              >
                <div>
                  <div
                    className="h-28 rounded-xl p-3 flex items-center justify-between mb-3 relative overflow-hidden"
                    style={{ backgroundColor: banner.backgroundColor || '#EAF4EC' }}
                  >
                    <div className="max-w-[65%] z-10">
                      <span className="inline-block text-[8px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        {banner.badge}
                      </span>
                      <p className="text-xs font-black text-gray-900 leading-tight uppercase mt-1 line-clamp-2">
                        {banner.title}
                      </p>
                      <p className="text-[9px] text-gray-600 line-clamp-1 mt-0.5">{banner.subtitle}</p>
                    </div>

                    <div className="relative shrink-0">
                      {banner.discountTag && (
                        <span className="absolute -top-1 -right-1 bg-[#E31837] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                          {banner.discountTag}
                        </span>
                      )}
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-white shrink-0 shadow-xs">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold text-white">Offer #{index + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      banner.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {banner.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
                  <button
                    onClick={() => handleToggleOfferActive(banner)}
                    className="text-xs font-semibold text-gray-300 hover:text-white"
                  >
                    {banner.isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setOfferForm({ ...banner });
                        setEditingOffer(banner);
                        setIsCreatingOffer(false);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setBannerToDelete({ type: 'offer', id: banner.id, title: banner.title || 'Special Offer' })}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BANNER DELETION IN-APP MODAL */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161920] border border-white/15 rounded-3xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Delete Banner?</h3>
                <p className="text-xs text-gray-400">
                  {bannerToDelete.type === 'hero' ? 'Hero Promotional Banner' : 'Special Offer Card'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete this banner?
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  if (bannerToDelete.type === 'hero') {
                    confirmDeleteHero(bannerToDelete.id);
                  } else {
                    confirmDeleteOffer(bannerToDelete.id);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer"
              >
                {isSaving ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setBannerToDelete(null)}
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
