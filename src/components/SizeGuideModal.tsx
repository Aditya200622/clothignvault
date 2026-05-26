import React, { useState } from 'react';
import { X, Check, Ruler, Sparkles, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  onClose: () => void;
  productCategory?: string;
  productName?: string;
}

type ModeType = 'cm' | 'inch';
type CategoryType = 'dresses' | 'streetwear' | 'knits';

export default function SizeGuideModal({ onClose, productCategory, productName }: SizeGuideModalProps) {
  // Determine standard categories based on active item
  const getInitialCategory = (): CategoryType => {
    if (!productCategory) return 'dresses';
    const cat = productCategory.toLowerCase();
    const name = productName?.toLowerCase() || '';
    if (cat.includes('dress') || name.includes('dress') || name.includes('gown') || name.includes('skirt')) {
      return 'dresses';
    }
    if (cat.includes('street') || cat.includes('denim') || name.includes('t-shirt') || name.includes('hoodie') || name.includes('pants')) {
      return 'streetwear';
    }
    return 'knits'; // Cashmere knits, tailored wear, coats etc.
  };

  const [activeCategory, setActiveCategory] = useState<CategoryType>(getInitialCategory());
  const [unitMode, setUnitMode] = useState<ModeType>('in'); // Default to US inches / Cm toggles
  
  // Fit recommendation wizard inputs
  const [userBustChest, setUserBustChest] = useState<string>('');
  const [userWaist, setUserWaist] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');
  const [calcExpl, setCalcExpl] = useState<string>('');

  // 1 inch = 2.54 cm
  const toDisplay = (cmValue: number) => {
    if (unitMode === 'inch') {
      return `${(cmValue / 2.54).toFixed(1)}"`;
    }
    return `${cmValue} cm`;
  };

  // Static chart specifications formatted in Metric CM values
  const measurementData = {
    dresses: [
      { size: 'XS', bust: 80, waist: 62, hips: 86, length: 88, usSize: '0-2' },
      { size: 'S', bust: 84, waist: 66, hips: 90, length: 90, usSize: '4' },
      { size: 'M', bust: 88, waist: 70, hips: 94, length: 92, usSize: '6-8' },
      { size: 'L', bust: 94, waist: 76, hips: 100, length: 94, usSize: '10' },
      { size: 'XL', bust: 100, waist: 82, hips: 106, length: 96, usSize: '12-14' }
    ],
    streetwear: [
      { size: 'XS', chest: 90, waist: 74, shoulder: 41, length: 64, usSize: 'Oversized 0' },
      { size: 'S', chest: 96, waist: 80, shoulder: 43, length: 66, usSize: 'Oversized 2-4' },
      { size: 'M', chest: 102, waist: 86, shoulder: 45, length: 68, usSize: 'Oversized 6-8' },
      { size: 'L', chest: 108, waist: 92, shoulder: 47, length: 70, usSize: 'Oversized 10' },
      { size: 'XL', chest: 114, waist: 98, shoulder: 49, length: 72, usSize: 'Oversized 12-14' }
    ],
    knits: [
      { size: 'XS', chest: 86, waist: 68, sleeve: 58, length: 58, usSize: 'Slim XS' },
      { size: 'S', chest: 92, waist: 74, sleeve: 59, length: 60, usSize: 'Slim S' },
      { size: 'M', chest: 98, waist: 80, sleeve: 60, length: 62, usSize: 'Standard M' },
      { size: 'L', chest: 104, waist: 86, sleeve: 61, length: 64, usSize: 'Standard L' },
      { size: 'XL', chest: 110, waist: 92, sleeve: 62, length: 66, usSize: 'Standard XL' }
    ]
  };

  // Interactive Size Fitting estimator function
  const handleEstimateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const bustVal = parseFloat(userBustChest);
    const waistVal = parseFloat(userWaist);

    if (isNaN(bustVal) || isNaN(waistVal)) {
      setCalcResult('Unknown');
      setCalcExpl('Please submit positive valid numeric integers.');
      return;
    }

    // Standardize input values to centimeters for lookups
    let inputBust = bustVal;
    let inputWaist = waistVal;
    if (unitMode === 'inch') {
      inputBust = bustVal * 2.54;
      inputWaist = waistVal * 2.54;
    }

    let recommended = 'M';
    let label = 'Fits comfortably standard';

    if (activeCategory === 'dresses') {
      if (inputBust <= 81 && inputWaist <= 63) {
        recommended = 'XS';
        label = 'Close luxury bodycon fitting';
      } else if (inputBust <= 85 && inputWaist <= 67) {
        recommended = 'S';
        label = 'Elegant couture slender draping';
      } else if (inputBust <= 90 && inputWaist <= 72) {
        recommended = 'M';
        label = 'Classic standard flowing fit';
      } else if (inputBust <= 96 && inputWaist <= 78) {
        recommended = 'L';
        label = 'Spacious flow drape contouring';
      } else {
        recommended = 'XL';
        label = 'Full curves flow comfort design';
      }
    } else if (activeCategory === 'streetwear') {
      if (inputBust <= 92 && inputWaist <= 76) {
        recommended = 'XS';
        label = 'Stylish boxy oversized fit';
      } else if (inputBust <= 98 && inputWaist <= 82) {
        recommended = 'S';
        label = 'Aesthetic street slouch';
      } else if (inputBust <= 104 && inputWaist <= 88) {
        recommended = 'M';
        label = 'Premium relaxed drop-shoulder drape';
      } else if (inputBust <= 110 && inputWaist <= 94) {
        recommended = 'L';
        label = 'Cozy heavyweight layering';
      } else {
        recommended = 'XL';
        label = 'Mega extra loose relaxed street fit';
      }
    } else { // knits
      if (inputBust <= 88 && inputWaist <= 70) {
        recommended = 'XS';
        label = 'Fine-gauge close cashmere texture';
      } else if (inputBust <= 94 && inputWaist <= 76) {
        recommended = 'S';
        label = 'Classic soft sweater contours';
      } else if (inputBust <= 100 && inputWaist <= 82) {
        recommended = 'M';
        label = 'Relaxed breathable thermal envelope';
      } else if (inputBust <= 106 && inputWaist <= 88) {
        recommended = 'L';
        label = 'Warm overcoat companion layering';
      } else {
        recommended = 'XL';
        label = 'Grand oversized luxury cuddle knits';
      }
    }

    setCalcResult(recommended);
    setCalcExpl(label);
  };

  const currentDataset = measurementData[activeCategory];

  return (
    <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Soft background light splash */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-rose-300/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-rose-400/5 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-rose-50 flex items-center justify-between relative z-10 bg-white">
          <div className="flex items-center space-x-2.5 text-left">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-rose-500 block">Couture Vault Index</span>
              <h3 className="text-base sm:text-lg font-display font-black text-gray-950 uppercase mt-0.5">Sizing Covenant Guide</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 relative z-10 flex-1 text-left">
          
          {/* Active category selector + unit mode toggler */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rose-50">
            {/* Categories tab pills */}
            <div className="flex p-1 bg-rose-100/40 rounded-xl border border-rose-100/60 max-w-xs sm:max-w-none">
              {(['dresses', 'streetwear', 'knits'] as CategoryType[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    // Reset estimator recommendations on tab switch
                    setCalcResult('');
                    setCalcExpl('');
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-rose-600'
                  }`}
                >
                  {cat === 'dresses' ? '👗 Dresses' : cat === 'streetwear' ? '👕 Streetwear' : '🧥 Knits'}
                </button>
              ))}
            </div>

            {/* Units standard toggle switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-gray-400 uppercase font-black">Metrics Unit:</span>
              <div className="flex p-0.5 bg-rose-50 rounded-lg border border-rose-100/50">
                <button
                  onClick={() => setUnitMode('inch')}
                  className={`px-3 py-1 text-[10px] font-semibold uppercase rounded-md transition-all cursor-pointer ${
                    unitMode === 'inch' ? 'bg-white text-rose-600 font-extrabold shadow-xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnitMode('cm')}
                  className={`px-3 py-1 text-[10px] font-semibold uppercase rounded-md transition-all cursor-pointer ${
                    unitMode === 'cm' ? 'bg-white text-rose-600 font-extrabold shadow-xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Metrics (Cm)
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC MEASUREMENT TABLE GRID */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="font-sans font-medium">Standard body measurements matching active category</span>
              <span className="font-mono text-[10px] uppercase font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">{activeCategory} scale</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-rose-50/60 border-b border-rose-100 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                    <th className="p-3.5 sm:p-4">Vault Size</th>
                    <th className="p-3.5 sm:p-4">US Convert</th>
                    {activeCategory === 'dresses' && (
                      <>
                        <th className="p-3.5 sm:p-4">Bust / Chest</th>
                        <th className="p-3.5 sm:p-4">Waist</th>
                        <th className="p-3.5 sm:p-4">Hips Spectrum</th>
                        <th className="p-3.5 sm:p-4">Garment Len</th>
                      </>
                    )}
                    {activeCategory === 'streetwear' && (
                      <>
                        <th className="p-3.5 sm:p-4">Chest Width</th>
                        <th className="p-3.5 sm:p-4">Waist Fit</th>
                        <th className="p-3.5 sm:p-4">Shoulder Span</th>
                        <th className="p-3.5 sm:p-4">Back Length</th>
                      </>
                    )}
                    {activeCategory === 'knits' && (
                      <>
                        <th className="p-3.5 sm:p-4">Chest span</th>
                        <th className="p-3.5 sm:p-4">Waist span</th>
                        <th className="p-3.5 sm:p-4">Sleeve span</th>
                        <th className="p-3.5 sm:p-4">Body Length</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50/50 text-xs text-gray-700 font-medium">
                  {currentDataset.map((row) => (
                    <tr
                      key={row.size}
                      className="hover:bg-rose-50/30 transition-colors"
                    >
                      <td className="p-3.5 sm:p-4 font-mono font-black text-rose-600 bg-rose-50/10">
                        {row.size}
                      </td>
                      <td className="p-3.5 sm:p-4 font-mono text-gray-400">
                        {row.usSize}
                      </td>
                      {activeCategory === 'dresses' && (
                        <>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).bust)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).waist)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).hips)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).length)}
                          </td>
                        </>
                      )}
                      {activeCategory === 'streetwear' && (
                        <>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).chest)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).waist)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).shoulder)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).length)}
                          </td>
                        </>
                      )}
                      {activeCategory === 'knits' && (
                        <>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).chest)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).waist)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).sleeve)}
                          </td>
                          <td className="p-3.5 sm:p-4">
                            {toDisplay((row as any).length)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COUTURE INTERACTIVE CALCULATOR ENGINE */}
          <div className="bg-rose-50/60 rounded-[2rem] border border-rose-100 p-5 mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" />
              <h4 className="font-display font-extrabold text-xs uppercase text-gray-900 tracking-wider">
                Personalized Fit Estimator
              </h4>
            </div>
            
            <p className="text-[11px] text-gray-500 leading-normal font-semibold">
              Fill in your custom measurements below, and our biometric scale drapes will recommend the optimal companion size code immediately.
            </p>

            <form onSubmit={handleEstimateSize} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-black tracking-wider text-gray-500 block">
                  My Bust / Chest ({unitMode === 'inch' ? 'inches' : 'cm'})
                </label>
                <input
                  type="text"
                  required
                  placeholder={unitMode === 'inch' ? 'e.g. 34' : 'e.g. 86'}
                  value={userBustChest}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
                    setUserBustChest(cleanValue);
                  }}
                  className="w-full bg-white border border-rose-200 focus:border-rose-400 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-black tracking-wider text-gray-500 block">
                  My Waist ({unitMode === 'inch' ? 'inches' : 'cm'})
                </label>
                <input
                  type="text"
                  required
                  placeholder={unitMode === 'inch' ? 'e.g. 26' : 'e.g. 66'}
                  value={userWaist}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
                    setUserWaist(cleanValue);
                  }}
                  className="w-full bg-white border border-rose-200 focus:border-rose-400 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs uppercase font-extrabold tracking-widest transition-colors cursor-pointer"
                >
                  Estimate Fit
                </button>
              </div>
            </form>

            {/* Estimates Results drawer section */}
            {calcResult && (
              <div className="mt-4 pt-4 border-t border-rose-100 flex items-center gap-4 bg-white/70 p-3.5 rounded-2xl border border-rose-50 animate-fadeIn">
                <div className="h-12 w-12 rounded-xl bg-rose-500 text-white flex flex-col items-center justify-center font-mono font-black border border-rose-300">
                  <span className="text-[10px] uppercase text-rose-100 leading-none">Size</span>
                  <span className="text-lg leading-none">{calcResult}</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-bold leading-none">Recommendation Code</p>
                  <p className="text-xs font-extrabold text-rose-600 uppercase mt-1">{calcExpl}</p>
                  <p className="text-[9px] text-gray-400 leading-none mt-0.5">Based on default {activeCategory} couture specifications.</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Fit Advisory notes */}
          <div className="flex gap-2.5 p-3 rounded-2xl bg-[#FFF5EB] border border-amber-100 text-amber-800 text-[11px] leading-relaxed">
            <HelpCircle className="h-4.5 w-4.5 shrink-0 text-amber-500" />
            <div className="font-semibold">
              <span className="font-bold">Style Note:</span> Our streetwear garments run loose with dropped shoulders as intended by designers. Sizing down yields a classic tailored appearance, whereas choosing your standard size maintains the relaxed London lookbook vibes.
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-rose-50 bg-rose-50/40 text-center text-[10px] font-mono font-bold text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Sizing values are compiled from authentic tailored mannequin fits.</span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-sans font-extrabold uppercase tracking-widest transition-colors"
          >
            Acknowledge Fit
          </button>
        </div>

      </div>
    </div>
  );
}
