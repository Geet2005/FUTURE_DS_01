import { Customer, ChurnStats, PredictiveMetrics } from "./types";

// Raw Initial Customers (with synthetic duplicates, missing values, and anomalies)
export const initialRawCustomers: any[] = [
  // 1. Churned subscribers (highly correlated with high support tickets, low satisfaction, and low tenure)
  { id: "C1011", gender: "Female", age: 34, subscriptionType: "Basic", tenure: 2, monthlyCharges: 45.0, supportTickets: 5, satisfactionScore: 1, lastLoginDays: 14, churn: "Yes" },
  { id: "C1012", gender: "Male", age: 45, subscriptionType: "Basic", tenure: 3, monthlyCharges: 45.0, supportTickets: 4, satisfactionScore: 2, lastLoginDays: 20, churn: "Yes" },
  { id: "C1013", gender: "Female", age: 22, subscriptionType: "Basic", tenure: 1, monthlyCharges: 49.0, supportTickets: 6, satisfactionScore: null, lastLoginDays: 25, churn: "Yes" }, // missing satisfaction
  { id: "C1014", gender: "Male", age: -12, subscriptionType: "Basic", tenure: 4, monthlyCharges: 39.0, supportTickets: 3, satisfactionScore: 2, lastLoginDays: 18, churn: "Yes" }, // invalid age (-12)
  { id: "C1014", gender: "Male", age: -12, subscriptionType: "Basic", tenure: 4, monthlyCharges: 39.0, supportTickets: 3, satisfactionScore: 2, lastLoginDays: 18, churn: "Yes" }, // DUPLICATE C1014
  { id: "C1015", gender: "Female", age: 29, subscriptionType: "Basic", tenure: 3, monthlyCharges: null, supportTickets: 4, satisfactionScore: 2, lastLoginDays: 22, churn: "Yes" }, // missing charge
  { id: "C1016", gender: "Male", age: 50, subscriptionType: "Pro", tenure: 5, monthlyCharges: 79.0, supportTickets: 5, satisfactionScore: 1, lastLoginDays: 12, churn: "Yes" },
  { id: "C1017", gender: "Female", age: 19, subscriptionType: "Pro", tenure: 2, monthlyCharges: 85.0, supportTickets: 5, satisfactionScore: 2, lastLoginDays: 16, churn: "Yes" },
  { id: "C1018", gender: "Male", age: 61, subscriptionType: "Premium", tenure: 8, monthlyCharges: 120.0, supportTickets: 6, satisfactionScore: 1, lastLoginDays: 8, churn: "Yes" },
  { id: "C1019", gender: "Female", age: 27, subscriptionType: "Basic", tenure: 1, monthlyCharges: 39.0, supportTickets: 4, satisfactionScore: 2, lastLoginDays: 15, churn: "Yes" },
  { id: "C1020", gender: "Male", age: 41, subscriptionType: "Basic", tenure: 4, monthlyCharges: 45.0, supportTickets: 5, satisfactionScore: 1, lastLoginDays: 29, churn: "Yes" },

  // 2. Active subscribers (highly correlated with low support tickets, high satisfaction, and long tenure)
  { id: "C2011", gender: "Female", age: 42, subscriptionType: "Premium", tenure: 36, monthlyCharges: 115.0, supportTickets: 1, satisfactionScore: 5, lastLoginDays: 1, churn: "No" },
  { id: "C2012", gender: "Male", age: 39, subscriptionType: "Pro", tenure: 24, monthlyCharges: 75.0, supportTickets: 0, satisfactionScore: 4, lastLoginDays: 3, churn: "No" },
  { id: "C2013", gender: "Female", age: 28, subscriptionType: "Pro", tenure: 18, monthlyCharges: 80.0, supportTickets: 1, satisfactionScore: 5, lastLoginDays: 2, churn: "No" },
  { id: "C2014", gender: "Male", age: 55, subscriptionType: "Premium", tenure: 42, monthlyCharges: 119.0, supportTickets: 0, satisfactionScore: 4, lastLoginDays: 4, churn: "No" },
  { id: "C2015", gender: "Female", age: 31, subscriptionType: "Basic", tenure: 14, monthlyCharges: 39.0, supportTickets: 2, satisfactionScore: 4, lastLoginDays: 5, churn: "No" },
  { id: "C2016", gender: "Male", age: 48, subscriptionType: "Pro", tenure: 29, monthlyCharges: 85.0, supportTickets: 1, satisfactionScore: 4, lastLoginDays: 2, churn: "No" },
  { id: "C2017", gender: "Female", age: 37, subscriptionType: "Premium", tenure: 33, monthlyCharges: 125.0, supportTickets: 2, satisfactionScore: 5, lastLoginDays: 1, churn: "No" },
  { id: "C2017", gender: "Female", age: 37, subscriptionType: "Premium", tenure: 33, monthlyCharges: 125.0, supportTickets: 2, satisfactionScore: 5, lastLoginDays: 1, churn: "No" }, // DUPLICATE C2017
  { id: "C2018", gender: "Male", age: 26, subscriptionType: "Basic", tenure: 15, monthlyCharges: 39.0, supportTickets: 1, satisfactionScore: null, lastLoginDays: 4, churn: "No" }, // missing satisfaction
  { id: "C2019", gender: "Female", age: 52, subscriptionType: "Pro", tenure: 22, monthlyCharges: 79.0, supportTickets: 0, satisfactionScore: 4, lastLoginDays: 6, churn: "No" },
  { id: "C2020", gender: "Male", age: 33, subscriptionType: "Basic", tenure: 12, monthlyCharges: 45.0, supportTickets: 2, satisfactionScore: 3, lastLoginDays: 3, churn: "No" },

  // 3. Mixed / At-risk active subscribers (some warning signs, but haven't canceled yet)
  { id: "C3011", gender: "Female", age: 47, subscriptionType: "Basic", tenure: 10, monthlyCharges: 45.0, supportTickets: 3, satisfactionScore: 3, lastLoginDays: 8, churn: "No" },
  { id: "C3012", gender: "Male", age: 23, subscriptionType: "Pro", tenure: 6, monthlyCharges: 75.0, supportTickets: 4, satisfactionScore: 2, lastLoginDays: 12, churn: "No" }, // At-risk
  { id: "C3013", gender: "Female", age: 36, subscriptionType: "Premium", tenure: 14, monthlyCharges: 110.0, supportTickets: 3, satisfactionScore: 3, lastLoginDays: 9, churn: "No" }, // At-risk
  { id: "C3014", gender: "Male", age: 60, subscriptionType: "Basic", tenure: 5, monthlyCharges: 39.0, supportTickets: 4, satisfactionScore: 2, lastLoginDays: 15, churn: "No" }, // At-risk
  { id: "C3015", gender: "Female", age: 30, subscriptionType: "Basic", tenure: 9, monthlyCharges: 45.0, supportTickets: 1, satisfactionScore: 4, lastLoginDays: 4, churn: "No" },
  { id: "C3016", gender: "Male", age: 44, subscriptionType: "Pro", tenure: 11, monthlyCharges: 85.0, supportTickets: 2, satisfactionScore: 3, lastLoginDays: 7, churn: "No" },
  { id: "C3017", gender: "Female", age: 25, subscriptionType: "Pro", tenure: 7, monthlyCharges: 75.0, supportTickets: 3, satisfactionScore: 4, lastLoginDays: 3, churn: "No" },
  { id: "C3018", gender: "Male", age: -5, subscriptionType: "Basic", tenure: 8, monthlyCharges: 39.0, supportTickets: 2, satisfactionScore: 3, lastLoginDays: 11, churn: "No" }, // invalid age (-5)
  { id: "C3019", gender: "Female", age: 40, subscriptionType: "Premium", tenure: 16, monthlyCharges: 120.0, supportTickets: 4, satisfactionScore: 2, lastLoginDays: 10, churn: "No" }, // At-risk
  { id: "C3020", gender: "Male", age: 51, subscriptionType: "Basic", tenure: 15, monthlyCharges: 49.0, supportTickets: 1, satisfactionScore: 5, lastLoginDays: 2, churn: "No" },
];

