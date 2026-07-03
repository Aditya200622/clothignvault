import React, { useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Order, UserProfile } from './types';
import { PRODUCTS } from './data';
import AdminView from "./views/AdminView";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { ToastProvider, useToast } from './components/ToastProvider';
import { dbService } from './firebase/db';

// Views
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailsView from './views/ProductDetailsView';
import CategoriesView from './views/CategoriesView';
import WishlistView from './views/WishlistView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import LoginSignupView from './views/LoginSignupView';
import ProfileView from './views/ProfileView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import TermsView from './views/TermsView';
import PrivacyView from './views/PrivacyView';
import RefundView from './views/RefundView';
import ShippingView from './views/ShippingView';

// ─── Inner App (needs toast context) ─────────────────────────────────────────
function AppInner() {
  const toast = useToast();

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0]?.id || '');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cv_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('cv_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('cv_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cv_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [couponDiscountPct, setCouponDiscountPct] = useState<number>(0);
  const [reviewsRefreshToggle, setReviewsRefreshToggle] = useState(0);

  // ── Fetch products from Firestore ──────────────────────────────────────────
  useEffect(() => {
    async function initData() {
      try {
        const fetchedProducts = await dbService.getProducts();
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products from Firestore:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // ── Sync cart to Firestore ─────────────────────────────────────────────────
  useEffect(() => {
    if (currentUser?.uid && !isLoading) {
      dbService.updateUserCart(currentUser.uid, cart).catch(console.error);
    }
  }, [cart, currentUser, isLoading]);

  // ── Sync wishlist to Firestore ─────────────────────────────────────────────
  useEffect(() => {
    if (currentUser?.uid && !isLoading) {
      dbService.updateUserWishlist(currentUser.uid, wishlist).catch(console.error);
    }
  }, [wishlist, currentUser, isLoading]);

  // ── Cart handlers ─────────────────────────────────────────────────────────
  const handleAddToCart = useCallback((
    product: Product,
    quantity: number,
    size: string,
    color: { name: string; hex: string }
  ) => {
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );
      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = prevCart.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prevCart, { product, quantity, selectedSize: size, selectedColor: color }];
      }
      localStorage.setItem('cv_cart_v1', JSON.stringify(updated));
      return updated;
    });
    toast.success(`${product.name} added to your bag! 🛍️`);
  }, [toast]);

  const handleUpdateCartQty = useCallback((productId: string, size: string, change: number) => {
    setCart(prevCart => {
      const updated = prevCart
        .map(item => {
          if (item.product.id === productId && item.selectedSize === size) {
            return { ...item, quantity: item.quantity + change };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
      localStorage.setItem('cv_cart_v1', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string, size: string) => {
    setCart(prevCart => {
      const updated = prevCart.filter(
        item => !(item.product.id === productId && item.selectedSize === size)
      );
      localStorage.setItem('cv_cart_v1', JSON.stringify(updated));
      return updated;
    });
    toast.info('Item removed from bag');
  }, [toast]);

  // ── Wishlist handler ──────────────────────────────────────────────────────
  const handleWishlistToggle = useCallback((productId: string) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.some(p => p.id === productId);
      let updated: Product[];
      if (exists) {
        updated = prevWishlist.filter(p => p.id !== productId);
        toast.info('Removed from wishlist');
      } else {
        const prod = products.find(p => p.id === productId);
        updated = prod ? [...prevWishlist, prod] : prevWishlist;
        toast.success('Added to wishlist ❤️');
      }
      localStorage.setItem('cv_wishlist_v1', JSON.stringify(updated));
      return updated;
    });
  }, [products, toast]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = useCallback(async (user: UserProfile) => {
    // Immediately store the base profile so the UI is reactive
    setCurrentUser(user);
    localStorage.setItem('cv_user_v1', JSON.stringify(user));
    try {
      // 1. Ensure Firestore document exists and has the correct role
      const assignedRole = await dbService.ensureUserRole(user.uid, user.email);

      // 2. Re-fetch the full Firestore document to get all stored fields
      const dbUser = await dbService.getUser(user.uid);

      // 3. Build a merged profile: Firebase auth data + Firestore data + correct role
      const mergedProfile: UserProfile = {
        ...user,
        ...(dbUser ?? {}),
        uid: user.uid,
        email: user.email,
        role: assignedRole,
        isActive: true,
      };

      setCurrentUser(mergedProfile);
      localStorage.setItem('cv_user_v1', JSON.stringify(mergedProfile));

      // 4. Restore cart & wishlist from Firestore if present
      if (dbUser) {
        if (dbUser.cart && dbUser.cart.length > 0) {
          setCart(dbUser.cart);
          localStorage.setItem('cv_cart_v1', JSON.stringify(dbUser.cart));
        }
        if (dbUser.wishlist && dbUser.wishlist.length > 0) {
          setWishlist(dbUser.wishlist);
          localStorage.setItem('cv_wishlist_v1', JSON.stringify(dbUser.wishlist));
        }
      } else {
        // createUser is called inside ensureUserRole, but merge the full profile too
        await dbService.createUser(user.uid, { ...mergedProfile, cart: [], wishlist: [] });
      }

      // 5. Load order history
      const userOrders = await dbService.getUserOrders(user.email);
      setOrders(userOrders);
      localStorage.setItem('cv_orders_v1', JSON.stringify(userOrders));

      // 6. Auto-navigate admin to Admin Dashboard
      if (assignedRole === 'admin') {
        setCurrentTab('admin');
      }
    } catch (err) {
      console.error('Login DB Sync error:', err);
    }
    toast.success(`Welcome back, ${user.name}! 👋`);
  }, [toast]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('cv_user_v1');
    setCart([]);
    localStorage.removeItem('cv_cart_v1');
    setWishlist([]);
    localStorage.removeItem('cv_wishlist_v1');
    setOrders([]);
    localStorage.removeItem('cv_orders_v1');
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info('You have been signed out successfully');
  }, [toast]);

  const handleUpdateProfile = useCallback(async (updatedProfile: UserProfile) => {
    // Preserve role and isActive — never let a profile update downgrade an admin
    const safeProfile: UserProfile = {
      ...updatedProfile,
      role: currentUser?.role ?? updatedProfile.role,
      isActive: currentUser?.isActive ?? updatedProfile.isActive ?? true,
    };
    setCurrentUser(safeProfile);
    localStorage.setItem('cv_user_v1', JSON.stringify(safeProfile));
    try {
      await dbService.createUser(safeProfile.uid, safeProfile);
      toast.success('Profile updated successfully ✅');
    } catch (err) {
      console.error('Update profile DB error:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  }, [currentUser, toast]);

  // ── Order handler ─────────────────────────────────────────────────────────
  const handlePlaceOrder = useCallback(async (newOrder: Order) => {
    try {
      await dbService.createOrder(newOrder.id, {
        ...newOrder,
        createdAt: new Date()
      } as any);
      await dbService.deductInventory(cart);

      setOrders(prevOrders => {
        const updated = [newOrder, ...prevOrders];
        localStorage.setItem('cv_orders_v1', JSON.stringify(updated));
        return updated;
      });

      setCart([]);
      localStorage.removeItem('cv_cart_v1');
      if (currentUser?.uid) {
        await dbService.updateUserCart(currentUser.uid, []);
      }
      setCouponDiscountPct(0);
      toast.success('Order placed successfully! 🎉 Check your email for confirmation.');
    } catch (err) {
      console.error('Order placement failed:', err);
      toast.error('Order placement failed. Please check stock availability and try again.');
      throw err;
    }
  }, [cart, currentUser, toast]);

  const handleAddReview = useCallback((productId: string, name: string, rating: number, comment: string) => {
    const matchedProduct = products.find(p => p.id === productId);
    if (matchedProduct) {
      const newReview = {
        id: `rev-${Date.now()}`,
        user: name,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
      };
      matchedProduct.reviews = [newReview, ...matchedProduct.reviews];
      setReviewsRefreshToggle(prev => prev + 1);
      toast.success('Thank you for your review! ⭐');
    }
  }, [products, toast]);

  const navigate = useCallback((tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FAFAF9] text-gray-800 flex flex-col justify-between selection:bg-rose-500/20 selection:text-rose-900">
      <LoadingScreen />

      {/* Ambient Decorations */}
      <div className="absolute top-10 left-[10%] w-[40vw] h-[40vw] rounded-full bg-rose-200/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-[120vh] right-[10%] w-[35vw] h-[35vw] rounded-full bg-rose-100/20 blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigate}
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        onUpdateCartQty={handleUpdateCartQty}
        onRemoveFromCart={handleRemoveFromCart}
        setSelectedProductId={setSelectedProductId}
      />

      {/* Main Content */}
      <main className="flex-1 w-full pb-20 relative z-10">

        {currentTab === 'home' && (
          <HomeView
            products={products}
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onQuickAdd={(p, s, c) => handleAddToCart(p, 1, s, c)}
          />
        )}

        {currentTab === 'shop' && (
          <ShopView
            products={products}
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
            onQuickAdd={(p, s, c) => handleAddToCart(p, 1, s, c)}
          />
        )}

        {currentTab === 'product-details' && (
          <ProductDetailsView
            key={`detail-${selectedProductId}-${reviewsRefreshToggle}`}
            products={products}
            productId={selectedProductId}
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
            onQuickAdd={(p, s, c) => handleAddToCart(p, 1, s, c)}
            onAddReview={handleAddReview}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesView
            setCurrentTab={navigate}
            onCategorySelect={() => {}}
          />
        )}

        {currentTab === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
            couponDiscountPct={couponDiscountPct}
            setCouponDiscountPct={setCouponDiscountPct}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutView
            cart={cart}
            couponDiscountPct={couponDiscountPct}
            onPlaceOrder={handlePlaceOrder}
            setCurrentTab={navigate}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'login' && (
          <LoginSignupView
            onLogin={handleLogin}
            setCurrentTab={navigate}
          />
        )}

        {currentTab === 'profile' && (
          currentUser ? (
            <ProfileView
              currentUser={currentUser}
              orders={orders}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
              setCurrentTab={navigate}
            />
          ) : (
            <LoginSignupView
              onLogin={handleLogin}
              setCurrentTab={navigate}
            />
          )
        )}

        {currentTab === 'admin' && (
          (currentUser?.role === 'admin' || currentUser?.email === 'adityaworkspace22@gmail.com') ? (
            <AdminView currentUser={currentUser} />
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
              <div className="text-6xl">🔒</div>
              <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
              <p className="text-gray-500">You do not have admin privileges.</p>
              <button
                onClick={() => navigate('home')}
                className="px-6 py-2 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
              >
                Go Home
              </button>
            </div>
          )
        )}

        {currentTab === 'about'    && <AboutView />}
        {currentTab === 'contact'  && <ContactView />}
        {currentTab === 'terms'    && <TermsView />}
        {currentTab === 'privacy'  && <PrivacyView />}
        {currentTab === 'refund'   && <RefundView />}
        {currentTab === 'shipping' && <ShippingView />}

      </main>

      <Footer setCurrentTab={navigate} />
    </div>
  );
}

// ─── Root App wrapped in Toast Provider ───────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
