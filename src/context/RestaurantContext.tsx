import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category, Product, RestaurantSettings, Order, CartItem, SyncMenuResult } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { useAuth } from './AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

interface RestaurantContextType {
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  loadingData: boolean;
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product, quantity?: number, selectedOptions?: Record<string, string>, notes?: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  createCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => Promise<void>;
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
  syncOfficialMenu: () => Promise<SyncMenuResult>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart stored in local storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('burger_house_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('burger_house_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error persisting cart:', e);
    }
  }, [cart]);

  // Real-time Firestore sync & seed for menu and settings
  useEffect(() => {
    let unsubCategories = () => {};
    let unsubProducts = () => {};
    let unsubSettings = () => {};

    const initializeData = async () => {
      try {
        // 1. Settings listener
        const settingsRef = doc(db, 'settings', 'main');
        unsubSettings = onSnapshot(settingsRef, async (snap) => {
          if (snap.exists()) {
            setSettings(snap.data() as RestaurantSettings);
          } else {
            // Attempt to seed initial settings if not present
            try {
              await setDoc(settingsRef, INITIAL_SETTINGS);
              setSettings(INITIAL_SETTINGS);
            } catch (err) {
              console.warn('Initial settings seed skipped:', err);
              setSettings(INITIAL_SETTINGS);
            }
          }
        }, (err) => console.log('Settings snapshot notice:', err.message));

        // 2. Categories listener
        const catCol = collection(db, 'categories');
        unsubCategories = onSnapshot(catCol, async (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
            list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            setCategories(list);
          } else {
            // Attempt to seed initial categories if collection is empty
            try {
              for (const cat of INITIAL_CATEGORIES) {
                await setDoc(doc(db, 'categories', cat.id), cat);
              }
            } catch (err) {
              console.warn('Categories seed notice:', err);
            }
          }
        }, (err) => console.log('Categories snapshot notice:', err.message));

        // 3. Products listener
        const prodCol = collection(db, 'products');
        unsubProducts = onSnapshot(prodCol, async (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
            setProducts(list);
            setLoadingData(false);
          } else {
            // Attempt to seed initial products if collection is empty
            try {
              for (const prod of INITIAL_PRODUCTS) {
                await setDoc(doc(db, 'products', prod.id), prod);
              }
            } catch (err) {
              console.warn('Products seed notice:', err);
            }
            setLoadingData(false);
          }
        }, (err) => {
          console.log('Products snapshot notice:', err.message);
          setLoadingData(false);
        });

      } catch (err) {
        console.error('Firestore init error:', err);
        setLoadingData(false);
      }
    };

    initializeData();

    return () => {
      unsubCategories();
      unsubProducts();
      unsubSettings();
    };
  }, []);

  // Synchronize orders according to user authentication & role permissions
  useEffect(() => {
    let unsubOrders = () => {};

    if (isAdmin) {
      // Staff and Admin: Real-time sync for all orders
      const ordersCol = collection(db, 'orders');
      const q = query(ordersCol, orderBy('createdAt', 'desc'));
      unsubOrders = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        setOrders(list);
      }, (err) => {
        console.warn('Admin orders listener notice:', err.message);
      });
    } else if (user) {
      // Authenticated Customer: Real-time sync for user's own orders
      const ordersCol = collection(db, 'orders');
      const q = query(ordersCol, where('userId', '==', user.uid));
      unsubOrders = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
      }, (err) => {
        console.warn('Customer orders listener notice:', err.message);
      });
    } else {
      // Guest: Do not query all orders (prevents permission denied error)
      setOrders(prev => prev.filter(o => !o.userId));
    }

    return () => unsubOrders();
  }, [user?.uid, isAdmin]);

  // Cart operations
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedOptions?: Record<string, string>,
    notes?: string
  ) => {
    const optionsKey = selectedOptions ? JSON.stringify(selectedOptions) : 'none';
    const cartItemId = `${product.id}_${optionsKey}`;

    // Calculate options price add-on
    let priceModifier = 0;
    if (product.options && selectedOptions) {
      product.options.forEach(opt => {
        const pickedLabel = selectedOptions[opt.name];
        const choice = opt.choices.find(c => c.label === pickedLabel);
        if (choice) priceModifier += choice.price;
      });
    }

    const finalUnitPrice = product.price + priceModifier;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: finalUnitPrice,
          quantity,
          image: product.image,
          selectedOptions,
          specialNotes: notes
        }
      ];
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Management functions
  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    try {
      const settingsRef = doc(db, 'settings', 'main');
      const updated = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
      await setDoc(settingsRef, updated, { merge: true });
      setSettings(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/main');
    }
  };

  const createProduct = async (product: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    try {
      const newProd: Product = { ...product, id, createdAt: new Date().toISOString() };
      await setDoc(doc(db, 'products', id), newProd);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${id}`);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const prodRef = doc(db, 'products', id);
      await updateDoc(prodRef, { ...updates, updatedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const createCategory = async (cat: Omit<Category, 'id'>) => {
    const id = `cat-${cat.slug || Date.now()}`;
    try {
      await setDoc(doc(db, 'categories', id), { ...cat, id });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `categories/${id}`);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { paymentStatus, updatedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    try {
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'orders', orderId), newOrder);
      setOrders(prev => [newOrder, ...prev.filter(o => o.id !== orderId)]);
      clearCart();
      return orderId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    }
  };

  const syncOfficialMenu = async (): Promise<SyncMenuResult> => {
    // 1. Immediately update local state so the admin and storefront see all 35 dishes right away
    setSettings(INITIAL_SETTINGS);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);

    try {
      localStorage.setItem('burger_joints_menu_version', '2.0-exact-menu');
    } catch {
      // ignore
    }

    // 2. Persist to Cloud Firestore via atomic batch write
    try {
      const batch = writeBatch(db);

      // (a) Delete obsolete products in Firestore not in official menu
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        const officialProdIds = new Set(INITIAL_PRODUCTS.map(p => p.id));
        for (const docSnap of prodSnap.docs) {
          if (!officialProdIds.has(docSnap.id)) {
            batch.delete(docSnap.ref);
          }
        }
      } catch (err) {
        console.warn('Could not check obsolete products:', err);
      }

      // (b) Delete obsolete categories in Firestore not in official menu
      try {
        const catSnap = await getDocs(collection(db, 'categories'));
        const officialCatIds = new Set(INITIAL_CATEGORIES.map(c => c.id));
        for (const docSnap of catSnap.docs) {
          if (!officialCatIds.has(docSnap.id)) {
            batch.delete(docSnap.ref);
          }
        }
      } catch (err) {
        console.warn('Could not check obsolete categories:', err);
      }

      // (c) Put all official categories
      for (const cat of INITIAL_CATEGORIES) {
        batch.set(doc(db, 'categories', cat.id), cat);
      }

      // (d) Put all official products
      for (const prod of INITIAL_PRODUCTS) {
        batch.set(doc(db, 'products', prod.id), prod);
      }

      // (e) Put restaurant settings
      batch.set(doc(db, 'settings', 'main'), INITIAL_SETTINGS, { merge: true });

      // Commit all changes atomically
      await batch.commit();

      return {
        success: true,
        persistedToFirestore: true,
        message: `Successfully synchronized 35 menu dishes & 6 categories with Cloud Firestore!`,
        itemCount: INITIAL_PRODUCTS.length,
        categoryCount: INITIAL_CATEGORIES.length
      };
    } catch (error: any) {
      console.warn('Cloud Firestore sync notice:', error);
      // Local state is already updated with INITIAL_PRODUCTS and INITIAL_CATEGORIES
      return {
        success: true,
        persistedToFirestore: false,
        message: `Loaded 35 official dishes & 6 categories into your current session. (Note: Cloud persistence requires signing in as store admin 4529.muhammad@gmail.com).`,
        itemCount: INITIAL_PRODUCTS.length,
        categoryCount: INITIAL_CATEGORIES.length
      };
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        categories,
        products,
        orders,
        cart,
        cartCount,
        cartTotal,
        loadingData,
        selectedCategory,
        searchQuery,
        setSelectedCategory,
        setSearchQuery,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        updateSettings,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        updateOrderPaymentStatus,
        placeOrder,
        syncOfficialMenu
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used within a RestaurantProvider');
  return context;
};
