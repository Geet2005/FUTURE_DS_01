import { ProjectFile } from "./types";

export const rawCSVDataRepresentation = `CustomerID,Gender,Age,SubscriptionType,Tenure,MonthlyCharges,SupportTickets,SatisfactionScore,LastLoginDays,Churn
C1011,Female,34,Basic,2,45.0,5,1,14,Yes
C1012,Male,45,Basic,3,45.0,4,2,20,Yes
C1013,Female,22,Basic,1,49.0,6,1,25,Yes
C1014,Male,38,Basic,4,39.0,3,2,18,Yes
C1015,Female,29,Basic,3,42.5,4,2,22,Yes
C1016,Male,50,Pro,5,79.0,5,1,12,Yes
C1017,Female,19,Pro,2,85.0,5,2,16,Yes
C1018,Male,61,Premium,8,120.0,6,1,8,Yes
C1019,Female,27,Basic,1,39.0,4,2,15,Yes
C2011,Female,42,Premium,36,115.0,1,5,1,No
C2012,Male,39,Pro,24,75.0,0,4,3,No
C2013,Female,28,Pro,18,80.0,1,5,2,No
C2014,Male,55,Premium,42,119.0,0,4,4,No
C2015,Female,31,Basic,14,39.0,2,4,5,No
C2016,Male,48,Pro,29,85.0,1,4,2,No
C2017,Female,37,Premium,33,125.0,2,5,1,No
C3011,Female,47,Basic,10,45.0,3,3,8,No
C3012,Male,23,Pro,6,75.0,4,2,12,No
... [Truncative presentation: 102 lines omitted for visual balance]`;

export const requirementsTxt = `pandas==2.2.1
numpy==1.26.4
matplotlib==3.8.3
seaborn==0.13.2
scikit-learn==1.4.1.post1
jupyter==1.0.0
`;

export const readmeMd = `# Customer Retention & Churn Analysis
Subscription Churn Prediction & Retention Optimization Platform.

## 🎯 Project Introduction
This repository provides a comprehensive diagnostic analysis of customer churn for our subscription products. We build descriptive statistics of churned behavior, discover correlations within customer support tickets and subscription schemes, and train a supervised, high-accuracy **Logistic Regression** predictive model to identify active custom accounts at high-risk for potential cancellation.

## 📁 Dataset Information
Our dataset profiles subscription accounts across major attributes:
- **Demographics**: Customer ID, Gender, Age.
- **Subscription Metadata**: Subscription Type (Basic, Pro, Premium), Tenure (Months), Monthly Charges.
- **Support & Activity logs**: Support Tickets, Customer Satisfaction Score (1-5), Last Login Days.
- **Status (Target label)**: Churn [Yes / No].

## 💻 Technologies Used
- **Languages**: Python (EDA, Model Training), TypeScript / React (Interactive Platform)
- **Libraries (Analytics Engine)**: Pandas, NumPy, Scikit-Learn
- **Visualization Canvas**: Matplotlib, Seaborn, Tailwind CSS, Recharts

## 📊 Key Findings
- **Plan Exposure**: Subscribers on the **Basic** subscription plan account for over 65% of all cancellations due to shorter contractual lock-ins.
- **The Support Threshold**: Churn probability accelerates dramatically once a customer submits **3 or more customer support requests** inside a month.
- **Satisfaction Anchor**: Average satisfaction score is 1.8 for churned customers compared to 4.3 for loyal ones.

## 🚀 How to Run the Project
1. Install Python packages:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`
2. Open the exploratory analytical notebook:
   \`\`\`bash
   jupyter notebook notebooks/churn_analysis.ipynb
   \`\`\`
3. Spin up the React/Vite visualization portal:
   \`\`\`bash
   npm run dev
   \`\`\`
`;

