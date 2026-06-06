import { BookOpen, Code2, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} BookWise AI. Built with Python, FastAPI,
          React, and Tailwind CSS.
        </p>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 p-2 text-slate-300">
            <Code2 size={18} />
          </span>

          <span className="rounded-full border border-white/10 p-2 text-slate-300">
            <BookOpen size={18} />
          </span>

          <span className="rounded-full border border-white/10 p-2 text-slate-300">
            <Mail size={18} />
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;