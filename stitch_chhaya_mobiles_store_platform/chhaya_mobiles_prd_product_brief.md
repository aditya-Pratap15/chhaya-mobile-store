# Project Requirements Document (PRD) & Product Brief

**Project Name:** Chhaya Mobiles and Repairs  
**Brand Identity:** Precision Tech Retail & Service  
**Proprietor & Master Technician:** Ritesh Chhaya  
**Store Location:** Galaxy Plaza, MG Road, Pune  
**Document Version:** 1.0 (Final Architecture Baseline)  
**Date:** Current  

---

## 1. Executive Summary & Vision

**Chhaya Mobiles and Repairs** is a hybrid digital storefront and workbench operations management system engineered for a premier walk-in electronics repair clinic and certified pre-owned gadget retailer. 

The primary business model is rooted in **100% In-Store Offline Settlement**—avoiding fraudulent online reservation schemes and unverified remote charges. Customers can explore physical showcase inventory, inspect diagnostic bench pricing, watch an interactive store walkthrough, verify the owner's credentials, and initiate direct inquiries via WhatsApp/phone. Simultaneously, store management operates a private workbench console and CMS suite to update physical inventory, bench diagnostic services, trust metrics, and hero announcements in real-time.

---

## 2. Core Business Principles & Non-Negotiable Constraints

1. **Zero Online Payments / 100% In-Store Settlement:**
   - No payment gateways, online credit card checkouts, or pre-paid reservations exist on customer-facing screens.
   - All transactions occur strictly at the Galaxy Plaza counter after physical device inspection.
2. **"Inquire" Only Product Interaction:**
   - Product detail actions reveal verified WhatsApp/Desk contact details with a one-click copy tool. No "Add to Cart" or "Reserve Pickup" actions.
3. **Master Authentication Security:**
   - One-time master admin initialization screen (`First-Time Admin Signup`) that permanently seals after first account setup.
   - Subsequent access restricted strictly to the credentialed `Admin Login Portal`.
4. **Visual & Brand Continuity:**
   - Standalone text-free icon mark (stylized cobalt/cyan smartphone outline embedded with micro-wrench and circuit traces).
   - High-contrast Plus Jakarta Sans typography, clean border strokes, and systematic light mode color palette (`#1a56db`).

---

## 3. User Personas & Target Audience

### Primary Persona: Walk-in Customer ("Aman")
- **Profile:** Smartphone user facing broken screens, depleted batteries, water damage, or looking to trade/buy certified pre-owned phones and soundboxes.
- **Goals:** Check diagnostic transparency, ensure turnaround is fast (e.g., 30-min express screen fit), check stock availability before visiting, find directions to the shop.
- **Behavior:** Prefers walk-in face-to-face verification, transparent pricing, and instant contact via phone/WhatsApp.

### Secondary Persona: Proprietor & Master Technician ("Ritesh Chhaya")
- **Profile:** 8+ years experienced micro-soldering tech, managing walk-ins, bench diagnostics, stock drawers, and customer communication.
- **Goals:** Update showcase banner announcements, manage drawer inventory counts, adjust service pricing, display live lab metrics (turnaround, repairs completed), and update owner credentials seamlessly.

---

## 4. Information Architecture & Sitemap

```
Chhaya Mobiles & Repairs
├── Public Storefront
│   ├── 1. Home & Storefront (Hero video/slideshow, trust pills, featured categories, store map snippet)
│   ├── 2. Products & Repair Services (In-stock gadget catalog with "Inquire", live lab metrics, rate matrix)
│   ├── 3. Repair Services & Diagnostic Clinic (Detailed micro-soldering, battery, screen procedures & guarantees)
│   ├── 4. Meet the Owner & Hardware Lab (Ritesh Chhaya profile, workbench credentials, authentic lab photos)
│   ├── 5. Store & Map Location Guide (Interactive Google Maps anchor, opening hours, WhatsApp desk link)
│   └── 6. Customer Reviews & Testimonials (Verified Google review link, rating prompt, real walk-in reviews)
│
└── Admin Operations & CMS Suite
    ├── 1. First-Time Master Admin Signup (One-time master initialization; permanently sealed post-setup)
    ├── 2. Admin Login Portal (Terminal access, 2FA recovery, Galaxy Plaza security protocol)
    ├── 3. Admin Profile & Account Settings Modal (Owner photo update, username, Gmail, password security)
    ├── 4. Admin Management Dashboard / CMS Terminal
    │   ├── Store Announcement & Banner Ticker CMS
    │   ├── Hero Media & Video Walkthrough / Slideshow Manager
    │   ├── Turnaround & Trust Badges CMS (30 Mins, ₹0 Free, 180 Days)
    │   ├── Today's Lab Metrics Management (Turnaround time, repairs completed)
    │   ├── Location, Coordinates & WhatsApp CMS
    │   └── Google Reviews & Rating URL Integration
    ├── 5. Stock & Gadgets Management (Drawer/shelf physical tracking, instant stepper, out-of-stock badge)
    └── 6. Repair Services Management (Add/update/delete service offerings, repair counter tallies)
```