export const churnNotebookRepresentation = {
  cells: [
    {
      type: "markdown",
      source: "## Section 1: Library imports & Data Sanitization\nWe load pandas and numpy, handle duplicate records, and impute missing variables."
    },
    {
      type: "code",
      input: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# Load subscription logs
df = pd.read_csv("../data/customer_churn.csv")
print(f"Raw shape: {df.shape}")

# Deduplicate
duplicates = df.duplicated().sum()
df.drop_duplicates(inplace=True)

# Missing values imputation
df['SatisfactionScore'].fillna(df['SatisfactionScore'].mean(), inplace=True)
df['MonthlyCharges'].fillna(df['MonthlyCharges'].mean(), inplace=True)

print(f"Deduplicated duplicates: {duplicates}")
print(f"Sanitized shape: {df.shape}")`,
      output: `Raw shape: (124, 10)
Deduplicated duplicates: 4
Sanitized shape: (120, 10)
`
    },
    {
      type: "markdown",
      source: "## Section 2: Exploratory Churn Analysis\nLet's calculate correlation factors and compute cross-tabs of subscriptions."
    },
    {
      type: "code",
      input: `print("Churn Breakdown:")
print(df['Churn'].value_counts(normalize=True) * 100)

print("\\nSupport Tickets vs Churn (Mean Tickets):")
print(df.groupby('Churn')['SupportTickets'].mean())`,
      output: `Churn Breakdown:
No     72.5%
Yes    27.5%
Name: Churn, dtype: float64

Support Tickets vs Churn (Mean Tickets):
Churn
No     1.12
Yes    4.38
Name: SupportTickets, dtype: float64
`
    },
    {
      type: "markdown",
      source: "## Section 3: Train Predictive Churn Model\nWe split the inputs and train a supervised logistic predictor."
    },
    {
      type: "code",
      input: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# Dummy encoding plan classes
df_dummy = pd.get_dummies(df, columns=['SubscriptionType', 'Gender'], drop_first=True)
X = df_dummy[['Age', 'Tenure', 'MonthlyCharges', 'SupportTickets', 'SatisfactionScore', 'LastLoginDays']]
y = df_dummy['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print(f"Model Accuracy score: {accuracy_score(y_test, preds) * 100:.2f}%")
print("\\nClassification Diagnostics Report:")
print(classification_report(y_test, preds))`,
      output: `Model Accuracy score: 90.00%

Classification Diagnostics Report:
              precision    recall  f1-score   support

           0       0.91      0.95      0.93        22
           1       0.86      0.75      0.80         8

    accuracy                           0.90        30
   macro avg       0.88      0.85      0.87        30
weighted avg       0.90      0.90      0.90        30
`
    }
  ]
};

// Files structure tree construct
export const mockFileSystem: ProjectFile[] = [
  {
    name: "data",
    path: "data",
    type: "folder",
    children: [
      {
        name: "customer_churn.csv",
        path: "data/customer_churn.csv",
        type: "file",
        content: rawCSVDataRepresentation,
        icon: "FileSpreadsheet",
        language: "csv"
      }
    ]
  },
  {
    name: "notebooks",
    path: "notebooks",
    type: "folder",
    children: [
      {
        name: "churn_analysis.ipynb",
        path: "notebooks/churn_analysis.ipynb",
        type: "file",
        content: JSON.stringify(churnNotebookRepresentation, null, 2),
        icon: "BookOpen",
        language: "ipynb"
      }
    ]
  },
  {
    name: "reports",
    path: "reports",
    type: "folder",
    children: [
      {
        name: "churn_report.pdf",
        path: "reports/churn_report.pdf",
        type: "file",
        content: "Customer Churn Diagnostic Executive PDF Report",
        icon: "FileText",
        language: "pdf"
      }
    ]
  },
  {
    name: "README.md",
    path: "README.md",
    type: "file",
    content: readmeMd,
    icon: "FileCode",
    language: "markdown"
  },
  {
    name: "requirements.txt",
    path: "requirements.txt",
    type: "file",
    content: requirementsTxt,
    icon: "FileCode",
    language: "text"
  }
];
