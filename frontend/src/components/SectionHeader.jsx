function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p>}
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base leading-7 text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
