import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/ServiceCards';
import { SocialProof } from '@/components/SocialProof';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ServiceCards />
      <SocialProof />
      <ContactForm />
      <Footer />
    </div>
  );
}
