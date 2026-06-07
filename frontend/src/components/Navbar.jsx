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
    `rounded-full px-4 py-2 text-sm font-semibold ${
      isActive
        ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/82 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 sm:h-11 sm:w-11">
            <BookOpen size={23} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-tight text-white sm:text-lg">BookWise AI</p>
            <p className="hidden text-xs text-slate-400 sm:block">Smart book discovery</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
        </div>

        <Link
          to="/recommend"
          className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300 lg:inline-flex"
        >
          Start
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/98 px-4 pb-4 shadow-2xl shadow-slate-950/60 md:hidden">
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
            <Link
              to="/recommend"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-full bg-white px-4 py-2.5 text-center text-sm font-black text-slate-950 hover:bg-cyan-300"
            >
              Start discovering
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