---

## 5. Detailed Feature Specifications

### 5.1 Public Storefront Features

| Feature ID | Feature Name | Description | Acceptance Criteria |
|---|---|---|---|
| **ST-01** | Unified Clean Nav Bar | Fixed/sticky top navigation bar with icon-only branding, clear route links, WhatsApp desk CTA, and admin terminal lock icon. | Zero clipping or overflow; identical layout across all storefront pages. |
| **ST-02** | Hero Multimedia Stage | Dual-mode hero presentation featuring authentic interior/exterior photography carousel alongside video walkthrough capability with "Watch Video" replay. | Auto-slides admin-managed photos; video pause/play controls; responsive 16:9 ratio. |
| **ST-03** | Trust & Turnaround Badges | 3-stat trust strip highlighting: 30 Mins Turnaround, ₹0 Free Diagnostics, 180 Days Official Warranty. | Dynamically populated from admin dashboard settings. |
| **ST-04** | Inquire-Only Product Flow | Interactive product catalog displaying pre-owned phones, batteries, earphones, soundboxes, and drones. | Click on "Inquire" exposes official WhatsApp / phone desk number with 1-click clipboard copy. No checkout/cart. |
| **ST-05** | Live Bench Metrics Bar | Header ticker/strip showing Today's Avg Turnaround (e.g. 28m) and Verified Devices Inspected (1,480+). | Real-time visual indicator with pulsing live status pill. |
| **ST-06** | Google Reviews Hub | Direct link to store's Google Business Review URL with prompt badge encouraging verified customer feedback. | Admin can toggle visibility and update target URL. |

---

### 5.2 Admin Console & CMS Features

| Feature ID | Feature Name | Description | Acceptance Criteria |
|---|---|---|---|
| **AD-01** | One-Time Master Initialization | Initial setup page capturing Owner Name, Gmail, Username, and Master Password. | Sealed permanently post-completion; forces redirection to standard Login Portal. |
| **AD-02** | Profile Settings Modal | Slide-over / modal dialog accessed via avatar click in dashboard header to update photo, email, username, and password. | Real-time validation indicator; changes propagate to storefront owner bio. |
| **AD-03** | Announcement Ticker CMS | Quick edit field for active banner message (e.g., Festival offers) with theme tone toggles and live preview. | Persists across top header of all public pages. |
| **AD-04** | Stock & Gadgets CMS | In-store physical inventory management tool tracking shelf & drawer locations (e.g., Showcase #1, Drawer B). | Real-time quantity steppers; auto-labels item "Out of Stock" when inventory hits 0. |
| **AD-05** | Repair Services CMS | Catalog editor for bench services (IC repair, battery swap, OLED lamination), standard rates, and total completed jobs. | Allows full CRUD (Create, Read, Update, Delete) of service offerings. |
| **AD-06** | Location & Review Config | Dedicated input cards for GPS coordinates, address text, WhatsApp number, and Google Review URL. | "Test Review Link" button to verify URL in new tab. |

---

## 6. Technical Stack & UI Design System

- **Design System Name:** Precision Tech Retail & Service (`{{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}}`)
- **Color Tokens:**
  - Primary Brand: `#1a56db` (Cobalt Tech Blue)
  - Secondary / Trust: `#0e9f6e` (Verified Green) / `#d97706` (Bench Gold)
  - Neutral Background: `#faf8ff` (Clean Studio Tint)
  - Surface Containers: `#ffffff` (Card Base), `#f2f3ff` (Input Containers)
  - Border Strokes: 1px subtle tech grey (`rgba(0,0,0,0.08)`)
- **Typography:** Plus Jakarta Sans (`font-sans`), with strict hierarchical weighting (Medium 500 body, Bold 700 headers, Monospace tracking for SKUs/terminals).
- **Iconography:** Minimalist modern SVG vectors with consistent stroke widths (2px).
- **Responsive Device Target:** Desktop-first high density workspace (1440px / 1280px viewport layouts).

---

## 7. Release Roadmap & Milestones

- **Phase 1 (Completed):** Public Storefront Architecture (Home, Products, Clinic, Owner Bio, Map, Reviews).
- **Phase 2 (Completed):** Admin Operations Suite (Login Portal, Single-use Signup, Command Center Dashboard, Inventory Drawer CMS, Bench Rate Matrix).
- **Phase 3 (Next Steps):**
  1. Print-ready In-Store QR Code Counter Placard generation (links to Google Review & WhatsApp Desk).
  2. Printable thermal receipt / counter settlement slip template for bench intake.
  3. WhatsApp Business Click-to-Chat pre-filled template routing (`"Hi Ritesh, I am inquiring about [Product/Service Name]"`).
