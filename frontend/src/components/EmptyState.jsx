import { BookX } from 'lucide-react';

function EmptyState({ icon: Icon = BookX, title = 'No books found', message = 'Try searching with a different book title.' }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-slate-300">
        <Icon />
      </div>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">{message}</p>
    </div>
  );
}

export default EmptyState;
