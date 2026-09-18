import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { MainLayout } from './components/templates/MainLayout';
import { HeroSection } from './components/organisms/HeroSection';
import { FlashDealsSection } from './components/organisms/FlashDealsSection';
import { MenuSection } from './components/organisms/MenuSection';

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <MainLayout>
          {({ searchQuery, setSearchQuery, scrollToMenu, scrollToDeals }) => (
            <>
              {/* Parallax Hero Section */}
              <HeroSection
                onExploreMenu={scrollToMenu}
                onViewDeals={scrollToDeals}
              />

              {/* Synchronized Flash Deals Section */}
              <FlashDealsSection />

              {/* Responsive Menu Grid Section */}
              <MenuSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </>
          )}
        </MainLayout>
      </CartProvider>
    </ToastProvider>
  );
}
