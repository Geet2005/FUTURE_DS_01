# FUTURE_DS_01
Task 2: Customer Retention; Churn Analysis - Analyze customer data for a subscription business. Look for patterns in why customers leave (churn) and create a retention dashboard or report.
# Customer Retention & Churn Analysis

## Overview

Customer churn is one of the most important challenges for subscription-based businesses. This project analyzes customer subscription data to identify patterns behind customer churn, understand the characteristics of customers who leave, and provide actionable recommendations to improve customer retention.

The analysis includes data cleaning, exploratory data analysis (EDA), key performance indicators (KPIs), visualizations, and business insights presented through a dashboard and report.

---

## Objectives

* Analyze customer behavior and subscription patterns.
* Calculate and monitor customer churn rate.
* Identify factors contributing to customer churn.
* Discover high-risk customer segments.
* Provide data-driven retention strategies.

---

## Dataset Features

The dataset contains customer-related information such as:

* Customer ID
* Gender
* Age
* Subscription Type
* Tenure
* Monthly Charges
* Support Tickets
* Satisfaction Score
* Last Login Days
* Churn Status (Yes/No)

---

## Technologies Used

* Python
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Plotly
* Jupyter Notebook

---

## Project Workflow

### 1. Data Cleaning

* Removed duplicate records
* Handled missing values
* Corrected data types
* Validated dataset consistency

### 2. Exploratory Data Analysis (EDA)

* Customer distribution analysis
* Churn rate calculation
* Subscription plan analysis
* Customer satisfaction analysis
* Support ticket analysis
* Revenue impact analysis

### 3. Dashboard & Visualization

The project includes interactive and static visualizations such as:

* Churn Distribution
* Churn by Subscription Type
* Churn by Age Group
* Customer Tenure Analysis
* Monthly Charges vs Churn
* Support Tickets vs Churn
* Correlation Heatmap

### 4. Business Insights

Key findings are extracted to identify:

* High-risk customer groups
* Major churn drivers
* Customer engagement patterns
* Revenue loss due to churn

### 5. Recommendations

Based on the analysis, retention strategies are proposed to reduce customer churn and improve customer satisfaction.

---

## Key Metrics

* Total Customers
* Active Customers
* Churned Customers
* Churn Rate (%)
* Average Satisfaction Score
* Revenue Lost Due to Churn

---

## Sample Insights

* Customers with lower satisfaction scores are more likely to churn.
* Basic subscription plans show higher churn rates.
* Increased support tickets correlate with customer attrition.
* New customers have a higher probability of leaving compared to long-term subscribers.

---

## Project Structure

```text
Customer-Churn-Analysis/
│
├── data/
│   └── customer_churn.csv
│
├── notebooks/
│   └── churn_analysis.ipynb
│
├── dashboard/
│   └── dashboard.png
│
├── reports/
│   └── churn_report.pdf
│
├── README.md
│
└── requirements.txt
```

---

## How to Run

1. Clone the repository:

```bash
git clone https://github.com/your-username/customer-churn-analysis.git
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Open and run:

```bash
jupyter notebook churn_analysis.ipynb
```

---

## Business Value

This project helps subscription-based businesses understand customer behavior, reduce churn, improve customer satisfaction, and increase long-term revenue through data-driven decision-making.

---

## Author

Geet George Thomas

Data Analytics & Machine Learning Enthusiast
