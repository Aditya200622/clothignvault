import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Search } from "lucide-react";
import { db } from "../firebase/firebase";
import { dbService } from "../firebase/db";
import { apiClient } from "../apiClient";
import { Product, Order, UserProfile } from "../types";

// UI Components
import AdminSidebar, { SidebarTab } from "./admin/AdminSidebar";
import DashboardView from "./admin/DashboardView";
import OrdersView from "./admin/OrdersView";
import ProductsView from "./admin/ProductsView";
import AnalyticsView from "./admin/AnalyticsView";
import CustomersView from "./admin/CustomersView";
import InventoryView from "./admin/InventoryView";
import AdminCategoriesView from "./admin/AdminCategoriesView";
import AdminCouponsView from "./admin/AdminCouponsView";
import AdminBannersView from "./admin/AdminBannersView";
import AdminSettingsView from "./admin/AdminSettingsView";

import ReviewsView from "./admin/ReviewsView";
import ReturnsView from "./admin/ReturnsView";
import ShippingView from "./admin/ShippingView";
import SupportView from "./admin/SupportView";
import NotificationsView from "./admin/NotificationsView";
import ReportsView from "./admin/ReportsView";
import AuditLogsView from "./admin/AuditLogsView";
import PaymentsView from "./admin/PaymentsView";

