---
phase: requirements
title: Church Anniversary Event Registration UI (mobile-first, multi-step)
description: Design and implement a mobile-first, step-by-step event registration flow with progress tracking, optional accommodation/travel info, and localized input support.
---

## 🥅 Goal
Design a clean, guided registration flow optimized for **mobile devices**, allowing users to:
- Save progress (localStorage + magic link recovery)
- See step progress and confirm before submission
- Review and edit before final submission

This flow supports **Vietnamese locale** and can be integrated into an existing **ReactJS frontend**.

---

## 🎨 Style & Design Tokens

| Token | Value / Guideline |
|-------|-------------------|
| **Font** | Inter / SF, 14–16px body, 18–22px headings |
| **Colors** | Primary `#2E5AAC`, Secondary `#6AA6FF`, Success `#0F9D58`, Warning `#E67E22`, Error `#D93025` |
| **Corners** | Rounded 12–16px |
| **Shadows** | Soft elevation |
| **Spacing** | 16px (mobile), 24px (tablet) |
| **Icons** | Lucide / Heroicons (outline style) |

**Layout**
- Header: logo + step title  
- Progress indicator: 6 dots or percentage bar  
- Sticky footer: “Back” (ghost), “Continue” (primary), “Submit Registration” on final step  
- Menu (⋯): “Save & Continue Later” → store draft in localStorage + send magic link email  

---

## 🧭 Navigation Flow (6 Steps + Review)

### **Step 1. Personal Information**
**Fields**
- Full name *(required)*
- Gender *(segmented: Male / Female)*
- Phone number *(mask (+84) 9xx xxx xxx)*
- Email *(validation required)*
- Church *(searchable dropdown, default: Cần Thơ)*
- Marital status *(dropdown)*
- CTA: Continue

---

### **Step 2. Family Participation**
**Fields**
- Checkbox: “Attending with spouse”
  - If checked → show spouse name + optional phone
- Number of children attending *(stepper)*
  - If >0 → repeat input block (child name + age)
- CTA: Continue

---

### **Step 3. Travel Schedule**
**Fields**
- Arrival date/time *(date picker)*
- Transport *(Plane / Train / Bus / Self)*
  - If Plane → Flight code
- Return date *(date picker)*
- Tip: “Provide accurate info for pickup arrangements.”
- CTA: Continue

---

### **Step 4. Participation Package & Souvenir Shirt**
**UI Components**
- Package cards *(A / B / C)* showing benefits + price
- Select package and quantity *(stepper)*
- Checkbox: “Register for souvenir shirt (160k/each)”
  - If checked → select sizes & quantities
- Sticky footer shows subtotal
- CTA: Continue

---

### **Step 5. Payment**
**Fields**
- Payment status *(Paid / Will pay later)*
- If Paid → Date of transfer *(date picker)*
- Bank transfer instructions *(accordion)*:
  - Syntax: `Name_Church_Name`
  - Account info (with “Copy” button)
- Upload receipt *(optional)*
- CTA: Continue

---

### **Step 6. Accommodation & Sponsorship**
**Fields**
- Stay status *(Already arranged / Not arranged)*
  - If arranged → enter accommodation info
  - If not → checkbox “Need assistance from organizers”
- Sponsorship amount *(currency input, VND)*
- Bank note & transfer date *(textarea)*
- Terms agreement *(must agree before submit)*
- CTA: Review & Submit

---

### **Review & Confirm Page**
**Summary Cards**
- Each section shows entered data + “Edit” button
- Show total fee + payment status
- CTA: **Submit Registration**

**Success Screen**
- Registration code + QR
- Buttons:
  - Add to Calendar (Google/Apple)
  - Share via Zalo/Email
- Invite to join Zalo/Telegram group

---

## ⚙️ Functional Requirements

| Category | Requirement |
|-----------|-------------|
| **Data Persistence** | Save progress locally (localStorage); send recovery magic link via email |
| **Validation** | Required fields marked, email format check, numeric steppers bounded |
| **Localization** | Vietnamese locale, phone masks, currency formatting |
| **Dynamic Logic** | Conditional visibility for spouse/children/travel sections |
| **Accessibility** | Labels above fields, helper/error text below |
| **Components** | Bottom-sheet select, segmented controls, steppers, sticky subtotal bar |
| **Integration** | Connect with backend endpoint `/api/registration` (POST/PUT) |
| **Responsive** | Mobile-first, scaling up for tablet layouts |

---

## 🧩 Optional Features (Phase 2)
- Organizer dashboard to view registrations
- Analytics for package selection & shirt sizes
- Export attendee list (Excel)
- Push notifications via Zalo OA / Telegram bot

---

## ✅ Acceptance Criteria
- [ ] Flow runs on mobile without layout breaks
- [ ] All 6 steps + review screen function correctly
- [ ] Data persists if page is refreshed
- [ ] Email and phone validations match locale standards
- [ ] Sticky footer actions visible at all times
- [ ] User can resume registration via magic link
- [ ] Vietnamese text localization completed
- [ ] Subtotal updates in real-time (package + shirts)

---

## 📁 Output Files (Expected)
- `/src/pages/registration/`
  - `Step1PersonalInfo.tsx`
  - `Step2Family.tsx`
  - `Step3Travel.tsx`
  - `Step4Package.tsx`
  - `Step5Payment.tsx`
  - `Step6Accommodation.tsx`
  - `Review.tsx`
  - `Success.tsx`
- `/src/components/common/`
  - `ProgressDots.tsx`
  - `StickyFooter.tsx`
  - `Stepper.tsx`
  - `BottomSheetSelect.tsx`

---