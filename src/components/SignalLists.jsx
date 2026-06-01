export default function SignalLists({ positives, warnings }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-xl font-semibold">Positive Signs</h2>
        {positives.length ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {positives.map((item, index) => (
              <li key={index} className="rounded-xl bg-emerald-50 p-3">✓ {item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No strong positive signs yet.</p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-xl font-semibold">Warning Signs</h2>
        {warnings.length ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {warnings.map((item, index) => (
              <li key={index} className="rounded-xl bg-red-50 p-3">⚠ {item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No major warning signs yet.</p>
        )}
      </div>
    </div>
  );
}
