import {
  CheckCircle,
  Award,
  Shield,
  Truck,
  RotateCcw,
  Lock,
} from "lucide-react";

interface Badge {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

/**
 * Trust Badges Component
 * Displays trust signals and certifications:
 * - "As seen on" badges (Facebook, Instagram)
 * - Certifications (purity, authenticity)
 * - Guarantees (30-day returns, secure checkout)
 * - Shipping & delivery promises
 */
export function TrustBadges() {
  const badges: Badge[] = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified Authentic",
      description: "All jewelry certified for purity and authenticity",
      color: "from-amber-500/20 to-amber-600/10",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "As Seen On Facebook",
      description: "10K+ followers, verified business account",
      color: "from-blue-500/20 to-blue-600/10",
    },
    {
      icon: <RotateCcw className="w-8 h-8" />,
      title: "30-Day Returns",
      description: "Hassle-free returns within 30 days",
      color: "from-green-500/20 to-green-600/10",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure Checkout",
      description: "SSL encrypted, PCI DSS compliant payments",
      color: "from-purple-500/20 to-purple-600/10",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Shipping",
      description: "Tracked delivery within 2-3 business days",
      color: "from-orange-500/20 to-orange-600/10",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Buyer Protection",
      description: "Full refund guarantee if not satisfied",
      color: "from-red-500/20 to-red-600/10",
    },
  ];

  return (
    <section
      className="py-12 px-4"
      role="region"
      aria-label="Trust and certification badges"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            Why Trust Marjahans
          </h2>
          <p className="text-slate-300">
            Certified authentic jewelry with customer-first guarantees
          </p>
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${badge.color} border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:border-amber-500/40 transition-colors`}
            >
              {/* Icon */}
              <div className="text-amber-400 mb-4">{badge.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {badge.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-300">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* Additional trust info */}
        <div className="mt-12 bg-slate-800/50 border border-amber-500/20 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Stat 1 */}
            <div>
              <p className="text-3xl font-bold text-amber-400">30+</p>
              <p className="text-slate-300 mt-2">Years of Heritage</p>
              <p className="text-sm text-slate-400">Est. 1994 • Dhaka</p>
            </div>

            {/* Stat 2 */}
            <div>
              <p className="text-3xl font-bold text-amber-400">10K+</p>
              <p className="text-slate-300 mt-2">Happy Customers</p>
              <p className="text-sm text-slate-400">4.8★ Average Rating</p>
            </div>

            {/* Stat 3 */}
            <div>
              <p className="text-3xl font-bold text-amber-400">100%</p>
              <p className="text-slate-300 mt-2">Authentic Guarantee</p>
              <p className="text-sm text-slate-400">Certified & Verified</p>
            </div>
          </div>
        </div>

        {/* Certifications list */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400 mb-4">Certified by:</p>
          <div className="flex flex-wrap justify-center gap-6 text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              BIS (Bureau of Indian Standards)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Hallmark Certified
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              ISO 9001:2015
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
