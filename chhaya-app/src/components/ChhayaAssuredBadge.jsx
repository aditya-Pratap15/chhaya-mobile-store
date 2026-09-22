import React from 'react';

/**
 * Flipkart-style "Chhaya Assured" Trust Badge
 * Inspired by Flipkart's iconic "F-Assured" badge to instill massive buyer confidence.
 */
export default function ChhayaAssuredBadge({ size = 'sm', className = '' }) {
  const isSmall = size === 'sm';

  return (
    <span 
      className={`inline-flex items-center gap-1 font-black tracking-tight select-none ${className} ${
        isSmall 
          ? 'text-[10px] px-1.5 py-0.5 rounded bg-blue-50/90 text-blue-800 border border-blue-200/80 shadow-2xs' 
          : 'text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-300 shadow-xs'
      }`}
      title="Chhaya Assured: 45-Point Hardware Tested & 100% Genuine Display/Battery"
    >
      <span className="font-extrabold italic text-blue-700">Chhaya</span>
      <span className="inline-flex items-center text-amber-500 font-black italic">
        <span>Assured</span>
        <span className="ml-0.5 text-blue-700 text-[11px] font-black">✓</span>
      </span>
    </span>
  );
}
