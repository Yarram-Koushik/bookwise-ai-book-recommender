function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
          {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
        </div>
        {Icon && (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
