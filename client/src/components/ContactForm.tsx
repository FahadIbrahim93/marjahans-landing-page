import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-background border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                Get in Touch
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-widest">
            Let's Connect
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Have questions about our collection? Reach out to us and our team will assist you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Contact Information</h3>
              <p className="text-slate-400 mb-6">
                Get in touch with our team for inquiries about our jewelry collection, custom orders, or any other questions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-amber-400 font-semibold mb-1">Email</p>
                <a href="mailto:marjahans@gmail.com" className="text-slate-300 hover:text-amber-400 transition-colors">
                  marjahans@gmail.com
                </a>
              </div>
              <div>
                <p className="text-amber-400 font-semibold mb-1">Phone</p>
                <a href="tel:+8801234567890" className="text-slate-300 hover:text-amber-400 transition-colors">
                  +880 1234 567 890
                </a>
              </div>
              <div>
                <p className="text-amber-400 font-semibold mb-1">Location</p>
                <p className="text-slate-300">
                  Road 11, Banani<br />
                  Dhaka-1213, Bangladesh
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-amber-400 font-semibold">Follow Us</p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors text-sm uppercase tracking-widest">
                  Instagram
                </a>
                <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors text-sm uppercase tracking-widest">
                  Facebook
                </a>
                <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors text-sm uppercase tracking-widest">
                  Pinterest
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-white font-semibold text-sm">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="bg-card border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-white font-semibold text-sm">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="bg-card border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-white font-semibold text-sm">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1234 567 890"
                className="bg-card border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-white font-semibold text-sm">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your inquiry..."
                required
                rows={5}
                className="bg-card border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white uppercase tracking-widest font-bold transition-all duration-300"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
