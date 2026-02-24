import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Fatima Ahmed',
    comment: 'Absolutely stunning collection! The quality is exceptional and the customer service was impeccable. I will definitely order again.',
    rating: 5,
    date: '2 weeks ago',
  },
  {
    id: '2',
    name: 'Aisha Khan',
    comment: 'The craftsmanship is incredible. Each piece feels like a work of art. Worth every penny!',
    rating: 5,
    date: '1 month ago',
  },
  {
    id: '3',
    name: 'Noor Hassan',
    comment: 'Beautiful designs and fast delivery. The jewelry arrived perfectly packaged. Highly recommended!',
    rating: 5,
    date: '3 weeks ago',
  },
  {
    id: '4',
    name: 'Zainab Rahman',
    comment: 'I purchased the bespoke collection and was amazed by the attention to detail. A true luxury experience.',
    rating: 5,
    date: '1 week ago',
  },
];

export function SocialProof() {
  return (
    <section className="py-20 px-6 bg-card/30 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                Customer Love
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-widest">
            Trusted by <span className="text-amber-400">Collectors</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who have found their perfect piece
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-background border-white/10 hover:border-amber-500/30 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-300 leading-relaxed">{testimonial.comment}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm">
            <span className="text-amber-400 font-bold">638+</span> followers trust us on Facebook
          </p>
        </div>
      </div>
    </section>
  );
}
