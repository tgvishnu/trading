import { useMemo, useState } from "react";
import {
  Upload,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MinusCircle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DecisionCard from "./components/DecisionCard.jsx";
import InputTable from "./components/InputTable.jsx";
import AnalysisPanel from "./components/AnalysisPanel.jsx";
import SignalLists from "./components/SignalLists.jsx";
import { analyzeMarket } from "./services/analysisEngine.js";
import { parseMarketCsv } from "./services/csvParser.js";

const emptyRow = {
  date: "New Day",
  spot: "",
  spotChange: "",
  future: "",
  futureChange: "",
  oiChange: "",
  fiiLongs: "",
  fiiShorts: "",
  daysToExpiry: "",
};

const sampleRow = {
  date: "Today",
  spot: "25000",
  spotChange: "-12",
  future: "24831",
  futureChange: "-169",
  oiChange: "6",
  fiiLongs: "70000",
  fiiShorts: "110000",
  daysToExpiry: "18",
};

export default function App() {
  const [rows, setRows] = useState([sampleRow]);
  const latest = rows[rows.length - 1] || emptyRow;
  const analysis = useMemo(() => analyzeMarket(latest), [latest]);

  function updateField(index, field, value) {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    setRows(next);
  }

  function addRow() {
    setRows([...rows, emptyRow]);
  }

  function handleCsvUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseMarketCsv(e.target.result);
      if (parsed.length) setRows(parsed);
    };
    reader.readAsText(file);
  }

  const moodIcon = getMoodIcon(analysis.mood);
  const moodClass = getMoodClass(analysis.mood);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nifty Futures Entry Helper</h1>
            <p className="mt-2 text-slate-600">
              Upload data or enter values manually. The app explains the market in simple words.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100">
            <Upload className="h-5 w-5" />
            Upload CSV
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <DecisionCard title="Market Mood" value={analysis.mood} icon={moodIcon} className={moodClass} />
          <DecisionCard
            title="Can I Buy Now?"
            value={analysis.entryLong}
            icon={analysis.entryLong.includes("Avoid") || analysis.entryLong.includes("Not") ? <XCircle className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
          />
          <DecisionCard
            title="Can I Short?"
            value={analysis.entryShort}
            icon={analysis.entryShort.includes("Avoid") ? <XCircle className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
          />
          <DecisionCard title="Risk Level" value={analysis.risk} icon={<ShieldAlert className="h-7 w-7" />} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InputTable rows={rows} onChange={updateField} onAddRow={addRow} />
          </div>
          <AnalysisPanel analysis={analysis} />
        </div>

        <SignalLists positives={analysis.positives} warnings={analysis.warnings} />

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-xl font-semibold">CSV Format</h2>
          <p className="text-sm text-slate-600">Use these column names:</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-100 p-3 text-sm">
            date,spot,spotChange,future,futureChange,oiChange,fiiLongs,fiiShorts,daysToExpiry
          </pre>
        </div>

        <p className="text-xs text-slate-500">
          Educational tool only. Not financial advice. Always use stop loss and position sizing.
        </p>
      </div>
    </div>
  );
}

function getMoodIcon(mood) {
  if (mood.includes("Positive")) return <TrendingUp className="h-7 w-7" />;
  if (mood.includes("Negative")) return <TrendingDown className="h-7 w-7" />;
  if (mood.includes("Unclear")) return <AlertTriangle className="h-7 w-7" />;
  return <MinusCircle className="h-7 w-7" />;
}

function getMoodClass(mood) {
  if (mood === "Positive") return "bg-emerald-100 text-emerald-900";
  if (mood === "Mildly Positive") return "bg-lime-100 text-lime-900";
  if (mood === "Negative") return "bg-red-100 text-red-900";
  if (mood === "Strongly Negative") return "bg-rose-100 text-rose-900";
  return "bg-amber-100 text-amber-900";
}
