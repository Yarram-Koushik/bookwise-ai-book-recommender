import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Recommend', path: '/recommend' },
  { name: 'Popular', path: '/popular' },
  { name: 'About', path: '/about' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium ${
      isActive
        ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <BookOpen size={24} />
          </span>
          <div>
            <p className="text-lg font-black tracking-tight text-white">BookWise AI</p>
            <p className="text-xs text-slate-400">Personalized Book Predictor</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 pb-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
