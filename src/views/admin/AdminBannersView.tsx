import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Save } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { apiClient } from "../../apiClient";

export default function AdminBannersView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banners, setBanners] = useState({
    hero: { title: "THE WINTER COLLECTION", subtitle: "NEW ARRIVALS", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200", buttonText: "EXPLORE" },
    featured: { title: "Featured Edit", subtitle: "Curated Luxury", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800", buttonText: "SHOP NOW" },
    sale: { title: "PRIVATE SALE", subtitle: "UP TO 40% OFF", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200", buttonText: "SHOP SALE" }
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "settings", "banners"));
      if (snap.exists()) {
        setBanners(snap.data() as any);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.updateBanners(banners);
      alert("Banners saved successfully");
    } catch (e) {
      console.error(e);
      alert("Error saving banners");
    }
    setSaving(false);
  };

  const BannerEditor = ({ title, section, data }: { title: string, section: keyof typeof banners, data: any }) => (
    <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center text-center">
          {data.image ? (
            <>
              <img src={data.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </>
          ) : (
            <ImageIcon size={32} className="text-zinc-700" />
          )}
          <div className="relative z-10 p-6 space-y-2">
            <p className="text-[10px] font-bold text-rose-400 tracking-[0.2em] uppercase">{data.subtitle || "SUBTITLE"}</p>
            <h4 className="text-2xl font-black text-white uppercase tracking-widest">{data.title || "TITLE"}</h4>
            {data.buttonText && (
              <button className="mt-4 px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest">{data.buttonText}</button>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Image URL</label>
            <input 
              type="text" 
              value={data.image} 
              onChange={e => setBanners({...banners, [section]: {...data, image: e.target.value}})} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Headline</label>
            <input 
              type="text" 
              value={data.title} 
              onChange={e => setBanners({...banners, [section]: {...data, title: e.target.value}})} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Subtitle</label>
            <input 
              type="text" 
              value={data.subtitle} 
              onChange={e => setBanners({...banners, [section]: {...data, subtitle: e.target.value}})} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Button Text</label>
            <input 
              type="text" 
              value={data.buttonText} 
              onChange={e => setBanners({...banners, [section]: {...data, buttonText: e.target.value}})} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" 
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <h2 className="text-lg font-bold text-white">Banner Manager</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <BannerEditor title="Hero Banner (Home Page)" section="hero" data={banners.hero} />
      <BannerEditor title="Featured Collection" section="featured" data={banners.featured} />
      <BannerEditor title="Promotional Sale Banner" section="sale" data={banners.sale} />
    </div>
  );
}