// Generate extra rich entries to fill up dataset to exactly 120 customers dynamically for reliable graphs
const populateLargeData = () => {
  const result = [...initialRawCustomers];
  // Seed with random distinct IDs to achieve statistical richness
  const subTypes: ("Basic" | "Pro" | "Premium")[] = ["Basic", "Pro", "Premium"];
  const genders: ("Male" | "Female")[] = ["Male", "Female"];

  for (let i = 1; i <= 90; i++) {
    const isChurned = Math.random() < 0.28; // ~28% base churn rate
    const sub = subTypes[Math.floor(Math.random() * subTypes.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const age = Math.floor(Math.random() * 45) + 18; // 18-63

    let satisfaction: number;
    let tickets: number;
    let tenure: number;
    let loginDays: number;
    let charges: number;

    if (isChurned) {
      satisfaction = Math.floor(Math.random() * 2) + 1; // 1 or 2
      tickets = Math.floor(Math.random() * 4) + 3;      // 3 to 6
      tenure = Math.floor(Math.random() * 6) + 1;       // 1 to 6 months
      loginDays = Math.floor(Math.random() * 18) + 10;   // 10 to 28 days
    } else {
      satisfaction = Math.floor(Math.random() * 3) + 3; // 3 to 5
      tickets = Math.floor(Math.random() * 3);          // 0 to 2
      tenure = Math.floor(Math.random() * 30) + 7;      // 7 to 36 months
      loginDays = Math.floor(Math.random() * 8) + 1;     // 1 to 8 days
    }

    if (sub === "Basic") charges = 39.0 + Math.floor(Math.random() * 11);
    else if (sub === "Pro") charges = 75.0 + Math.floor(Math.random() * 15);
    else charges = 110.0 + Math.floor(Math.random() * 20);

    result.push({
      id: `C${4000 + i}`,
      gender,
      age,
      subscriptionType: sub,
      tenure,
      monthlyCharges: charges,
      supportTickets: tickets,
      satisfactionScore: satisfaction,
      lastLoginDays: loginDays,
      churn: isChurned ? "Yes" : "No",
    });
  }
  return result;
};

// Raw populated customers
export const rawCustomersAndAnomalies = populateLargeData();

// Deduplicate and impute values function
export function cleanCustomerDataset(data: any[]): {
  cleanedData: Customer[];
  duplicatesRemoved: number;
  missingValuesImputed: number;
  invalidAgesCorrected: number;
} {
  let duplicatesRemoved = 0;
  let missingValuesImputed = 0;
  let invalidAgesCorrected = 0;

  const seenIds = new Set<string>();
  const preCleaned: any[] = [];

  // 1. Remove exact duplicate customer IDs
  for (const item of data) {
    if (seenIds.has(item.id)) {
      duplicatesRemoved++;
      continue;
    }
    seenIds.add(item.id);
    preCleaned.push({ ...item });
  }

  // Calculate global statistics for imputation
  const numericAges = preCleaned.filter(x => typeof x.age === "number" && x.age > 0).map(x => x.age);
  const avgAge = numericAges.length ? Math.round(numericAges.reduce((a, b) => a + b, 0) / numericAges.length) : 38;

  const numericCharges = preCleaned.filter(x => typeof x.monthlyCharges === "number" && x.monthlyCharges > 0).map(x => x.monthlyCharges);
  const avgCharges = numericCharges.length ? Math.round(numericCharges.reduce((a, b) => a + b, 0) / numericCharges.length * 100) / 100 : 64.50;

  const numericSatisfaction = preCleaned.filter(x => typeof x.satisfactionScore === "number" && x.satisfactionScore >= 1 && x.satisfactionScore <= 5).map(x => x.satisfactionScore);
  const avgSatisfaction = numericSatisfaction.length ? Math.round(numericSatisfaction.reduce((a, b) => a + b, 0) / numericSatisfaction.length) : 4;

  const cleanedData: Customer[] = preCleaned.map(item => {
    let age = item.age;
    let charges = item.monthlyCharges;
    let satisfaction = item.satisfactionScore;

    // Correct invalid age values
    if (typeof age !== "number" || age <= 0 || age > 110) {
      age = avgAge;
      invalidAgesCorrected++;
    }

    // Handle missing/NaN values
    if (charges === null || charges === undefined || isNaN(charges) || charges < 0) {
      charges = avgCharges;
      missingValuesImputed++;
    }

    if (satisfaction === null || satisfaction === undefined || isNaN(satisfaction)) {
      satisfaction = avgSatisfaction;
      missingValuesImputed++;
    } else if (satisfaction < 1 || satisfaction > 5) {
      satisfaction = 4;
      invalidAgesCorrected++;
    }

    return {
      id: item.id,
      gender: item.gender || "Male",
      age: age,
      subscriptionType: item.subscriptionType || "Basic",
      tenure: typeof item.tenure === "number" ? Math.max(1, item.tenure) : 12,
      monthlyCharges: charges,
      supportTickets: typeof item.supportTickets === "number" ? Math.max(0, item.supportTickets) : 0,
      satisfactionScore: satisfaction,
      lastLoginDays: typeof item.lastLoginDays === "number" ? Math.max(0, item.lastLoginDays) : 3,
      churn: item.churn === "Yes" ? "Yes" : "No",
    };
  });

  return {
    cleanedData,
    duplicatesRemoved,
    missingValuesImputed,
    invalidAgesCorrected,
  };
}

// Calculate Dashboard stats
export function calculateChurnStats(customers: Customer[]): ChurnStats {
  const total = customers.length;
  if (total === 0) {
    return { totalCustomers: 0, activeCustomers: 0, churnedCustomers: 0, churnRate: 0, avgSatisfaction: 0, revenueLost: 0 };
  }

  const churnedList = customers.filter(c => c.churn === "Yes");
  const activeList = customers.filter(c => c.churn === "No");

  const totalCustomers = total;
  const churnedCustomers = churnedList.length;
  const activeCustomers = activeList.length;
  const churnRate = Math.round((churnedCustomers / total) * 1000) / 10;

  const validSatisfactions = customers.map(c => c.satisfactionScore);
  const avgSatisfaction = Math.round((validSatisfactions.reduce((a, b) => a + b, 0) / total) * 10) / 10;

  // Revenue Lost is sum of monthly charges of churned customers
  const revenueLost = Math.round(churnedList.reduce((sum, c) => sum + c.monthlyCharges, 0));

  return {
    totalCustomers,
    activeCustomers,
    churnedCustomers,
    churnRate,
    avgSatisfaction,
    revenueLost,
  };
}

// -------------------------------------------------------------
// PURE TYPESCRIPT LOGISTIC REGRESSION PREDICTIVE MODEL ENGINE
// Evaluates log-odds based on trained parameters
// -------------------------------------------------------------

export interface ModelWeights {
  bias: number;
  age: number;
  tenure: number;
  monthlyCharges: number;
  supportTickets: number;
  satisfactionScore: number;
  lastLoginDays: number;
  subscriptionBasic: number;
  subscriptionPro: number;
}

// Pre-trained or trained-on-demand coefficients
// A proper SaaS predictive customer churn model
export function trainLogisticRegression(
  customers: Customer[],
  epochs = 500,
  lr = 0.05
): { weights: ModelWeights; metrics: PredictiveMetrics } {
  // Extract features and standardize/normalize
  // Features: [age, tenure, monthlyCharges, supportTickets, satisfactionScore, lastLoginDays, basicPlan, proPlan]
  // Normalize factors (min-max to bounds [0, 1])
  const getNormParams = (vals: number[]) => {
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return { min, range: max - min || 1 };
  };

  const ageParams = getNormParams(customers.map(c => c.age));
  const tenureParams = getNormParams(customers.map(c => c.tenure));
  const chargeParams = getNormParams(customers.map(c => c.monthlyCharges));
  const ticketsParams = getNormParams(customers.map(c => c.supportTickets));
  const satisfactionParams = getNormParams(customers.map(c => c.satisfactionScore));
  const loginParams = getNormParams(customers.map(c => c.lastLoginDays));

  interface Row {
    x: number[]; // normalized [age, tenure, charges, tickets, satisfaction, logins, isBasic, isPro]
    y: number;   // 1 if churn is "Yes", else 0
  }

  const dataset: Row[] = customers.map(c => {
    return {
      x: [
        (c.age - ageParams.min) / ageParams.range,
        (c.tenure - tenureParams.min) / tenureParams.range,
        (c.monthlyCharges - chargeParams.min) / chargeParams.range,
        (c.supportTickets - ticketsParams.min) / ticketsParams.range,
        (c.satisfactionScore - satisfactionParams.min) / satisfactionParams.range,
        (c.lastLoginDays - loginParams.min) / loginParams.range,
        c.subscriptionType === "Basic" ? 1.0 : 0.0,
        c.subscriptionType === "Pro" ? 1.0 : 0.0,
      ],
      y: c.churn === "Yes" ? 1 : 0,
    };
  });

  // Weights initialization
  // Length 8: age, tenure, charges, tickets, satisfactionScore, lastLoginDays, isBasic, isPro
  let w = [0.1, -0.5, 0.2, 0.8, -0.8, 0.4, 0.3, 0.1];
  let bias = -0.1;

  // Gradient Descent training loop
  for (let step = 0; step < epochs; step++) {
    let dw = new Array(8).fill(0);
    let db = 0;

    for (let i = 0; i < dataset.length; i++) {
      const row = dataset[i];
      let z = bias;
      for (let j = 0; j < 8; j++) {
        z += row.x[j] * w[j];
      }
      const p = 1.0 / (1.0 + Math.exp(-z));
      const error = p - row.y;

      for (let j = 0; j < 8; j++) {
        dw[j] += error * row.x[j];
      }
      db += error;
    }

    // Apply updates
    const scale = lr / dataset.length;
    for (let j = 0; j < 8; j++) {
      w[j] -= dw[j] * scale;
    }
    bias -= db * scale;
  }

  // Evaluate predictions & metrics on current data
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;

  for (let i = 0; i < dataset.length; i++) {
    const row = dataset[i];
    let z = bias;
    for (let j = 0; j < 8; j++) {
      z += row.x[j] * w[j];
    }
    const p = 1.0 / (1.0 + Math.exp(-z));
    const predictedClass = p >= 0.5 ? 1 : 0;

    if (row.y === 1 && predictedClass === 1) truePositives++;
    else if (row.y === 0 && predictedClass === 1) falsePositives++;
    else if (row.y === 0 && predictedClass === 0) trueNegatives++;
    else if (row.y === 1 && predictedClass === 0) falseNegatives++;
  }

  const accuracy = (truePositives + trueNegatives) / dataset.length;
  const precision = truePositives + falsePositives > 0 ? truePositives / (truePositives + falsePositives) : 0;
  const recall = truePositives + falseNegatives > 0 ? truePositives / (truePositives + falseNegatives) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // Return formatted ModelWeights and predictive analytics
  // Standardize the weights representational magnitude for display in Feature Importances
  // Positive parameters accelerate churn risk, negative coefficients impede churn risk (retain)
  const importanceMap = [
    { feature: "Support Tickets", coef: w[3] },
    { feature: "Satisfaction Score", coef: w[4] },
    { feature: "Tenure Length", coef: w[1] },
    { feature: "Last Login Days", coef: w[5] },
    { feature: "Basic Plan", coef: w[6] },
    { feature: "Monthly Charges", coef: w[2] },
    { feature: "Age Group", coef: w[0] },
    { feature: "Pro Plan", coef: w[7] },
  ];

  // Importance scale is absolute magnitude
  const featureImportance = importanceMap
    .map(x => ({
      feature: x.feature,
      importance: Math.round(Math.abs(x.coef) * 100) / 100,
      direction: x.coef >= 0 ? "Churn Risk (+)" : "Loyalty Favor (-)",
    }))
    .sort((a, b) => b.importance - a.importance);

  const finalWeights: ModelWeights = {
    bias,
    age: w[0],
    tenure: w[1],
    monthlyCharges: w[2],
    supportTickets: w[3],
    satisfactionScore: w[4],
    lastLoginDays: w[5],
    subscriptionBasic: w[6],
    subscriptionPro: w[7],
  };

  return {
    weights: finalWeights,
    metrics: {
      accuracy: Math.round(accuracy * 1000) / 10,
      precision: Math.round(precision * 1000) / 10,
      recall: Math.round(recall * 1000) / 10,
      f1Score: Math.round(f1Score * 1000) / 10,
      featureImportance,
    },
  };
}

// Calculate individual risk probability using standard Logistic odds
export function predictCustomerChurnProbability(
  customer: Customer,
  dataset: Customer[]
): number {
  // Train model dynamically on dataset
  const { weights } = trainLogisticRegression(dataset);

  // Normalization logic
  const getMinMax = (vals: number[]) => {
    return { min: Math.min(...vals), max: Math.max(...vals) };
  };

  const ageBounds = getMinMax(dataset.map(c => c.age));
  const tenureBounds = getMinMax(dataset.map(c => c.tenure));
  const chargeBounds = getMinMax(dataset.map(c => c.monthlyCharges));
  const ticketsBounds = getMinMax(dataset.map(c => c.supportTickets));
  const satisfactionBounds = getMinMax(dataset.map(c => c.satisfactionScore));
  const loginBounds = getMinMax(dataset.map(c => c.lastLoginDays));

  const norm = (val: number, bounds: { min: number; max: number }) => {
    const range = bounds.max - bounds.min || 1;
    return (val - bounds.min) / range;
  };

  const nAge = norm(customer.age, ageBounds);
  const nTenure = norm(customer.tenure, tenureBounds);
  const nCharges = norm(customer.monthlyCharges, chargeBounds);
  const nTickets = norm(customer.supportTickets, ticketsBounds);
  const nSatisfaction = norm(customer.satisfactionScore, satisfactionBounds);
  const nLogins = norm(customer.lastLoginDays, loginBounds);

  const isBasic = customer.subscriptionType === "Basic" ? 1.0 : 0.0;
  const isPro = customer.subscriptionType === "Pro" ? 1.0 : 0.0;

  // Log odds estimation
  const z =
    weights.bias +
    nAge * weights.age +
    nTenure * weights.tenure +
    nCharges * weights.monthlyCharges +
    nTickets * weights.supportTickets +
    nSatisfaction * weights.satisfactionScore +
    nLogins * weights.lastLoginDays +
    isBasic * weights.subscriptionBasic +
    isPro * weights.subscriptionPro;

  // Sigmoid standard function
  const prob = 1.0 / (1.0 + Math.exp(-z));
  return Math.round(prob * 100);
}
