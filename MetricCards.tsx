import { ChurnStats } from "../types";
import { Users, ShieldCheck, UserX, Percent, Star, IndianRupee } from "lucide-react";
import { motion } from "motion/react";

interface MetricCardsProps {
  stats: ChurnStats;
}

export default function MetricCards({ stats }: MetricCardsProps) {
  const cards = [
    {
      id: "kpi-total",
      label: "Total Customers",
      value: stats.totalCustomers,
      description: "Total subscription base monitored",
      icon: Users,
      color: "border-gray-800 text-white bg-[#161b22]",
      iconBk: "bg-gray-800/50 text-gray-400",
    },
    {
      id: "kpi-active",
      label: "Active Customers",
      value: stats.activeCustomers,
      description: "Steady users generating cashflow",
      icon: ShieldCheck,
      color: "border-gray-800 text-white bg-[#161b22]",
      iconBk: "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20",
    },
    {
      id: "kpi-churned",
      label: "Churned Customers",
      value: stats.churnedCustomers,
      description: "Accounts canceled during tenure",
      icon: UserX,
      color: "border-gray-800 text-red-400 bg-[#161b22]",
      iconBk: "bg-red-950/40 text-red-400 border border-red-500/20",
    },
    {
      id: "kpi-rate",
      label: "Churn Rate",
      value: `${stats.churnRate}%`,
      description: "Key benchmark of retention risk",
      icon: Percent,
      color: "border-gray-800 text-orange-400 bg-[#161b22]",
      iconBk: "bg-orange-950/40 text-orange-400 border border-orange-500/20",
    },
    {
      id: "kpi-satisfaction",
      label: "Avg Satisfaction",
      value: `${stats.avgSatisfaction}/5.0`,
      description: "Customer feedback rating",
      icon: Star,
      color: "border-gray-800 text-white bg-[#161b22]",
      iconBk: "bg-blue-950/40 text-blue-400 border border-blue-500/20",
    },
    {
      id: "kpi-revenue",
      label: "Revenue Lost",
      value: `₹${stats.revenueLost.toLocaleString()}`,
      description: "Monthly MRR lost due to churn",
      icon: IndianRupee,
      color: "border-gray-800 text-red-400 bg-[#161b22]",
      iconBk: "bg-red-950/40 text-red-400 border border-red-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" id="kpi-container">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.id}
            id={card.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            className={`p-3 rounded-lg border border-solid shadow-3xs transition-all flex flex-col justify-between ${card.color}`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-200">{card.label}</span>
              <div className={`p-1 rounded-md ${card.iconBk}`}>
                <IconComponent className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl font-mono font-bold tracking-tight mb-0.5">{card.value}</div>
              <p className="text-[10px] text-gray-300 font-bold leading-tight">{card.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
