import { ReactNode, useState, useRef } from 'react';
import { Navbar } from '../organisms/Navbar';
import { CartDrawer } from '../organisms/CartDrawer';
import { OrderCheckoutModal } from '../organisms/OrderCheckoutModal';
import { Footer } from '../organisms/Footer';
import { useCart } from '../../context/CartContext';

interface MainLayoutProps {
  children: (props: {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    scrollToMenu: () => void;
    scrollToDeals: () => void;
  }) => ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { activeOrder } = useCart();

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToDeals = () => {
    const el = document.getElementById('flash-deals-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchClick = () => {
    handleScrollToMenu();
    setTimeout(() => {
      const searchInput = document.getElementById('menu-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 450);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Sticky Glass-morphic Navbar */}
      <Navbar
        onSearchClick={handleSearchClick}
        onDealsClick={handleScrollToDeals}
        onMenuClick={handleScrollToMenu}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {children({
          searchQuery,
          setSearchQuery,
          scrollToMenu: handleScrollToMenu,
          scrollToDeals: handleScrollToDeals,
        })}
      </main>

      {/* Sliding Glass-morphic Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Order Checkout & Live Tracking Modal */}
      <OrderCheckoutModal
        isOpen={isCheckoutOpen || !!activeOrder}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
