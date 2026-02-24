import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const services: ServiceCard[] = [
  {
    id: 'rings',
    title: 'Rings',
    description: 'Exquisite rings crafted with precision, from classic designs to contemporary pieces',
    icon: '💍',
  },
  {
    id: 'necklaces',
    title: 'Necklaces',
    description: 'Elegant necklaces that complement any occasion, featuring premium materials',
    icon: '✨',
  },
  {
    id: 'bracelets',
    title: 'Bracelets',
    description: 'Stunning bracelets designed to enhance your personal style and elegance',
    icon: '🌟',
  },
  {
    id: 'earrings',
    title: 'Earrings',
    description: 'Timeless earrings that add sophistication and grace to your look',
    icon: '💎',
  },
  {
    id: 'bespoke',
    title: 'Bespoke',
    description: 'Custom jewelry creations tailored to your unique vision and preferences',
    icon: '👑',
  },
  {
    id: 'collections',
    title: 'Collections',
    description: 'Curated collections celebrating heritage, craftsmanship, and luxury',
    icon: '🎁',
  },
];

export function ServiceCards() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                Our Collections
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-widest">
            Curated <span className="text-amber-400">Treasures</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore our handpicked selection of jewelry, each piece representing the pinnacle of craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <Card className="h-full bg-card/50 border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer">
                <CardHeader>
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
