const fields = [
  ["date", "Date"],
  ["spot", "Spot Nifty"],
  ["spotChange", "Spot Change"],
  ["future", "Future Price"],
  ["futureChange", "Future Change"],
  ["oiChange", "OI Change %"],
  ["fiiLongs", "FII Longs"],
  ["fiiShorts", "FII Shorts"],
  ["daysToExpiry", "Days to Expiry"],
];

export default function InputTable({ rows, onChange, onAddRow }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Input Data</h2>
        <button onClick={onAddRow} className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
          Add Row
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              {fields.map(([key, label]) => (
                <th key={key} className="p-2 font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b last:border-0">
                {fields.map(([key]) => (
                  <td key={key} className="p-2">
                    <input
                      value={row[key] || ""}
                      onChange={(e) => onChange(index, key, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
