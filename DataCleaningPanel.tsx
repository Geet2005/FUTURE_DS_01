import { useState } from "react";
import { Customer } from "../types";
import {
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DataCleaningPanelProps {
  isCleaned: boolean;
  onClean: () => void;
  onReset: () => void;
  rawCount: number;
  cleanStats: {
    cleanedCount: number;
    duplicatesRemoved: number;
    missingValuesImputed: number;
    invalidAgesCorrected: number;
  };
  cleanedCustomers: Customer[];
}

export default function DataCleaningPanel({
  isCleaned,
  onClean,
  onReset,
  rawCount,
  cleanStats,
  cleanedCustomers,
}: DataCleaningPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = cleanedCustomers.filter(
    (c) =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4" id="cleaning-panel">
      {/* 1. Compare Cards raw vs sanitized */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Uncleaned state */}
        <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase text-red-300 bg-red-950/40 border border-red-850 px-2.5 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Raw Ledger State (Dirty)</span>
              </span>
              <span className="text-[11px] text-gray-200 font-extrabold font-mono">Size: {rawCount} rows</span>
            </div>
            <h4 className="text-sm font-extrabold text-white mb-1.5">Ingested Database Anomalies</h4>
            <p className="text-xs text-gray-150 leading-normal mb-3 font-bold">
              Subscription accounts received from raw payment logs containing formatting drift, missing values, duplicates, and faulty negative numbers.
            </p>

            <div className="flex flex-col gap-2 mb-2 text-xs font-extrabold text-gray-250">
              <div className="flex items-center justify-between p-2 bg-[#0d1117] border border-gray-850 rounded">
                <span>Duplicate Records (Identical ID)</span>
                <span className="text-red-350 font-extrabold font-mono px-2 py-0.5 bg-red-955 border border-red-800/40 rounded text-[10px]">
                  + {cleanStats.duplicatesRemoved} violations
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0d1117] border border-gray-850 rounded">
                <span>Missing Account Parameters (Satisfaction/Charges)</span>
                <span className="text-red-355 font-extrabold font-mono px-2 py-0.5 bg-red-955 border border-red-800/40 rounded text-[10px]">
                  + {cleanStats.missingValuesImputed} missing points
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0d1117] border border-gray-850 rounded">
                <span>Out-Of-Range Values (Negative subscriber age)</span>
                <span className="text-red-355 font-extrabold font-mono px-2 py-0.5 bg-red-955 border border-red-800/40 rounded text-[10px]">
                  + {cleanStats.invalidAgesCorrected} violations
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-850">
            <button
              onClick={onClean}
              disabled={isCleaned}
              className={`w-full py-2 rounded font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isCleaned
                  ? "bg-gray-800 text-gray-500 border border-gray-755 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Play className="h-4 w-4 shrink-0" />
              <span>Perform Data Cleaning & Pandas Analysis</span>
            </button>
          </div>
        </div>

        {/* Cleaned state banner */}
        <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded flex items-center gap-1.5 ${
                isCleaned ? "bg-emerald-950/50 border-emerald-800 text-emerald-400" : "bg-gray-800 border-gray-700 text-gray-500"
              }`}>
                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{isCleaned ? "Sanitized Dataset State (Clean)" : "Sanitized Ledger State"}</span>
              </span>
              <span className="text-[11px] text-gray-200 font-extrabold font-mono font-semibold">
                Size: {isCleaned ? cleanStats.cleanedCount : "Incomplete"} rows
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white mb-1.5">Cleaning Algorithms Applied</h4>
            <p className="text-xs text-gray-150 leading-normal mb-3 font-bold">
              Our cleanup pipeline employs scikit-learn and pandas equivalents to restore ledger reliability and enable robust predictive model training.
            </p>

            <AnimatePresence mode="wait">
              {isCleaned ? (
                <motion.div
                  key="cleaned-detail"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-start gap-2.5 p-2 bg-[#0d1117] border border-gray-850 rounded">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-extrabold text-white">1. Duplicate Elimination</div>
                      <p className="text-[10px] text-gray-200 font-bold leading-normal">
                        Invoked pandas <code className="font-mono bg-[#161b22] text-[#e1e4e8] p-0.5 rounded text-[9px] font-bold">df.drop_duplicates(inplace=True)</code> to discard duplicate subscriber ID keys.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-[#0d1117] border border-gray-850 rounded">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-extrabold text-white">2. Mean Imputation</div>
                      <p className="text-[10px] text-gray-200 font-bold leading-normal">
                        Used <code className="font-mono bg-[#161b22] text-[#e1e4e8] p-0.5 rounded text-[9px] font-bold">df.fillna(df.mean())</code> for satisfaction score and bill costs using cohort-wide averages.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-[#0d1117] border border-gray-850 rounded">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-extrabold text-white">3. Scale Constraint Sanitization</div>
                      <p className="text-[10px] text-gray-200 font-bold leading-normal">
                        Discovered invalid/negative ages. Substituted values with mean boundaries.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div key="cleaned-pending" className="py-8 flex flex-col items-center justify-center text-gray-400 gap-1.5 border border-dashed border-gray-800 rounded bg-[#0d1117]">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400">Awaiting Pipeline Execution</span>
                  <span className="text-xs text-gray-300 font-bold">Press button on left to run cleaning algorithms</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {isCleaned && (
            <div className="pt-3 mt-3 border-t border-gray-850">
              <button
                onClick={onReset}
                className="w-full py-1.5 bg-gray-850 hover:bg-gray-800 text-white border border-gray-750 font-bold text-xs flex items-center justify-center gap-1.5 rounded cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                <span>Restore Dirty Ledger State</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive tabular display of Cleaned Customer Ledger */}
      {isCleaned && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-3xs flex flex-col gap-3"
          id="clean-table-container"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Cleaned Customer Database View</h4>
              <p className="text-xs text-gray-400 font-semibold">Browse sanitized subscriber attributes of the output payload ({filtered.length} matching rows)</p>
            </div>

            {/* Selector Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search ID, tier, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-[#0d1117] border border-gray-850 pl-9 pr-4 py-1.5 rounded text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-850 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0d1117] border-b border-gray-850 text-gray-400 font-bold font-mono">
                  <th className="p-2.5">Customer ID</th>
                  <th className="p-2.5">Gender</th>
                  <th className="p-2.5 font-mono">Age</th>
                  <th className="p-2.5">Subscription</th>
                  <th className="p-2.5 text-center font-mono">Tenure</th>
                  <th className="p-2.5 text-right font-mono">Charges</th>
                  <th className="p-2.5 text-center font-mono">Tickets</th>
                  <th className="p-2.5 text-center font-mono">Satisfaction</th>
                  <th className="p-2.5 text-center font-mono">Logins Inactive</th>
                  <th className="p-2 text-center">Churn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850 text-gray-300 font-semibold">
                {filtered.slice(0, 10).map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#0d1117]/80">
                    <td className="p-2.5 font-bold font-mono text-white">{cust.id}</td>
                    <td className="p-2.5">{cust.gender}</td>
                    <td className="p-2.5">{cust.age} yrs</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 bg-[#0d1117] border border-gray-800 text-gray-300 font-bold rounded text-[9px] uppercase tracking-wider font-mono">
                        {cust.subscriptionType}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">{cust.tenure}m</td>
                    <td className="p-2.5 text-right font-bold text-blue-400 font-mono">₹{cust.monthlyCharges.toFixed(2)}</td>
                    <td className="p-2.5 text-center font-mono">{cust.supportTickets}</td>
                    <td className="p-2.5 text-center font-mono">{cust.satisfactionScore} / 5</td>
                    <td className="p-2.5 text-center font-mono">{cust.lastLoginDays} days</td>
                    <td className="p-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        cust.churn === "Yes" ? "bg-red-950/40 border border-red-900/40 text-red-400" : "bg-emerald-950/40 border border-emerald-900/40 text-emerald-400"
                      }`}>
                        {cust.churn}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination footnote indicator */}
            {filtered.length > 10 && (
              <div className="p-2.5 bg-[#0d1117] border-t border-gray-850 text-[10px] text-gray-500 text-center font-bold uppercase tracking-wider font-mono">
                Showing top 10 items of {filtered.length} total subscribers...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
