import React, { useState } from 'react';
import { CartItem, Product, Order, UserProfile } from './types';
import { PRODUCTS } from './data';
import AdminView from "./views/AdminView";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

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

export default function App() {
  // 1. STATE INITIALIZERS (Safely initializes from localStorage to prevent renders loops)
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return PRODUCTS[0]?.id || '';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cv_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('cv_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('cv_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cv_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponDiscountPct, setCouponDiscountPct] = useState<number>(0);
  
  // Sizing refresher key to reload reviews inline
  const [reviewsRefreshToggle, setReviewsRefreshToggle] = useState(0);

  // 2. CONCIERGE TRANSACTION ACTION HANDLERS
  const handleAddToCart = (
    product: Product,
    quantity: number,
    size: string,
    color: { name: string; hex: string }
  ) => {
    setCart((prevCart) => {
      // Check if exact same product size and color fits
      const existingIdx = prevCart.findIndex(
        (item) =>
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

    // Notify user with elegant alert or feedback
  };

  const handleUpdateCartQty = (productId: string, size: string, change: number) => {
    setCart((prevCart) => {
      const updated = prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const nextQty = item.quantity + change;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      localStorage.setItem('cv_cart_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    setCart((prevCart) => {
      const updated = prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      );
      localStorage.setItem('cv_cart_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const handleWishlistToggle = (productId: string) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((p) => p.id === productId);
      let updated: Product[];

      if (exists) {
        updated = prevWishlist.filter((p) => p.id !== productId);
      } else {
        const prod = PRODUCTS.find((p) => p.id === productId);
        updated = prod ? [...prevWishlist, prod] : prevWishlist;
      }

      localStorage.setItem('cv_wishlist_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('cv_user_v1', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cv_user_v1');
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    localStorage.setItem('cv_user_v1', JSON.stringify(updatedProfile));
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prevOrders) => {
      const updated = [newOrder, ...prevOrders];
      localStorage.setItem('cv_orders_v1', JSON.stringify(updated));
      return updated;
    });

    // Clear cart and voucher
    setCart([]);
    localStorage.removeItem('cv_cart_v1');
    setCouponDiscountPct(0);
  };

  const handleAddReview = (productId: string, name: string, rating: number, comment: string) => {
    const matchedProduct = PRODUCTS.find((p) => p.id === productId);
    
    if (matchedProduct) {
      const newReview = {
        id: `rev-${Date.now()}`,
        user: name,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
      };
      matchedProduct.reviews = [newReview, ...matchedProduct.reviews];
      // Force visual state refresh
      setReviewsRefreshToggle((prev) => prev + 1);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    // We can filter our shop page category states on shop tab mount
    // Direct category filter can be passed since active states are loaded cleanly
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAF9] text-gray-800 flex flex-col justify-between selection:bg-rose-500/20 selection:text-rose-900">
      
      {/* Luxury Preloader Screen */}
      <LoadingScreen />

      {/* Absolute Ambient Sphere Decorative Lights */}
      <div className="absolute top-10 left-[10%] w-[40vw] h-[40vw] rounded-full bg-rose-200/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-[120vh] right-[10%] w-[35vw] h-[35vw] rounded-full bg-rose-100/20 blur-[100px] pointer-events-none" />

      {/* STICKY GLASS NAVIGATION HEADER */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        onUpdateCartQty={handleUpdateCartQty}
        onRemoveFromCart={handleRemoveFromCart}
        setSelectedProductId={setSelectedProductId}
      />

      {/* CORE VIEWPORT CANVAS ROUTER */}
      <main className="flex-1 w-full pb-20 relative z-10">
        
        {currentTab === 'home' && (
          <HomeView
            setCurrentTab={setCurrentTab}
            setSelectedProductId={setSelectedProductId}
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onQuickAdd={(p, s, c) => handleAddToCart(p, 1, s, c)}
          />
        )}

        {currentTab === 'shop' && (
          <ShopView
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            setCurrentTab={setCurrentTab}
            setSelectedProductId={setSelectedProductId}
            onQuickAdd={(p, s, c) => handleAddToCart(p, 1, s, c)}
          />
        )}

        {currentTab === 'product-details' && (
          <ProductDetailsView
            key={`detail-${selectedProductId}-${reviewsRefreshToggle}`}
            productId={selectedProductId}
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            setCurrentTab={setCurrentTab}
            setSelectedProductId={setSelectedProductId}
            onQuickAdd={(p, s, c) => handleAddToCart(p, 1, s, c)}
            onAddReview={handleAddReview}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesView
            setCurrentTab={setCurrentTab}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {currentTab === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            setCurrentTab={setCurrentTab}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            setCurrentTab={setCurrentTab}
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
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'login' && (
          <LoginSignupView
            onLogin={handleLogin}
            setCurrentTab={setCurrentTab}
          />
        )}

{currentTab === 'profile' && (
  currentUser ? (
    <ProfileView
      currentUser={currentUser}
      orders={orders}
      onLogout={handleLogout}
      onUpdateProfile={handleUpdateProfile}
      setCurrentTab={setCurrentTab}
    />
  ) : (
    <LoginSignupView
      onLogin={handleLogin}
      setCurrentTab={setCurrentTab}
    />
  )
)}

{currentTab === 'admin' && (
  <AdminView />
)}

{currentTab === 'about' && <AboutView />}

        {currentTab === 'contact' && <ContactView />}

      </main>

      {/* SOPHISTICATED EDITORIAL FOOTER */}
      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}
