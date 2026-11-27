import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SignatureDishes } from './components/SignatureDishes';
import { MenuSection } from './components/MenuSection';
import { OurStory } from './components/OurStory';
import { Gallery } from './components/Gallery';
import { ReservationForm } from './components/ReservationForm';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastNotification } from './components/ToastNotification';

const MonacoApp: React.FC = () => {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-monaco-ivory text-monaco-darkText selection:bg-monaco-gold selection:text-monaco-deep">
      {/* Fixed Sticky Header Navigation */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <SignatureDishes />
        <MenuSection />
        <OurStory />
        <Gallery />
        <ReservationForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Quick Toast Notification on Adding Items */}
      <ToastNotification />
    </div>
  );
};

export function App() {
  return (
    <CartProvider>
      <MonacoApp />
    </CartProvider>
  );
}

export default App;