export default function AdminView({ currentUser }: { currentUser?: UserProfile | null }) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Product Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: "", sku: "", price: 0, originalPrice: 0, category: "dresses", tag: "",
    images: "", description: "", sizes: "XS,S,M,L", colors: "Onyx Black:#0B0B0C",
    material: "", care: "", stock: 10, details: "",
  });
  const [savingProduct, setSavingProduct] = useState(false);

  // Subscribe to Orders
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ords = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      ords.sort((a, b) => {
        const aT = a.date ? new Date(a.date).getTime() : 0;
        const bT = b.date ? new Date(b.date).getTime() : 0;
        return bT - aT;
      });
      setOrders(ords);
    });
    return () => unsub();
  }, []);

  // Subscribe to Products
  useEffect(() => {
    const fetchProds = async () => {
      setLoadingProducts(true);
      try {
        const prods = await dbService.getProducts();
        setProductsList(prods);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProds();
  }, []);

  const refreshProducts = async () => {
    const prods = await dbService.getProducts();
    setProductsList(prods);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiClient.getAnalytics();
        setAnalytics(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnalytics();
  }, [orders]); // Refetch analytics when orders change

  const customers = useMemo(() => {
    const map = new Map<string, any>();
    orders.forEach(o => {
      const email = o.shippingAddress?.email;
      if (email) {
        const existing = map.get(email);
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += o.total;
        } else {
          map.set(email, {
            email,
            fullName: o.shippingAddress.fullName,
            phone: o.shippingAddress.phone,
            address: o.shippingAddress.address,
            city: o.shippingAddress.city,
            postalCode: o.shippingAddress.postalCode,
            orderCount: 1,
            totalSpent: o.total
          });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Product Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: "", sku: "", price: 1999, originalPrice: 2499, category: "dresses", tag: "New Arrival",
      images: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
      description: "A luxury statement dress.",
      sizes: "XS,S,M,L", colors: "Onyx Black:#0B0B0C", material: "Premium fabric.", care: "Dry clean only.", stock: 15, details: "",
    });
    setIsAddingProduct(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name, sku: p.sku || "", price: p.price, originalPrice: p.originalPrice || 0, category: p.category,
      tag: p.tag || "", images: p.images.join(", "), description: p.description, sizes: p.sizes.join(","),
      colors: p.colors.map((c) => `${c.name}:${c.hex || ""}`).join(","), material: p.material || "", care: p.care || "",
      stock: p.stock, details: p.details?.join(",") || "",
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.deleteProduct(id);
      refreshProducts();
    } catch (error) {
      console.error(error);
      alert("Error deleting product.");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload: Partial<Product> = {
        name: prodForm.name, sku: prodForm.sku, price: prodForm.price, originalPrice: prodForm.originalPrice, category: prodForm.category,
        tag: prodForm.tag, description: prodForm.description, material: prodForm.material, care: prodForm.care, stock: prodForm.stock,
        images: prodForm.images.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: prodForm.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        details: prodForm.details.split(",").map((s) => s.trim()).filter(Boolean),
        colors: prodForm.colors.split(",").map((s) => {
          const [n, h] = s.split(":");
          return { name: n?.trim(), hex: h?.trim() || "#000" };
        }).filter((c) => c.name),
      };

      if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, payload);
      } else {
        await apiClient.addProduct(payload as Omit<Product, 'id'>);
      }
      setIsAddingProduct(false);
      setEditingProduct(null);
      refreshProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to save product.");
    } finally {
      setSavingProduct(false);
    }
  };

  // Render correct tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardView orders={orders} products={productsList} analytics={analytics} />;
      case "orders": return <OrdersView orders={orders} />;
      case "payments": return <PaymentsView />;
      case "products": return <ProductsView products={productsList} onAdd={handleOpenAddProduct} onEdit={handleOpenEditProduct} onDelete={handleDeleteProduct} />;
      case "analytics": return <AnalyticsView analytics={analytics} />;
      case "customers": return <CustomersView customers={analytics?.customers || customers} />;
      case "inventory": return <InventoryView products={productsList} />;
      case "categories": return <AdminCategoriesView />;
      case "coupons": return <AdminCouponsView />;
      case "banners": return <AdminBannersView />;
      case "settings": return <AdminSettingsView />;
      case "reviews": return <ReviewsView />;
      case "returns": return <ReturnsView />;
      case "shipping": return <ShippingView />;
      case "support": return <SupportView />;
      case "notifications": return <NotificationsView />;
      case "reports": return <ReportsView />;
      case "auditLogs": return <AuditLogsView />;
      default: return <DashboardView orders={orders} products={productsList} analytics={analytics} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 font-sans overflow-hidden">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
        onLogout={() => {}} // Add auth logic here if needed
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-[#0a0a0c]">
          <h1 className="font-display font-black text-lg text-white uppercase tracking-widest">
            Clothing<span className="text-rose-500 font-light">Vault</span>
          </h1>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Global Search & Top Bar */}
            <div className="hidden lg:flex items-center justify-between mb-8 bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Global search (Products, Orders, Customers...)" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{currentUser?.name || 'Admin'}</p>
                  <p className="text-xs text-zinc-500">{currentUser?.email || 'admin@clothingvault.com'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold border border-rose-500/20">
                  {currentUser?.name?.[0] || 'A'}
                </div>
              </div>
            </div>

            {!isAddingProduct ? renderContent() : (
              <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <h2 className="text-xl font-bold text-white">{editingProduct ? "Edit Product" : "Add Product"}</h2>
                  <button onClick={() => setIsAddingProduct(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Name</label><input required type="text" value={prodForm.name} onChange={e=>setProdForm({...prodForm, name:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">SKU</label><input type="text" value={prodForm.sku} onChange={e=>setProdForm({...prodForm, sku:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white font-mono" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Category</label><input required type="text" value={prodForm.category} onChange={e=>setProdForm({...prodForm, category:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Stock</label><input required type="number" value={prodForm.stock} onChange={e=>setProdForm({...prodForm, stock:Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Price (₹)</label><input required type="number" value={prodForm.price} onChange={e=>setProdForm({...prodForm, price:Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Original Price (₹)</label><input type="number" value={prodForm.originalPrice} onChange={e=>setProdForm({...prodForm, originalPrice:Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Images (comma separated URLs)</label><textarea required value={prodForm.images} onChange={e=>setProdForm({...prodForm, images:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white h-24" /></div>
                  <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Description</label><textarea required value={prodForm.description} onChange={e=>setProdForm({...prodForm, description:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white h-24" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Sizes (CSV)</label><input type="text" value={prodForm.sizes} onChange={e=>setProdForm({...prodForm, sizes:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Colors (Name:Hex,CSV)</label><input type="text" value={prodForm.colors} onChange={e=>setProdForm({...prodForm, colors:e.target.value})} placeholder="Onyx:#000, Ruby:#f00" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Material</label><input type="text" value={prodForm.material} onChange={e=>setProdForm({...prodForm, material:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                    <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Care</label><input type="text" value={prodForm.care} onChange={e=>setProdForm({...prodForm, care:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Details (CSV bullet points)</label><input type="text" value={prodForm.details} onChange={e=>setProdForm({...prodForm, details:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white" /></div>
                  <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                    <button type="button" onClick={() => setIsAddingProduct(false)} className="px-6 py-2 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors">Cancel</button>
                    <button type="submit" disabled={savingProduct} className="px-8 py-2 rounded-xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors disabled:opacity-50">{savingProduct ? "Saving..." : "Save Product"}</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}