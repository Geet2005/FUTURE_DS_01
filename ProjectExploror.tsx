import { useState } from "react";
import { ProjectFile } from "../types";
import { mockFileSystem } from "../projectStructure";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileSpreadsheet,
  FileText,
  BookOpen,
  Terminal,
  Copy,
  Printer,
  File,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import { motion } from "motion/react";

interface ProjectExplorerProps {
  stats: any;
}

export default function ProjectExplorer({ stats }: ProjectExplorerProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string>("README.md");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    data: true,
    notebooks: true,
    reports: true,
  });

  const [copied, setCopied] = useState(false);

  // Toggle folders
  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  // Helper to locate file contents
  const findFileByPath = (files: ProjectFile[], path: string): ProjectFile | null => {
    for (const f of files) {
      if (f.path === path) return f;
      if (f.children) {
        const found = findFileByPath(f.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedFile = findFileByPath(mockFileSystem, selectedFilePath);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFileIcon = (file: ProjectFile) => {
    if (file.icon === "FileSpreadsheet") return <FileSpreadsheet className="h-4 w-4 text-emerald-550 mr-1.5 shrink-0" />;
    if (file.icon === "BookOpen") return <BookOpen className="h-4 w-4 text-amber-550 mr-1.5 shrink-0" />;
    if (file.icon === "FileText") return <FileText className="h-4 w-4 text-indigo-550 mr-1.5 shrink-0" />;
    return <FileCode className="h-4 w-4 text-slate-450 mr-1.5 shrink-0" />;
  };

  // Render Left Hierarchy Explorer recursively
  const renderTree = (files: ProjectFile[]) => {
    return (
      <ul className="space-y-1 pl-1">
        {files.map((file) => {
          if (file.type === "folder") {
            const isExpanded = !!expandedFolders[file.name];
            return (
              <li key={file.path} className="select-none">
                <div
                  onClick={() => toggleFolder(file.name)}
                  className="flex items-center text-xs font-extrabold text-gray-200 hover:text-indigo-400 cursor-pointer p-1 rounded transition-colors hover:bg-gray-800/20"
                >
                  {isExpanded ? <ChevronDown className="h-3 w-3 mr-0.5" /> : <ChevronRight className="h-3 w-3 mr-0.5" />}
                  {isExpanded ? (
                    <FolderOpen className="h-3.5 w-3.5 text-indigo-400 mr-1.5 shrink-0" />
                  ) : (
                    <Folder className="h-3.5 w-3.5 text-indigo-400 mr-1.5 shrink-0" />
                  )}
                  <span>{file.name}/</span>
                </div>
                {isExpanded && file.children && (
                  <div className="pl-4 border-l border-gray-800 ml-2 mt-0.5 animate-slideDown">
                    {renderTree(file.children)}
                  </div>
                )}
              </li>
            );
          } else {
            const isSelected = selectedFilePath === file.path;
            return (
              <li key={file.path} className="select-none">
                <div
                  onClick={() => {
                    setSelectedFilePath(file.path);
                    setCopied(false);
                  }}
                  className={`flex items-center text-xs p-1 px-1.5 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-950/30 text-blue-400 border border-blue-800/40 font-extrabold shadow-3xs"
                      : "text-gray-300 hover:bg-[#161b22] hover:text-white font-bold"
                  }`}
                >
                  {renderFileIcon(file)}
                  <span className="truncate">{file.name}</span>
                </div>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <div className="bg-[#161b22] rounded-lg border border-gray-800 shadow-sm overflow-hidden" id="project-explorer">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[640px]">
        {/* Left Tree sidebar */}
        <div className="lg:col-span-1 border-r border-gray-800 bg-[#0d1117] p-4" id="explorer-sidebar">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-3 block">
            Workspace Repository Tree
          </div>
          <div className="p-2.5 bg-[#161b22] border border-gray-800 rounded-lg mb-4 shadow-3xs">
            <span className="text-xs font-extrabold text-[#e1e4e8] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
              <span>Customer-Churn-Analysis/</span>
            </span>
          </div>
          {renderTree(mockFileSystem)}
        </div>

        {/* Right Preview content area */}
        <div className="lg:col-span-3 flex flex-col bg-[#161b22]" id="explorer-preview">
          {/* Top header of selected file */}
          <div className="p-4 border-b border-gray-800 bg-[#0d1117]/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-gray-200 select-all">{selectedFilePath}</span>
            </div>
            {selectedFile && selectedFile.path !== "reports/churn_report.pdf" && (
              <button
                onClick={() => handleCopy(selectedFile.content || "")}
                className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-805 hover:bg-gray-700 border border-gray-800 font-extrabold cursor-pointer text-white transition-colors"
              >
                <Copy className="h-3.5 w-3.5 text-indigo-400" />
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            )}
            {selectedFile && selectedFile.path === "reports/churn_report.pdf" && (
              <button
                onClick={() => window.print()}
                className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 border border-indigo-805 font-extrabold text-white cursor-pointer transition-colors"
                title="Use printing tool"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Diagnostic PDF</span>
              </button>
            )}
          </div>

          {/* Dynamic Render according to Language/File */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[580px]">
            {selectedFile ? (
              <div>
                {/* 1. CSV Visualizer Grid */}
                {selectedFile.language === "csv" && (
                  <div className="flex flex-col gap-4">
                    <div className="p-3 bg-emerald-950/45 border border-emerald-800/50 text-emerald-305 text-xs rounded flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                      <div className="font-bold text-gray-200">
                        <strong className="text-emerald-400 font-extrabold">Raw CSV Dataset Loaded</strong>: Consumed as input vector. Below shows the top rows of database <code className="font-mono font-bold bg-[#0d1117] text-white px-1.5 py-0.5 rounded border border-gray-800 text-[10px]">data/customer_churn.csv</code>.
                      </div>
                    </div>
                    <pre className="p-4 bg-slate-950 text-emerald-300 font-mono text-xs rounded border border-gray-800 leading-normal overflow-auto select-text whitespace-pre font-bold">
                      {selectedFile.content}
                    </pre>
                  </div>
                )}

                {/* 2. requirements.txt / raw text */}
                {selectedFile.language === "text" && (
                  <div className="flex flex-col gap-4">
                    <p className="text-xs text-gray-300 font-bold">Pip packages required to reconstruct Jupyter analysis locally.</p>
                    <pre className="p-5 bg-slate-950 text-indigo-200 font-mono text-xs rounded leading-relaxed select-text border border-gray-800 font-bold">
                      {selectedFile.content}
                    </pre>
                  </div>
                )}

                {/* 3. README.md fully rendered layout */}
                {selectedFile.language === "markdown" && (
                  <div className="prose max-w-none text-xs text-gray-205 leading-relaxed font-bold">
                    <div className="bg-indigo-950/40 p-4 border border-indigo-900/40 rounded mb-4">
                      <h4 className="text-sm font-extrabold text-indigo-300 mb-1 flex items-center gap-1">
                        <span>README Presentation Layer</span>
                      </h4>
                      <p className="text-[11px] text-indigo-200 leading-normal">
                        This Markdown represents the repository introductory documentation suited for GitHub.
                      </p>
                    </div>

                    <div className="bg-[#0d1117] border border-gray-800 p-6 rounded select-text whitespace-pre-line text-xs font-sans text-gray-200 font-bold">
                      {selectedFile.content}
                    </div>
                  </div>
                )}

                {/* 4. Jupyter Notebook cells visualizer */}
                {selectedFilePath === "notebooks/churn_analysis.ipynb" && (
                  <div className="flex flex-col gap-6 font-sans">
                    <div className="border-b border-gray-800 pb-3 mb-1">
                      <div className="text-[10px] font-extrabold uppercase text-amber-305 bg-amber-955/30 px-2.5 py-0.5 rounded w-max border border-amber-800/60">
                        Interactive Jupyter Notebook Viewer
                      </div>
                      <h4 className="text-sm font-extrabold text-white mt-1.5">
                        Analytical Pipeline execution cells
                      </h4>
                    </div>

                    {/* Decode notebook representation JSON and render as actual Cells */}
                    {(() => {
                      try {
                        const nb = JSON.parse(selectedFile.content ?? "{}");
                        return nb.cells.map((cell: any, cidx: number) => {
                          const isCode = cell.type === "code";
                          return (
                            <div key={cidx} className="border border-gray-800 rounded-lg overflow-hidden shadow-3xs bg-[#0d1117]/30">
                              {/* Cell Header */}
                              <div className="bg-[#0d1117] border-b border-gray-850 px-3.5 py-1.5 flex items-center justify-between font-mono text-[10px] text-gray-300 font-bold">
                                <span>{isCode ? `In [${cidx + 1}]` : "Markdown Context Cell"}</span>
                                <span className="bg-indigo-955/40 border border-indigo-900/30 text-indigo-400 px-2 py-0.5 rounded text-[9px] font-extrabold">
                                  {cell.type.toUpperCase()}
                                </span>
                              </div>

                              {/* Cell Body */}
                              <div className="p-3.5 select-text">
                                {isCode ? (
                                  <div className="flex flex-col gap-3">
                                    <pre className="text-xs bg-slate-950 text-indigo-200 p-3 rounded leading-relaxed font-mono font-bold select-text border border-gray-850">
                                      {cell.input}
                                    </pre>
                                    {cell.output && (
                                      <div>
                                        <div className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wider">Console Output</div>
                                        <pre className="text-xs bg-black text-emerald-400 p-3 rounded font-mono leading-relaxed select-text font-extrabold border border-emerald-950/40">
                                          {cell.output}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-250 leading-relaxed font-bold whitespace-pre-line bg-[#0d1117] border border-gray-800 p-3.5 rounded">
                                    {cell.source}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        });
                      } catch (err) {
                        return <p className="text-white">Failure to decode notebook cells.</p>;
                      }
                    })()}
                  </div>
                )}

                {/* 5. PDF Diagnostic Report formal styled printable layout */}
                {selectedFilePath === "reports/churn_report.pdf" && (
                  <div className="bg-white p-2 text-slate-800 font-sans select-text select-all" id="printable-report">
                    <div className="border-4 border-double border-slate-800 p-8 rounded shadow-xs relative bg-white select-text">
                      {/* Watermark */}
                      <div className="absolute inset-0 opacity-2 pointer-events-none flex items-center justify-center text-slate-900 font-bold select-none text-[8vw] rotate-15">
                        CONFIDENTIAL
                      </div>

                      {/* Header */}
                      <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                        <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Executive Brief Diagnostic</div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 mt-1 uppercase">
                          Subscription Customer Churn & Diagnostic Report
                        </h1>
                        <div className="text-[10px] text-slate-500 mt-1.5 font-semibold">
                          Date: June 2026 • Prepared by Customer Success Operations • Classification: SECURE
                        </div>
                      </div>

                      {/* Summary blocks */}
                      <div className="grid grid-cols-3 gap-4 mb-6 border border-slate-350 bg-slate-50 p-3.5 rounded-lg">
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400">Database Scope</div>
                          <div className="text-sm font-bold text-slate-805">{stats.totalCustomers} Accounts</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400">Analyzed Churn Risk</div>
                          <div className="text-sm font-bold text-rose-600">{stats.churnRate}% rate</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400">MRR Impact Lost</div>
                          <div className="text-sm font-bold text-red-650">₹{stats.revenueLost.toLocaleString()} / mo</div>
                        </div>
                      </div>

                      {/* 10. Report section contents */}
                      <div className="space-y-6 text-xs text-slate-700 leading-relaxed font-semibold">
                        <div>
                          <h3 className="text-xs uppercase font-extrabold text-slate-900 border-b border-slate-800 pb-1 mb-2">
                            I. Project Overview & Operational Purpose
                          </h3>
                          <p>
                            This formal diagnostic brief investigates customer attrition (churn) factors across our monthly subscription products. Subscription fatigue, pricing drift, and unresolved technical issues are the main causes. Resolving customer churn requires robust diagnostic tools. We build these tools to help user operations team members anticipate risks and secure proactive renewals.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xs uppercase font-extrabold text-slate-900 border-b border-slate-800 pb-1 mb-2">
                            II. Dataset Characteristics & Vector Distribution
                          </h3>
                          <p>
                            Our diagnostic database accounts for active and canceled accounts detailing structural variables: customer attributes like Tenure, Age, Subscription plan type (Basic, Pro, Premium), monthly billing costs, support tickets submitted, and direct survey satisfaction grades (scaled 1 to 5). Handled missing variables and cleaned duplicates to achieve 100% data fidelity.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xs uppercase font-extrabold text-slate-900 border-b border-slate-800 pb-1 mb-2">
                            III. Principal Exploratory Findings (EDA)
                          </h3>
                          <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                              <strong>Basic Plan Drift</strong>: Customers on the Basic Plan exhibit the highest cancellation coefficients. Pro and Premium, with higher costs, show longer loyal tenures due to increased utility.
                            </li>
                            <li>
                              <strong>Support Tickets Escalation</strong>: A ticket count ≥ 3 is the primary indicator of churn risk. Unresolved tickets cause churn probability to rise from 12% to over 68%.
                            </li>
                            <li>
                              <strong>Satisfaction Anchors</strong>: Subscribers rating their satisfaction at 1 or 2 are almost certain to cancel their subscriptions.
                            </li>
                            <li>
                              <strong>Early Tenure Vulnerability</strong>: New accounts (tenure ≤ 4 months) account for a disproportionate share of all churn.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xs uppercase font-extrabold text-slate-900 border-b border-slate-800 pb-1 mb-2">
                            IV. Strategic Business Recommendations
                          </h3>
                          <div className="space-y-2 mt-2">
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                              <strong>1. Optimize Onboarding</strong>: Implement in-app walk-throughs during the first 3 months to decrease early tenure drop-offs.
                            </div>
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                              <strong>2. Automate Proactive Pricing Offers</strong>: Offer Pro or Premium upgrades at a discount to high-use Basic Plan users.
                            </div>
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                              <strong>3. Accelerate Support Priority</strong>: Route customer accounts with duplicate tickets to a VIP queue for rapid resolution.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>Awaiting file selection...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
