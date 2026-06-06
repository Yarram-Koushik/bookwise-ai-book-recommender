function Loader({ message = 'Loading books...' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
      <p className="mt-4 text-sm font-medium text-slate-300">{message}</p>
    </div>
  );
}

export default Loader;
