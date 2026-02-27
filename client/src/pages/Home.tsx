import { useAuth } from '@/_core/hooks/useAuth';
import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/ServiceCards';
import { SocialProof } from '@/components/SocialProof';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { CartAbandonmentPrompt } from '@/components/CartAbandonmentPrompt';
import { useRef } from 'react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const chatWidgetRef = useRef<{ openChat: () => void }>(null);

  const handleOpenChat = () => {
    // Trigger chat widget to open
    const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
    chatButton?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ServiceCards />
      <SocialProof />
      <ContactForm />
      <Footer />
      
      {/* Live Chat Widget */}
      <ChatWidget />
      
      {/* Cart Abandonment Recovery Prompt */}
      <CartAbandonmentPrompt onChatClick={handleOpenChat} />
    </div>
  );
}
