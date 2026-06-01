function Metric({ label, value }) {
  return (
    <div className="flex justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function AnalysisPanel({ analysis }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-semibold">Simple Analysis</h2>

      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
        <p className="text-sm text-slate-500">Market Score</p>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-4xl font-bold">{analysis.score}</span>
          <span className="pb-1 text-slate-500">/ 100</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-white">
          <div className="h-3 rounded-full bg-slate-900" style={{ width: `${analysis.score}%` }} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-950">
        <strong>What it means:</strong>
        <p className="mt-2">{analysis.simpleStory}</p>
      </div>

      <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Suggested action:</strong>
        <p className="mt-2">{analysis.guidance}</p>
      </div>

      <div className="mt-4 rounded-2xl bg-violet-50 p-4 text-sm text-violet-950">
        <strong>If already holding:</strong>
        <p className="mt-2">{analysis.holdingGuidance}</p>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <Metric label="Premium / Basis" value={analysis.basis.toFixed(2)} />
        <Metric label="FII Long/Short Ratio" value={analysis.fiiRatio.toFixed(2)} />
      </div>
    </div>
  );
}
