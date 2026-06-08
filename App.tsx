import { useState, useMemo } from "react";
import { Customer } from "./types";
import {
  rawCustomersAndAnomalies,
  cleanCustomerDataset,
  calculateChurnStats,
} from "./data";
import MetricCards from "./components/MetricCards";
import ChartsCollection from "./components/ChartsCollection";
import PredictorForm from "./components/PredictorForm";
import DataCleaningPanel from "./components/DataCleaningPanel";
import ProjectExplorer from "./components/ProjectExplorer";
import GeminiAnalystPanel from "./components/GeminiAnalystPanel";

import {
  BarChart3,
  BrainCircuit,
  Wand,
  FolderTree,
  MessageSquare,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Database,
  CheckCircle,
  TrendingDown,
} from "lucide-react";

export default function App() {
  // Master state: Raw uncleaned customer dataset
  const [isCleaned, setIsCleaned] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "predictor" | "cleaner" | "explorer" | "analyst"
  >("dashboard");

  // Calculate stats on raw data first
  const rawCleanDetails = useMemo(() => {
    return cleanCustomerDataset(rawCustomersAndAnomalies);
  }, []);

  // Compute Active Cohort dynamically depending on whether cleaning is triggered
  const activeCohort = useMemo(() => {
    if (isCleaned) {
      return rawCleanDetails.cleanedData;
    }
    // Deep clone raw dataset to ensure safety, fallback invalid ages as is for "dirty" view
    return rawCustomersAndAnomalies.map((x) => ({
      id: x.id,
      gender: x.gender || "Male",
      age: x.age, // may contain negative
      subscriptionType: x.subscriptionType || "Basic",
      tenure: x.tenure || 12,
      monthlyCharges: x.monthlyCharges || 49.00,
      supportTickets: x.supportTickets || 0,
      satisfactionScore: x.satisfactionScore || 4,
      lastLoginDays: x.lastLoginDays || 3,
      churn: x.churn || "No",
    }));
  }, [isCleaned, rawCleanDetails]);

  // Recalculate Metrics statistics dynamically
  const cohortStats = useMemo(() => {
    return calculateChurnStats(activeCohort);
  }, [activeCohort]);

  // Triggering cleaning pipeline actions
  const handleTriggerCleanPipeline = () => {
    setIsCleaned(true);
  };

  const handleResetPipeline = () => {
    setIsCleaned(false);
  };

  return (
    <div className="bg-[#0a0c10] min-h-screen text-[#e1e4e8] font-sans tracking-tight pb-16 select-none" id="applet-viewport">
      {/* Dynamic Global Top Header Banner */}
      <header className="bg-[#0a0c10]/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 px-4 md:px-8 py-3" id="applet-navbar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 rounded px-2 py-0.5">
                <Sparkles className="h-3 w-3 animate-pulse text-indigo-400" />
                <span>Subscription Analytics Workspace</span>
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded flex items-center gap-1 ${
                isCleaned ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" : "bg-rose-950/40 border-rose-800 text-rose-455"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCleaned ? "bg-emerald-500" : "bg-rose-500 animate-ping"}`} />
                <span>{isCleaned ? "Data Cleaned & Imputed" : "Raw Diagnostic Mode"}</span>
              </span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white mb-0.5">
              Customer Retention & Churn Analysis
            </h1>
          </div>

          {/* Tab Navigation Controls */}
          <nav className="flex flex-wrap items-center bg-[#161b22] p-1 rounded-lg gap-0.5 border border-gray-800" id="tabs-navigation">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded text-xs font-bold tracking-tight transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-500/40 shadow-3xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Dashboard View</span>
            </button>

            <button
              onClick={() => setActiveTab("cleaner")}
              className={`px-3 py-1.5 rounded text-xs font-bold tracking-tight transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                activeTab === "cleaner"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-500/40 shadow-3xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Data Cleanup</span>
            </button>

            <button
              onClick={() => setActiveTab("predictor")}
              className={`px-3 py-1.5 rounded text-xs font-bold tracking-tight transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                activeTab === "predictor"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-500/40 shadow-3xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent"
              }`}
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Risk Predictor</span>
            </button>

            <button
              onClick={() => setActiveTab("explorer")}
              className={`px-3 py-1.5 rounded text-xs font-bold tracking-tight transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                activeTab === "explorer"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-500/40 shadow-3xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent"
              }`}
            >
              <FolderTree className="h-3.5 w-3.5" />
              <span>Project Files</span>
            </button>

            <button
              onClick={() => setActiveTab("analyst")}
              className={`px-3 py-1.5 rounded text-xs font-bold tracking-tight transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                activeTab === "analyst"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-500/40 shadow-3xs"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Aura Companion</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Primary responsive page payload */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6 flex flex-col gap-6" id="applet-content">
        {/* Metric Cards (KPI view) shown universally top-of-page to show live numbers reaction */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-gray-200 tracking-wider">Universal KPI Ledger</span>
            {!isCleaned && (
              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-955/30 border border-amber-800 px-2.5 py-0.5 rounded flex items-center gap-1">
                <span>⚠️ Raw Dataset contains duplicate items, missing metrics & negative subscriber ages</span>
              </span>
            )}
          </div>
          <MetricCards stats={cohortStats} />
        </div>

        {/* Tab Body views switch */}
        <div className="flex-1">
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              {/* Informative Intro Panel */}
              <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6" id="dashboard-intro">
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-white tracking-tight mb-1 flex items-center gap-1.5">
                    <span>Descriptive Customer Insights Overview</span>
                  </h2>
                  <p className="text-xs text-gray-100 leading-normal font-bold">
                    This interactive diagnostic portal assists renewal relationship managers in probing customer loyalty attributes. Review attrition distribution ratios, subscription plan behaviors, Support Tickets escalations, and revenue lost equivalents.
                  </p>
                </div>
                {!isCleaned && (
                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={() => {
                        setActiveTab("cleaner");
                        setTimeout(() => handleTriggerCleanPipeline(), 250);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Database className="h-4 w-4" />
                      <span>Run Cleanup Routine</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Charts grid */}
              <ChartsCollection customers={activeCohort} />

              {/* Business Insights & Recommendations Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4" id="insights-recommendations">
                {/* Insights section (Item 8) */}
                <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-3xs flex flex-col">
                  <h3 className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4 text-blue-400" />
                    <span>Calculated Strategic Insights</span>
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <div className="bg-[#0d1117] p-3 rounded border border-gray-800 leading-relaxed">
                      <h4 className="text-xs font-extrabold text-white mb-1">Satisfaction Correlate</h4>
                      <p className="text-[11px] text-gray-150 leading-normal font-bold">
                        Customers reporting satisfaction scores of 1 or 2 exhibit very high attrition rates, with churn probabilities accelerating past 80%.
                      </p>
                    </div>
                    <div className="bg-[#0d1117] p-3 rounded border border-gray-800 leading-relaxed">
                      <h4 className="text-xs font-extrabold text-white mb-1">Subscription Plan Class Limit</h4>
                      <p className="text-[11px] text-gray-155 leading-normal font-bold">
                        Basic plan customers accounts are the most volatile element of subscription MRR, with shorter tenures and lower engagement.
                      </p>
                    </div>
                    <div className="bg-[#0d1117] p-3 rounded border border-gray-800 leading-relaxed">
                      <h4 className="text-xs font-extrabold text-white mb-1">The Support Trap</h4>
                      <p className="text-[11px] text-gray-155 leading-normal font-bold">
                        Customers submitting 3 or more support tickets are significantly more likely to cancel, indicating service delivery friction.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations section (Item 9) */}
                <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-3xs flex flex-col">
                  <h3 className="text-[10px] uppercase font-bold text-green-400 tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Actionable Business Recommendations</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    <div className="bg-[#0d1117] p-3 rounded border border-gray-800 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-extrabold text-green-400 uppercase mb-1">Onboarding Optimization</h4>
                        <p className="text-[10.5px] text-gray-200 leading-snug font-bold">
                          Create walking tutorials and proactive success checkpoints in early tenure periods (months 1-3).
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#0d1117] p-3 rounded border border-gray-800 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-extrabold text-blue-400 uppercase mb-1">Incentive Target</h4>
                        <p className="text-[10.5px] text-gray-200 leading-snug font-bold">
                          Identify heavy Basic tier users nearing renewal; offer dynamic upgrades or loyalty conversion benefits.
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 bg-[#0d1117] p-3 rounded border border-gray-800">
                      <h4 className="text-[10px] font-extrabold text-orange-400 uppercase mb-1">Fast-Track Escalation Protocol</h4>
                      <p className="text-[10.5px] text-gray-200 leading-snug font-bold">
                        Route users with 3+ support tickets directly to priority customer success managers for proactive service recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cleaner" && (
            <DataCleaningPanel
              isCleaned={isCleaned}
              onClean={handleTriggerCleanPipeline}
              onReset={handleResetPipeline}
              rawCount={rawCustomersAndAnomalies.length}
              cleanStats={{
                cleanedCount: rawCleanDetails.cleanedData.length,
                duplicatesRemoved: rawCleanDetails.duplicatesRemoved,
                missingValuesImputed: rawCleanDetails.missingValuesImputed,
                invalidAgesCorrected: rawCleanDetails.invalidAgesCorrected,
              }}
              cleanedCustomers={activeCohort}
            />
          )}

          {activeTab === "predictor" && (
            <PredictorForm customers={activeCohort} />
          )}

          {activeTab === "explorer" && (
            <ProjectExplorer stats={cohortStats} />
          )}

          {activeTab === "analyst" && (
            <GeminiAnalystPanel stats={cohortStats} customers={activeCohort} />
          )}
        </div>
      </main>
    </div>
  );
}
