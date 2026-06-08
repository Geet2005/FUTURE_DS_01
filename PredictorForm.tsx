import { useState, useEffect } from "react";
import { Customer, PredictiveMetrics } from "../types";
import {
  trainLogisticRegression,
  predictCustomerChurnProbability,
} from "../data";
import {
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Wand2,
  ListRestart,
  BarChart2,
  Sparkles,
  Mail,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PredictorFormProps {
  customers: Customer[];
}

export default function PredictorForm({ customers }: PredictorFormProps) {
  // Model performance state
  const [metrics, setMetrics] = useState<PredictiveMetrics | null>(null);
  const [weightsVersion, setWeightsVersion] = useState(1);

  // Custom User Inputs state for Simulator
  const [simGender, setSimGender] = useState<"Male" | "Female">("Female");
  const [simAge, setSimAge] = useState(32);
  const [simSub, setSimSub] = useState<"Basic" | "Pro" | "Premium">("Basic");
  const [simTenure, setSimTenure] = useState(3);
  const [simCharges, setSimCharges] = useState(49.0);
  const [simTickets, setSimTickets] = useState(4);
  const [simSatisfaction, setSimSatisfaction] = useState(2);
  const [simLogins, setSimLogins] = useState(14);

  // Prediction Output State
  const [predictedProb, setPredictedProb] = useState<number | null>(null);

  // Selected Risk account for Detail drilldown & Gemini Assistant recovery call
  const [highRiskAccounts, setHighRiskAccounts] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Standard model training whenever dataset changes (e.g. data cleaned)
  useEffect(() => {
    const { metrics: modelMetrics } = trainLogisticRegression(customers);
    setMetrics(modelMetrics);

    // Compute risk scores for all active customers to list current ones at risk!
    const activeAccounts = customers.filter(c => c.churn === "No");
    const evaluated = activeAccounts.map(c => {
      const prob = predictCustomerChurnProbability(c, customers);
      return { ...c, riskScore: prob };
    });

    // Sort descending by risk score, filter top risk scores above 45%
    const risks = evaluated
      .filter(c => (c.riskScore ?? 0) >= 45)
      .sort((a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0));

    setHighRiskAccounts(risks.slice(0, 5));
    // Clear simulation on reload
    setPredictedProb(null);
    setAiResult(null);
    setSelectedCustomer(null);
  }, [customers, weightsVersion]);

  // Execute manual prediction simulator
  const handleSimulationPredict = () => {
    const dummyCust: Customer = {
      id: "SIM-CUST",
      gender: simGender,
      age: simAge,
      subscriptionType: simSub,
      tenure: simTenure,
      monthlyCharges: simCharges,
      supportTickets: simTickets,
      satisfactionScore: simSatisfaction,
      lastLoginDays: simLogins,
      churn: "No", // prediction target
    };
    const prob = predictCustomerChurnProbability(dummyCust, customers);
    setPredictedProb(prob);
  };

  // Run server-side Gemini recover template
  const handleRunAiRetention = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setLoadingAi(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch("/api/churn/ai-retention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Fail to generate strategy");
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Something went wrong contact Aura client server.");
    } finally {
      setLoadingAi(false);
    }
  };

  const getRiskColor = (prob: number) => {
    if (prob >= 70) return { bg: "bg-rose-950/40 border-rose-800/60 text-rose-300", badge: "bg-rose-500 text-white", text: "Critically High Churn Risk" };
    if (prob >= 35) return { bg: "bg-orange-950/40 border-orange-850/60 text-orange-300", badge: "bg-orange-500 text-white", text: "Elevated Retention Warning" };
    return { bg: "bg-emerald-950/40 border-emerald-800/60 text-emerald-300", badge: "bg-emerald-500 text-white", text: "Healthy Account / Stable Loyal" };
  };

  return (
    <div className="flex flex-col gap-4" id="predictor-panel">
      {/* 1. Model Diagnostic Banner & Weights summary */}
      {metrics && (
        <div className="bg-[#161b22] text-[#e1e4e8] rounded-lg p-4 border border-gray-800 shadow-3xs" id="model-stats">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-gray-800/60 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                  Supervised Predictor
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Trained Live on Cleaned Data</span>
              </div>
              <h3 className="text-sm font-bold tracking-tight text-white">Logistic Regression Engine Diagnostics</h3>
            </div>
            <button
              onClick={() => setWeightsVersion(v => v + 1)}
              className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 rounded text-white cursor-pointer"
            >
              <ListRestart className="h-3.5 w-3.5 text-indigo-400" />
              <span>Retrain Estimator</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-[#0d1117] p-3 rounded border border-gray-800">
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Classification Accuracy</span>
              <div className="text-2xl font-mono font-bold tracking-tight text-emerald-400 mt-0.5">{metrics.accuracy}%</div>
              <p className="text-[9px] text-gray-500 mt-0.5">Ratio of perfect churn label predictions</p>
            </div>
            <div className="bg-[#0d1117] p-3 rounded border border-gray-800">
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Precision Metric</span>
              <div className="text-2xl font-mono font-bold tracking-tight text-indigo-400 mt-0.5">{metrics.precision}%</div>
              <p className="text-[9px] text-gray-500 mt-0.5">Rate of true risks identified versus flags</p>
            </div>
            <div className="bg-[#0d1117] p-3 rounded border border-gray-800">
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Sensitivity / Recall</span>
              <div className="text-2xl font-mono font-bold tracking-tight text-pink-400 mt-0.5">{metrics.recall}%</div>
              <p className="text-[9px] text-gray-500 mt-0.5">Percent of actual churners successfully found</p>
            </div>
            <div className="bg-[#0d1117] p-3 rounded border border-gray-800">
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">F1-Score Benchmark</span>
              <div className="text-2xl font-mono font-bold tracking-tight text-amber-400 mt-0.5">{metrics.f1Score}%</div>
              <p className="text-[9px] text-gray-500 mt-0.5">Harmonic average balancing precision & recall</p>
            </div>
          </div>

          {/* Feature Importances Visual Rows */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4 text-indigo-405" />
              <span>Regression Feature Weights Importance Summary</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {metrics.featureImportance.slice(0, 8).map((feat, idx) => {
                const ratio = Math.min(100, Math.round((feat.importance / 1.5) * 100));
                const isRiskFactor = feat.direction.includes("(+)");
                return (
                  <div key={idx} className="bg-[#0d1117] p-2 rounded.5 border border-gray-800/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold text-gray-300">{feat.feature}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${isRiskFactor ? "bg-rose-950/50 text-rose-300 border border-rose-500/10" : "bg-emerald-950/50 text-emerald-300 border border-emerald-500/10"}`}>
                        {isRiskFactor ? "Hazard (+)" : "Shield (-)"}
                      </span>
                    </div>
                    <div>
                      <div className="w-full bg-[#161b22] h-1 rounded overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${isRiskFactor ? "bg-red-400" : "bg-emerald-400"}`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono">
                        <span>Relative Weight:</span>
                        <span className="font-bold text-gray-400">{feat.importance}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Simulator and Active Risks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* L1: Custom retention predictor simulator input form */}
        <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-xs flex flex-col" id="simulator-form">
          <h3 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-blue-400" />
            <span>Customer Churn Risk Probability Calculator</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Gender */}
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Gender Class</label>
              <select
                value={simGender}
                onChange={(e: any) => setSimGender(e.target.value)}
                className="w-full text-xs font-semibold text-white bg-[#0d1117] border border-gray-850 rounded p-1.5 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            {/* Age */}
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Age ({simAge} yr)</label>
              <input
                type="range"
                min="18"
                max="80"
                value={simAge}
                onChange={(e) => setSimAge(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded cursor-pointer mt-2.5"
              />
            </div>
            {/* Subscription class */}
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-gray-250 mb-1.5">Subscription Class</label>
              <select
                value={simSub}
                onChange={(e: any) => setSimSub(e.target.value)}
                className="w-full text-xs font-bold text-white bg-[#0d1117] border border-gray-850 rounded p-1.5 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            {/* Tenure months */}
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-gray-250 mb-1.5">Tenure Length ({simTenure}m)</label>
              <input
                type="range"
                min="1"
                max="48"
                value={simTenure}
                onChange={(e) => setSimTenure(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded cursor-pointer mt-2.5"
              >
              </input>
            </div>
            {/* Monthly charges (INR value equivalent) */}
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-gray-250 mb-1.5">Monthly Cost Charge (₹)</label>
              <input
                type="number"
                value={simCharges}
                onChange={(e) => setSimCharges(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono font-bold text-white bg-[#0d1117] border border-gray-850 rounded p-1.5 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
            {/* Support tickets */}
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-gray-250 mb-1.5">Support Tickets Opened ({simTickets})</label>
              <input
                type="range"
                min="0"
                max="8"
                value={simTickets}
                onChange={(e) => setSimTickets(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded cursor-pointer mt-2.5"
              >
              </input>
            </div>
            {/* Satisfaction Score */}
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-gray-250 mb-1.5">Satisfaction Score (1-5)</label>
              <select
                value={simSatisfaction}
                onChange={(e) => setSimSatisfaction(parseInt(e.target.value))}
                className="w-full text-xs font-bold text-white bg-[#0d1117] border border-gray-850 rounded p-1.5 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
              >
                <option value={1}>1 - Dissatisfied (Critical)</option>
                <option value={2}>2 - Disgruntled</option>
                <option value={3}>3 - Neutral</option>
                <option value={4}>4 - Pleased</option>
                <option value={5}>5 - Excellent Enthusiast</option>
              </select>
            </div>
            {/* Last login days */}
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-gray-250 mb-1.5">Inactivity Days ({simLogins})</label>
              <input
                type="range"
                min="0"
                max="30"
                value={simLogins}
                onChange={(e) => setSimLogins(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded cursor-pointer mt-2.5"
              >
              </input>
            </div>
          </div>

          <button
            onClick={handleSimulationPredict}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs tracking-wide rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-auto"
          >
            <span>Evaluate Account Churn Prediction</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Simulated result drawer */}
          <AnimatePresence>
            {predictedProb !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={`mt-4 p-3 rounded border border-solid ${
                  getRiskColor(predictedProb).bg
                } flex flex-col items-center justify-center text-center`}
              >
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-200 mb-1">
                  Simulation Outcome
                </span>
                <div className="text-3xl font-mono font-bold tracking-tight text-white">
                  {predictedProb}% <span className="text-sm font-sans font-medium text-gray-400">risk</span>
                </div>
                <div className={`mt-1.5 px-2.5 py-0.5 text-[9px] uppercase font-bold rounded ${getRiskColor(predictedProb).badge}`}>
                  {getRiskColor(predictedProb).text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* R2: High Risk Accounts identified in current dataset */}
        <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-xs flex flex-col" id="active-risks">
          <h3 className="text-sm font-bold text-white tracking-tight mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-500" />
              <span>Target Flagged High-Risk Accounts</span>
            </span>
            <span className="text-[9px] font-bold text-red-400 bg-red-950/40 border border-red-800/60 px-2 py-0.5 rounded">
              Predictive Radar
            </span>
          </h3>
          <p className="text-xs text-gray-400 mb-3 font-semibold leading-normal">
            The machine learning model evaluated active account attributes and flagged these customers as having high-risk values. Click to trigger personalized recovery strategies.
          </p>

          <div className="flex flex-col gap-2.5" id="risk-list">
            {highRiskAccounts.map((cust) => {
              const risk = cust.riskScore ?? 0;
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  className={`p-3 rounded border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
                    isSelected ? "bg-[#0d1117] border-blue-500/50 shadow-xs" : "bg-[#0d1117]/50 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-white">ID: {cust.id}</span>
                      <span className="text-[9px] text-gray-400 px-1.5 py-0.5 bg-[#161b22] border border-gray-800 rounded font-bold font-mono">
                        {cust.subscriptionType} Class
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-semibold leading-normal">
                      {cust.age} yrs • {cust.tenure}m tenure • {cust.supportTickets} tickets • Satisfaction: {cust.satisfactionScore}/5
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-lg font-mono font-bold text-red-400 leading-none">{risk}%</div>
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Churn Risk</span>
                    </div>
                    <button
                      onClick={() => { setCopied(false); handleRunAiRetention(cust); }}
                      disabled={loadingAi}
                      className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-gray-700 disabled:bg-gray-800 rounded inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {loadingAi && isSelected ? (
                        <Loader2 className="h-3 w-3 animate-spin text-white" />
                      ) : (
                        <Sparkles className="h-3 w-3 text-amber-400" />
                      )}
                      <span>Draft Action</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Drill down panel generated by server-side Gemini recover */}
      <AnimatePresence>
        {(selectedCustomer && (aiResult || loadingAi || aiError)) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-[#161b22] border border-gray-800 p-4 rounded-lg shadow-xs mt-4"
            id="ai-drilldown"
          >
            <div className="flex items-center justify-between border-b border-gray-850 pb-3 mb-4">
              <div>
                <span className="text-[9px] font-bold uppercase text-indigo-400 border border-indigo-900/60 px-2 py-0.5 rounded bg-indigo-950/40 flex items-center gap-1 w-max">
                  <Sparkles className="h-3 w-3" />
                  <span>Aura Strategic Retention Generator</span>
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">
                  Optimized Retention Profile: Customer {selectedCustomer.id}
                </h4>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-xs text-gray-400 hover:text-white cursor-pointer font-bold"
              >
                Dismiss Profile
              </button>
            </div>

            {loadingAi ? (
              <div className="py-10 flex flex-col items-center justify-center text-gray-400 gap-3" id="ai-loading">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                <span className="text-xs font-semibold text-gray-400 animate-pulse">
                  Querying Aura deep retention scientist over user traits...
                </span>
              </div>
            ) : aiError ? (
              <div className="p-3 bg-red-950/30 border border-red-910 text-red-300 text-xs rounded" id="ai-error">
                {aiError}
              </div>
            ) : aiResult ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" id="ai-outcome-grid">
                {/* Strategic analysis */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="bg-[#0d1117] p-3 rounded border border-gray-800">
                    <span className="text-[9px] uppercase font-bold text-red-400 flex items-center gap-1 mb-1.5">
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>Risk Diagnosis</span>
                    </span>
                    <p className="text-[11px] text-gray-300 leading-normal font-semibold">
                      {aiResult.riskAnalysis}
                    </p>
                  </div>

                  <div className="bg-[#0d1117] p-3 rounded border border-gray-800 border-l-4 border-l-emerald-500">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 flex items-center gap-1 mb-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Proposed Recover Incentive</span>
                    </span>
                    <div className="text-[11px] text-emerald-300 leading-normal font-bold">
                      {aiResult.keyIncentive}
                    </div>
                  </div>

                  <div className="bg-[#0d1117] text-gray-300 p-3 rounded border border-gray-800 flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-indigo-400 flex items-center gap-1 mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Action Roadmap for Manager</span>
                    </span>
                    <ul className="list-disc list-inside text-[10px] text-gray-400 leading-normal flex flex-col gap-1 pl-1 font-semibold">
                      {(aiResult.actionPlan || []).map((step: string, idx: number) => (
                        <li key={idx}> {step} </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Personalized email */}
                <div className="lg:col-span-8 bg-[#0d1117] p-3 rounded border border-gray-800 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 bg-[#161b22] border border-gray-800 p-2 rounded">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    <div>
                      <div className="text-[8px] uppercase font-bold text-gray-500 font-mono">Subject Draft:</div>
                      <div className="text-xs font-bold text-white">{aiResult.retentionEmailSubject}</div>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#161b22]/40 p-3 rounded border border-gray-850 font-mono text-[10.5px] leading-relaxed text-gray-305 select-text whitespace-pre-line overflow-y-auto max-h-56">
                    {aiResult.retentionEmailBody}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[10px] text-emerald-400 font-bold transition-all">
                      {copied ? "✓ Copied offer to clipboard" : ""}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Subject: ${aiResult.retentionEmailSubject}\n\n${aiResult.retentionEmailBody}`
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 transition-colors text-[10px] font-bold text-white rounded cursor-pointer"
                    >
                      Copy Retention Email
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
