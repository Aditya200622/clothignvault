import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tags, 
  Users, 
  Ticket, 
  Warehouse, 
  BarChart3, 
  Image as ImageIcon, 
  Settings,
  X,
  LogOut,
  Star,
  RefreshCcw,
  Truck,
  HeadphonesIcon,
  Bell,
  FileText,
  Activity,
  CreditCard
} from "lucide-react";

export type SidebarTab = 
  | "dashboard" | "orders" | "products" | "categories" 
  | "customers" | "coupons" | "inventory" | "analytics" 
  | "banners" | "settings" | "reviews" | "returns" 
  | "shipping" | "support" | "notifications" | "reports" | "auditLogs" | "payments";

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout?: () => void;
}

const NAV_ITEMS: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { id: "payments", label: "Payments", icon: <CreditCard size={18} /> },
  { id: "returns", label: "Returns", icon: <RefreshCcw size={18} /> },
  { id: "shipping", label: "Shipping", icon: <Truck size={18} /> },
  { id: "products", label: "Products", icon: <Package size={18} /> },
  { id: "inventory", label: "Inventory", icon: <Warehouse size={18} /> },
  { id: "categories", label: "Categories", icon: <Tags size={18} /> },
  { id: "customers", label: "Customers", icon: <Users size={18} /> },
  { id: "reviews", label: "Reviews", icon: <Star size={18} /> },
  { id: "support", label: "Support", icon: <HeadphonesIcon size={18} /> },
  { id: "coupons", label: "Coupons", icon: <Ticket size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { id: "reports", label: "Reports", icon: <FileText size={18} /> },
  { id: "banners", label: "Banners", icon: <ImageIcon size={18} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { id: "auditLogs", label: "Audit Logs", icon: <Activity size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const content = (
    <div className="flex flex-col h-full bg-[#0a0a0c] border-r border-zinc-800 text-zinc-300 w-64">
      {/* Brand */}
      <div className="p-6 flex items-center justify-between border-b border-zinc-800/50">
        <h1 className="font-display font-black text-xl text-white tracking-widest uppercase">
          Clothing<span className="text-rose-500 font-light">Vault</span>
        </h1>
        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent"
              }`}
            >
              <span className={isActive ? "text-rose-500" : "opacity-70"}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Footer Nav */}
      <div className="p-4 border-t border-zinc-800/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut size={18} className="opacity-70" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobile && (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer */}
          <div 
            className={`absolute top-0 left-0 bottom-0 w-64 bg-[#0a0a0c] shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}
