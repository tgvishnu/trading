export default function DecisionCard({ title, value, icon, className = "bg-white text-slate-900" }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/5">{icon}</div>
        <div>
          <p className="text-sm opacity-70">{title}</p>
          <h2 className="text-xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}
