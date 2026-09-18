# AuraBite - Principal Frontend Architecture

A high-performance, accessible, and GPU-accelerated food-tech web application engineered with React 19, Tailwind CSS v4, Motion (`motion/react`), and Lucide React.

---

## 🏛️ Architectural Directives & Key Decisions

### 1. Atomic Design Pattern (Component-First Architecture)
The codebase adheres strictly to the Atomic Design methodology to enforce modularity, eliminate code duplication, and isolate visual primitives from domain-specific business logic:

```
src/
├── components/
│   ├── atoms/          # Pure visual primitives (Button, Badge, PriceTag, RatingStars, ProgressiveImage, Input)
│   ├── molecules/      # Composite functional units (MenuItemCard, DealCountdownCard, CartItemRow, CategoryFilterPill, DietaryToggle)
│   ├── organisms/      # Complex standalone sections (Navbar, HeroSection, FlashDealsSection, MenuSection, CartDrawer, OrderCheckoutModal, Footer)
│   └── templates/      # Layout orchestrators (MainLayout)
├── context/            # React Context stores (CartContext, ToastContext)
├── hooks/              # Custom synchronization hooks (useCountdown, useIntersectionObserver, useParallax)
├── data/               # Strongly-typed culinary mock dataset
└── types/              # Domain TypeScript interfaces and enumerations
```

---

### 2. Zero Cumulative Layout Shift (CLS = 0)
Layout stability is fundamental to Google's Core Web Vitals. To guarantee **0 CLS**:
- **Explicit Aspect Ratios**: Every image container strictly reserves its bounding geometry via CSS aspect ratios (`aspect-[4/3]`, `aspect-square`, `aspect-[16/10]`) prior to asset downloads.
- **CSS Containment**: `ProgressiveImage` utilizes `contain: layout paint` to ensure image rendering and dimension calculations never trigger reflows in surrounding document siblings.
- **Smooth Cross-Fade Shimmers**: Placeholder gradient skeletons occupy the exact pixel box while high-resolution food assets load asynchronously with `decoding="async"`.

---

### 3. GPU Acceleration & Parallax Motion
All continuous transforms and scroll-driven parallax effects are offloaded to hardware layers:
- **`useScroll` & `useTransform`**: Motion transforms translate directly to hardware-accelerated 3D matrices (`transform: translate3d(0, y, 0)`), bypassing expensive layout recalculations.
- **CSS Layer Promotion**: Interactive elements utilize `.gpu-layer` (`will-change: transform, opacity; backface-visibility: hidden`) to create dedicated compositor layers.
- **Spring-Physics Micro-interactions**: Buttons, cart additions, and badges use damped spring physics (`type: 'spring', stiffness: 500, damping: 25`), producing responsive, anime-like tactile feel without frame-drops.

---

### 4. State Synchronization Across Tree
- **Drift-Free Countdown Clock (`useCountdown`)**: Flash deals synchronize against absolute epoch timestamps (`Date.now()`) rather than interval decrements. This eliminates JavaScript timer drift when tabs are throttled or blurred.
- **Micro-Interactive Cart (`CartContext`)**: The "Add to Cart" action executes a multi-channel micro-interaction:
  1. An upward-floating "+1 Added" badge with spring scale physics.
  2. A GPU-accelerated spring bounce sequence on the Navbar bag counter (`cartBounceKey`).
  3. Dynamic recalculation of the $40 free express delivery threshold.
  4. Non-blocking floating toast notification.

---

### 5. Design System: Deep Orange & Vibrant Green
- **Deep Orange (`#FF5722`)**: Denotes culinary warmth, gourmet energy, and primary interactive calls-to-action.
- **Vibrant Green (`#4CAF50`)**: Represents farm-to-table freshness, organic certification, and successful fulfillment states.
- **Glass-Morphism**: Layered semi-transparent backdrops (`backdrop-blur-xl`, `border-white/10`, `bg-slate-950/80`) with calibrated z-index boundaries (`z-0` through `z-50`).

---

## 🚀 Setup & Execution

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Install dependencies
npm install

# Launch development server (Port 3000)
npm run dev

# Run production build
npm run build

# Typecheck and lint
npm run lint
```
