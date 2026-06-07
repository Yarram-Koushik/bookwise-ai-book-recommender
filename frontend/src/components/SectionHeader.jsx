function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-4xl">
        {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-300 sm:text-sm">{eyebrow}</p>}
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
