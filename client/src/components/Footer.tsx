export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <h3 className="text-lg font-bold text-white tracking-widest">MARJAHAN'S</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Established in 1994. The definitive digital vault for luxury jewelry in Dhaka.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Collections</h4>
            <ul className="space-y-2">
              {['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-amber-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Support</h4>
            <ul className="space-y-2">
              {['Contact Us', 'Shipping Info', 'Returns', 'Care Guide'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-amber-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Newsletter</h4>
            <p className="text-slate-400 text-sm">Subscribe for exclusive offers and new collections</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-background border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
              />
              <button className="bg-amber-600 hover:bg-amber-500 text-white rounded-full px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-xs font-light tracking-widest uppercase">
            © 2026 Marjahan's • Est. 1994 • Dhaka Heritage
          </p>
          <div className="flex gap-6">
            {['Instagram', 'Facebook', 'Pinterest'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-slate-600 text-xs uppercase tracking-widest hover:text-amber-400 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
