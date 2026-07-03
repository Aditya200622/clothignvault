import React, { useState, useEffect } from "react";
import { Save, Store, Mail, Phone, Truck, Percent, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { apiClient } from "../../apiClient";

export default function AdminSettingsView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "ClothingVault",
    supportEmail: "support@clothingvault.com",
    supportPhone: "+91 9876543210",
    shippingCharges: 150,
    freeShippingLimit: 2000,
    gstPercent: 18,
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    logoUrl: "",
    faviconUrl: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "settings", "general"));
      if (snap.exists()) {
        setSettings(snap.data() as any);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.updateSettings(settings);
      alert("Settings saved successfully");
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <h2 className="text-lg font-bold text-white">Store Settings</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* General Info */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Store size={16}/> General Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Store Name</label>
              <input type="text" value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input type="email" value={settings.supportEmail} onChange={e => setSettings({...settings, supportEmail: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Support Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input type="text" value={settings.supportPhone} onChange={e => setSettings({...settings, supportPhone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Finance & Shipping */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Truck size={16}/> Finance & Shipping</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Shipping Charges (₹)</label>
                <input type="number" value={settings.shippingCharges} onChange={e => setSettings({...settings, shippingCharges: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Free Shipping Limit (₹)</label>
                <input type="number" value={settings.freeShippingLimit} onChange={e => setSettings({...settings, freeShippingLimit: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">GST Percentage <Percent size={12}/></label>
              <input type="number" value={settings.gstPercent} onChange={e => setSettings({...settings, gstPercent: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><ImageIcon size={16}/> Branding & Media</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Logo URL</label>
              <input type="text" value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Favicon URL</label>
              <input type="text" value={settings.faviconUrl} onChange={e => setSettings({...settings, faviconUrl: e.target.value})} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><LinkIcon size={16}/> Social Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Instagram</label>
              <input type="text" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Twitter</label>
              <input type="text" value={settings.twitter} onChange={e => setSettings({...settings, twitter: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Facebook</label>
              <input type="text" value={settings.facebook} onChange={e => setSettings({...settings, facebook: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
