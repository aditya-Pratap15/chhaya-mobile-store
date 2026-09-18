import React from 'react';

export default function ChhayaLogo({ className = "w-full h-full" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 120 120" 
      className={className}
      fill="none"
      role="img"
      aria-label="Chhaya Mobiles Logo"
    >
      <defs>
        <linearGradient id="cmBgGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="cmPhoneGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="cmGoldGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Modern Rounded Emblem Base */}
      <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#cmBgGradComp)" />
      <rect x="7" y="7" width="106" height="106" rx="27" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

      {/* Smartphone Bezel Silhouette */}
      <rect x="33" y="20" width="54" height="80" rx="12" fill="#090d16" stroke="url(#cmPhoneGradComp)" strokeWidth="3.5" />
      
      {/* High-Tech OLED Screen */}
      <rect x="37.5" y="28" width="45" height="63" rx="6" fill="#0f172a" />
      
      {/* Ear Speaker Notch */}
      <rect x="52" y="23.5" width="16" height="2" rx="1" fill="rgba(255,255,255,0.85)" />

      {/* Stylized Monogram CM */}
      <path 
        d="M57 44 C49.5 44 44.5 49 44.5 59.5 C44.5 70 49.5 75 57 75 C60.5 75 63.5 73.5 65.5 71" 
        stroke="#38bdf8" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      <path 
        d="M60.5 75 L60.5 47 L68.5 61.5 L76.5 47 L76.5 75" 
        stroke="#ffffff" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />

      {/* Precision Lab Diagnostic Spark */}
      <path d="M85 32 L86.8 37.2 L92 39 L86.8 40.8 L85 46 L83.2 40.8 L78 39 L83.2 37.2 Z" fill="url(#cmGoldGradComp)" />
      
      {/* Smartphone Home Bar */}
      <rect x="51" y="94" width="18" height="2.5" rx="1.25" fill="#38bdf8" />
    </svg>
  );
}
