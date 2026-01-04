import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
  BarChart,
  ReferenceLine,
  Legend,
  Cell,
} from 'recharts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TimelineIcon from '@mui/icons-material/Timeline'
import SchoolIcon from '@mui/icons-material/School'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import CalculateIcon from '@mui/icons-material/Calculate'
import DatasetIcon from '@mui/icons-material/Dataset'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import BarChartIcon from '@mui/icons-material/BarChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SpeedIcon from '@mui/icons-material/Speed'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import CodeIcon from '@mui/icons-material/Code'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

// Modern color palette - monochromatic with accent colors for data viz
const colors = {
  primary: '#475569', // Slate 600
  secondary: '#64748b', // Slate 500
  accent: '#1e293b', // Slate 800
  success: '#10b981', // Emerald (keep for positive indicators)
  warning: '#f59e0b', // Amber (keep for warnings)
  danger: '#ef4444', // Red (keep for negative indicators)
  gridLight: 'rgba(148, 163, 184, 0.1)',
  gridDark: 'rgba(71, 85, 105, 0.3)',
}

interface RegressionResult {
  slope: number
  intercept: number
  r_squared: number
  std_error: number
  predictions: number[]
  residuals: number[]
  equation: string
}

interface Dataset {
  name: string
  description: string
  x_label: string
  y_label: string
  x: number[]
  y: number[]
}

interface DataPoint {
  x: number
  y: number
  predicted?: number
  residual?: number
}

// Custom tooltip component for modern look - memoized for performance
const CustomTooltip = memo(({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-slate-100 font-semibold text-sm mb-2">Point Data</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-slate-200 text-sm">
            <span className="text-slate-400">{entry.name}: </span>
            <span className="font-semibold font-mono">{typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
})
CustomTooltip.displayName = 'CustomTooltip'

// Custom legend component - memoized for performance
const CustomLegend = memo(({ payload }: any) => {
  return (
    <div className="flex justify-center gap-6 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
})
CustomLegend.displayName = 'CustomLegend'

// Fallback calculation for client-side
function calculateLinearRegression(xValues: number[], yValues: number[]): RegressionResult {
  const n = xValues.length
  const xMean = xValues.reduce((a, b) => a + b, 0) / n
  const yMean = yValues.reduce((a, b) => a + b, 0) / n

  let numerator = 0
  let denominator = 0
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean)
    denominator += (xValues[i] - xMean) ** 2
  }

  const slope = numerator / denominator
  const intercept = yMean - slope * xMean

  const predictions = xValues.map((x) => slope * x + intercept)
  const residuals = yValues.map((y, i) => y - predictions[i])

  const ssRes = residuals.reduce((a, r) => a + r ** 2, 0)
  const ssTot = yValues.reduce((a, y) => a + (y - yMean) ** 2, 0)
  const rSquared = 1 - ssRes / ssTot

  const stdError = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0

  return {
    slope: Math.round(slope * 10000) / 10000,
    intercept: Math.round(intercept * 10000) / 10000,
    r_squared: Math.round(rSquared * 10000) / 10000,
    std_error: Math.round(stdError * 10000) / 10000,
    predictions: predictions.map((p) => Math.round(p * 10000) / 10000),
    residuals: residuals.map((r) => Math.round(r * 10000) / 10000),
    equation: `y = ${Math.round(slope * 100) / 100}x + ${Math.round(intercept * 100) / 100}`,
  }
}

const sampleDatasets: Record<string, Dataset> = {
  housing: {
    name: 'Housing Prices',
    description: 'Square footage vs. house price',
    x_label: 'Square Footage',
    y_label: 'Price ($1000s)',
    x: [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000],
    y: [150, 180, 195, 240, 260, 295, 320, 355, 380, 410, 450],
  },
  study_hours: {
    name: 'Study Hours vs. Exam Score',
    description: 'Hours studied vs. exam performance',
    x_label: 'Hours Studied',
    y_label: 'Exam Score',
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [45, 52, 58, 65, 70, 75, 82, 88, 92, 96],
  },
  advertising: {
    name: 'Advertising Spend',
    description: 'Ad spend vs. sales revenue',
    x_label: 'Ad Spend ($1000s)',
    y_label: 'Sales ($1000s)',
    x: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    y: [25, 45, 55, 70, 85, 95, 115, 125, 140, 155],
  },
  temperature: {
    name: 'Temperature & Ice Cream',
    description: 'Temperature vs. ice cream sales',
    x_label: 'Temperature (°F)',
    y_label: 'Sales (units)',
    x: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    y: [120, 150, 200, 280, 350, 420, 500, 580, 620, 680],
  },
}

// Notebook code cells data
interface NotebookCell {
  id: string
  type: 'markdown' | 'code'
  content: string
  output?: string
}

const notebookCells: NotebookCell[] = [
  {
    id: 'imports',
    type: 'code',
    content: `# Core libraries
import numpy as np
import pandas as pd

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Machine Learning
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    mean_squared_error,
    mean_absolute_error,
    r2_score
)

# Set style for plots
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette('husl')

print('Libraries imported successfully!')`,
    output: 'Libraries imported successfully!'
  },
  {
    id: 'load-data',
    type: 'code',
    content: `# Load the Diabetes dataset (bundled with sklearn - no download required)
diabetes = load_diabetes(as_frame=True)

# Create DataFrame
df = diabetes.frame

# Display basic info
print(f"Dataset Shape: {df.shape}")
print(f"Number of samples: {df.shape[0]:,}")
print(f"Number of features: {df.shape[1] - 1}")

feature_descriptions = {
    'age': 'Age of the patient',
    'sex': 'Sex of the patient',
    'bmi': 'Body mass index',
    'bp': 'Average blood pressure',
    's1': 'TC - Total serum cholesterol',
    's2': 'LDL - Low-density lipoproteins',
    's3': 'HDL - High-density lipoproteins',
    's4': 'TCH - Total cholesterol / HDL',
    's5': 'LTG - Log of serum triglycerides',
    's6': 'GLU - Blood sugar level'
}

print("\\nFeature Descriptions:")
for feature, desc in feature_descriptions.items():
    print(f"  {feature:6} - {desc}")`,
    output: `Dataset Shape: (442, 11)
Number of samples: 442
Number of features: 10

Feature Descriptions:
  age    - Age of the patient
  sex    - Sex of the patient
  bmi    - Body mass index
  bp     - Average blood pressure
  s1     - TC - Total serum cholesterol
  s2     - LDL - Low-density lipoproteins
  s3     - HDL - High-density lipoproteins
  s4     - TCH - Total cholesterol / HDL
  s5     - LTG - Log of serum triglycerides
  s6     - GLU - Blood sugar level`
  },
  {
    id: 'preview-data',
    type: 'code',
    content: `# Display first few rows
df.head()`,
    output: `        age       sex       bmi        bp        s1        s2        s3        s4        s5        s6  target
0  0.038076  0.050680  0.061696  0.021872 -0.044223 -0.034821 -0.043401 -0.002592  0.019908 -0.017646   151.0
1 -0.001882 -0.044642 -0.051474 -0.026328 -0.008449 -0.019163  0.074412 -0.039493 -0.068330 -0.092204    75.0
2  0.085299  0.050680  0.044451 -0.005671 -0.045599 -0.034194 -0.032356 -0.002592  0.002864 -0.025930   141.0
3 -0.089063 -0.044642 -0.011595 -0.036656  0.012191  0.024991 -0.036038  0.034309  0.022692 -0.009362   206.0
4  0.005383 -0.044642 -0.036385  0.021872  0.003935  0.015596  0.008142 -0.002592 -0.031991 -0.046641   135.0`
  },
  {
    id: 'stats',
    type: 'code',
    content: `# Statistical summary
df.describe().round(3)`,
    output: `          age      sex      bmi       bp       s1       s2       s3       s4       s5       s6   target
count  442.000  442.000  442.000  442.000  442.000  442.000  442.000  442.000  442.000  442.000  442.000
mean    -0.000   -0.000    0.000   -0.000    0.000    0.000   -0.000    0.000   -0.000   -0.000  152.133
std      0.048    0.048    0.048    0.048    0.048    0.048    0.048    0.048    0.048    0.048   77.093
min     -0.107   -0.045   -0.090   -0.112   -0.127   -0.116   -0.102   -0.076   -0.126   -0.138   25.000
25%     -0.037   -0.045   -0.034   -0.037   -0.034   -0.030   -0.035   -0.039   -0.033   -0.033   87.000
50%      0.005   -0.045   -0.007   -0.006   -0.004   -0.004   -0.007   -0.003   -0.002   -0.001  140.500
75%      0.038    0.051    0.031    0.036    0.028    0.030    0.029    0.034    0.032    0.028  211.500
max      0.111    0.051    0.171    0.132    0.154    0.199    0.181    0.185    0.134    0.136  346.000`
  },
  {
    id: 'split-data',
    type: 'code',
    content: `# Separate features and target
X = df.drop('target', axis=1)
y = df['target']

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

print(f"Features shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"\\nTraining set: {X_train.shape[0]:,} samples (80%)")
print(f"Test set: {X_test.shape[0]:,} samples (20%)")`,
    output: `Features shape: (442, 10)
Target shape: (442,)

Training set: 353 samples (80%)
Test set: 89 samples (20%)`
  },
  {
    id: 'scale-data',
    type: 'code',
    content: `# Scale features (important for interpretation)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("Feature Scaling Applied (StandardScaler):")
print("  - Mean of each feature: 0")
print("  - Standard deviation of each feature: 1")`,
    output: `Feature Scaling Applied (StandardScaler):
  - Mean of each feature: 0
  - Standard deviation of each feature: 1`
  },
  {
    id: 'train-model',
    type: 'code',
    content: `# Create and train the model
model = LinearRegression()

# Train on scaled features
model.fit(X_train_scaled, y_train)

print("Model Training Complete!")
print("="*50)
print(f"\\nModel Intercept (bias term): {model.intercept_:.2f}")
print("  This is the predicted disease progression")
print("  when all features are at their mean.")`,
    output: `Model Training Complete!
==================================================

Model Intercept (bias term): 151.35
  This is the predicted disease progression
  when all features are at their mean.`
  },
  {
    id: 'coefficients',
    type: 'code',
    content: `# Display coefficients (feature importance)
coefficients = pd.DataFrame({
    'Feature': X_train.columns,
    'Coefficient': model.coef_,
    'Abs_Coefficient': np.abs(model.coef_)
}).sort_values('Abs_Coefficient', ascending=False)

print("Model Coefficients (Feature Importance):")
print("-" * 50)
print("\\nFor each 1 std dev increase in the feature,")
print("the disease progression changes by this amount:")
print()

for _, row in coefficients.iterrows():
    print(f"  {row['Feature']:6}: {row['Coefficient']:+.2f}")`,
    output: `Model Coefficients (Feature Importance):
--------------------------------------------------

For each 1 std dev increase in the feature,
the disease progression changes by this amount:

  s5    : +25.80
  bmi   : +23.16
  bp    : +14.31
  s1    : -12.41
  s4    : +7.52
  s6    : +4.89
  s3    : -4.01
  age   : +2.34
  s2    : -1.93
  sex   : -1.08`
  },
  {
    id: 'evaluate',
    type: 'code',
    content: `# Make predictions
y_train_pred = model.predict(X_train_scaled)
y_test_pred = model.predict(X_test_scaled)

# Calculate metrics
r2_test = r2_score(y_test, y_test_pred)
rmse_test = np.sqrt(mean_squared_error(y_test, y_test_pred))
mae_test = mean_absolute_error(y_test, y_test_pred)

print("Model Performance Metrics (Test Set):")
print("=" * 50)
print(f"\\n  R-squared (R2):  {r2_test:.4f}")
print(f"    -> Model explains {r2_test*100:.1f}% of variance")
print(f"\\n  RMSE: {rmse_test:.2f}")
print(f"    -> Typical prediction error")
print(f"\\n  MAE:  {mae_test:.2f}")
print(f"    -> Average absolute error")`,
    output: `Model Performance Metrics (Test Set):
==================================================

  R-squared (R2):  0.4526
    -> Model explains 45.3% of variance

  RMSE: 53.85
    -> Typical prediction error

  MAE:  44.28
    -> Average absolute error`
  },
  {
    id: 'predictions',
    type: 'code',
    content: `# Example: Predict disease progression for hypothetical patients
example_patients = pd.DataFrame({
    'age': [0.05, -0.04, 0.08],
    'sex': [0.05, -0.04, 0.05],
    'bmi': [0.06, -0.03, 0.10],
    'bp': [0.02, -0.01, 0.05],
    's1': [0.01, -0.02, 0.03],
    's2': [0.02, -0.03, 0.04],
    's3': [-0.01, 0.03, -0.02],
    's4': [0.01, -0.02, 0.03],
    's5': [0.03, -0.02, 0.05],
    's6': [0.02, -0.01, 0.04]
}, index=['Average Patient', 'Healthy Patient', 'At-Risk Patient'])

# Scale and predict
example_scaled = scaler.transform(example_patients)
predictions = model.predict(example_scaled)

print("Disease Progression Predictions:")
print("=" * 60)
for i, (name, pred) in enumerate(zip(example_patients.index, predictions)):
    print(f"\\n{name}:")
    print(f"  BMI={example_patients.iloc[i]['bmi']:.2f}, "
          f"BP={example_patients.iloc[i]['bp']:.2f}, "
          f"s5={example_patients.iloc[i]['s5']:.2f}")
    print(f"  Predicted Disease Progression: {pred:.1f}")`,
    output: `Disease Progression Predictions:
============================================================

Average Patient:
  BMI=0.06, BP=0.02, s5=0.03
  Predicted Disease Progression: 175.2

Healthy Patient:
  BMI=-0.03, BP=-0.01, s5=-0.02
  Predicted Disease Progression: 128.4

At-Risk Patient:
  BMI=0.10, BP=0.05, s5=0.05
  Predicted Disease Progression: 198.7`
  },
  {
    id: 'summary',
    type: 'code',
    content: `# Final summary
print("\\n" + "="*60)
print("          LINEAR REGRESSION MODEL SUMMARY")
print("="*60)
print(f"\\n  Dataset: Diabetes")
print(f"  Samples: {len(df):,}")
print(f"  Features: {X.shape[1]}")
print(f"\\n  Test R2: {r2_test:.4f}")
print(f"  Test RMSE: {rmse_test:.2f}")
print(f"  Test MAE: {mae_test:.2f}")
print(f"\\n  Top 3 Most Important Features:")
print(f"    1. s5 (Log triglycerides): +25.80")
print(f"    2. bmi (Body Mass Index): +23.16")
print(f"    3. bp (Blood Pressure): +14.31")
print("\\n" + "="*60)`,
    output: `
============================================================
          LINEAR REGRESSION MODEL SUMMARY
============================================================

  Dataset: Diabetes
  Samples: 442
  Features: 10

  Test R2: 0.4526
  Test RMSE: 53.85
  Test MAE: 44.28

  Top 3 Most Important Features:
    1. s5 (Log triglycerides): +25.80
    2. bmi (Body Mass Index): +23.16
    3. bp (Blood Pressure): +14.31

============================================================`
  }
]

// Code cell component
const CodeCell = memo(({ cell, isExpanded, onToggle }: { cell: NotebookCell; isExpanded: boolean; onToggle: () => void }) => {
  const [copied, setCopied] = useState(false)

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(cell.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [cell.content])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Cell header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
            Python
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <CheckIcon sx={{ fontSize: 16 }} className="text-green-500" />
            ) : (
              <ContentCopyIcon sx={{ fontSize: 16 }} className="text-slate-400" />
            )}
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ExpandLessIcon sx={{ fontSize: 18 }} className="text-slate-400" />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 18 }} className="text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-32 overflow-hidden'}`}>
        <pre className="p-4 text-sm font-mono overflow-x-auto bg-slate-950 text-slate-100">
          <code>{cell.content}</code>
        </pre>
      </div>

      {/* Output */}
      {cell.output && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Output</span>
          </div>
          <pre className="p-4 text-sm font-mono overflow-x-auto bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {cell.output}
          </pre>
        </div>
      )}
    </div>
  )
})
CodeCell.displayName = 'CodeCell'

// Notebook section component
const NotebookSection = memo(() => {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set(['imports', 'train-model', 'evaluate']))

  const toggleCell = useCallback((id: string) => {
    setExpandedCells(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setExpandedCells(new Set(notebookCells.map(c => c.id)))
  }, [])

  const collapseAll = useCallback(() => {
    setExpandedCells(new Set())
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Diabetes Disease Progression Prediction</h2>
            <p className="text-slate-300">
              A complete linear regression workflow using scikit-learn on real-world medical data.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Dataset', value: 'Diabetes' },
            { label: 'Samples', value: '442' },
            { label: 'R-squared', value: '0.453' },
            { label: 'RMSE', value: '53.85' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-white font-semibold font-mono">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notebook Steps */}
      <div className="space-y-6">
        {/* Step 1: Import Libraries */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
            Import Libraries
          </h3>
          <CodeCell
            cell={notebookCells[0]}
            isExpanded={expandedCells.has(notebookCells[0].id)}
            onToggle={() => toggleCell(notebookCells[0].id)}
          />
        </div>

        {/* Step 2: Load Data */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
            Load and Explore Data
          </h3>
          <div className="space-y-4">
            {notebookCells.slice(1, 4).map(cell => (
              <CodeCell
                key={cell.id}
                cell={cell}
                isExpanded={expandedCells.has(cell.id)}
                onToggle={() => toggleCell(cell.id)}
              />
            ))}
          </div>
        </div>

        {/* Step 3: Preprocess */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
            Data Preprocessing
          </h3>
          <div className="space-y-4">
            {notebookCells.slice(4, 6).map(cell => (
              <CodeCell
                key={cell.id}
                cell={cell}
                isExpanded={expandedCells.has(cell.id)}
                onToggle={() => toggleCell(cell.id)}
              />
            ))}
          </div>
        </div>

        {/* Step 4: Train Model */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
            Train the Model
          </h3>
          <div className="space-y-4">
            {notebookCells.slice(6, 8).map(cell => (
              <CodeCell
                key={cell.id}
                cell={cell}
                isExpanded={expandedCells.has(cell.id)}
                onToggle={() => toggleCell(cell.id)}
              />
            ))}
          </div>
        </div>

        {/* Step 5: Evaluate */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
            Model Evaluation
          </h3>
          <CodeCell
            cell={notebookCells[8]}
            isExpanded={expandedCells.has(notebookCells[8].id)}
            onToggle={() => toggleCell(notebookCells[8].id)}
          />
        </div>

        {/* Step 6: Predictions */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center text-sm font-bold">6</span>
            Make Predictions
          </h3>
          <div className="space-y-4">
            {notebookCells.slice(9, 11).map(cell => (
              <CodeCell
                key={cell.id}
                cell={cell}
                isExpanded={expandedCells.has(cell.id)}
                onToggle={() => toggleCell(cell.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChartIcon sx={{ fontSize: 24 }} />
          Model Visualizations
        </h3>

        {/* Feature Coefficients Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Feature Coefficients (Importance)</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            Shows how much the disease progression changes for each 1 standard deviation increase in a feature.
            Positive values (green) increase progression, negative values (red) decrease it.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { feature: 's5', coefficient: 25.8, fill: colors.success },
                  { feature: 'bmi', coefficient: 23.2, fill: colors.success },
                  { feature: 'bp', coefficient: 14.3, fill: colors.success },
                  { feature: 's4', coefficient: 7.5, fill: colors.success },
                  { feature: 's6', coefficient: 4.9, fill: colors.success },
                  { feature: 'age', coefficient: 2.3, fill: colors.success },
                  { feature: 'sex', coefficient: -1.1, fill: colors.danger },
                  { feature: 's2', coefficient: -1.9, fill: colors.danger },
                  { feature: 's3', coefficient: -4.0, fill: colors.danger },
                  { feature: 's1', coefficient: -12.4, fill: colors.danger },
                ]}
                layout="vertical"
                margin={{ top: 20, right: 40, left: 60, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gridDark} horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                  tickLine={{ stroke: '#94a3b8' }}
                  axisLine={{ stroke: '#94a3b8' }}
                  tickFormatter={(value) => value.toFixed(1)}
                  label={{
                    value: 'Coefficient Value',
                    position: 'bottom',
                    offset: 15,
                    fill: '#475569',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  dataKey="feature"
                  type="category"
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 500, fontFamily: 'system-ui' }}
                  tickLine={false}
                  axisLine={{ stroke: '#94a3b8' }}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{value}</span>}
                />
                <ReferenceLine x={0} stroke={colors.primary} strokeWidth={2} />
                <Bar dataKey="coefficient" name="Coefficient" radius={[0, 4, 4, 0]}>
                  {[
                    { feature: 's5', coefficient: 25.8 },
                    { feature: 'bmi', coefficient: 23.2 },
                    { feature: 'bp', coefficient: 14.3 },
                    { feature: 's4', coefficient: 7.5 },
                    { feature: 's6', coefficient: 4.9 },
                    { feature: 'age', coefficient: 2.3 },
                    { feature: 'sex', coefficient: -1.1 },
                    { feature: 's2', coefficient: -1.9 },
                    { feature: 's3', coefficient: -4.0 },
                    { feature: 's1', coefficient: -12.4 },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.coefficient >= 0 ? colors.success : colors.danger} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actual vs Predicted Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Actual vs Predicted Values</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            Compares actual disease progression values against model predictions.
            Points closer to the diagonal line indicate better predictions.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={[
                  { actual: 75, predicted: 128, residual: -53 },
                  { actual: 141, predicted: 158, residual: -17 },
                  { actual: 206, predicted: 175, residual: 31 },
                  { actual: 135, predicted: 148, residual: -13 },
                  { actual: 97, predicted: 132, residual: -35 },
                  { actual: 138, predicted: 155, residual: -17 },
                  { actual: 63, predicted: 95, residual: -32 },
                  { actual: 110, predicted: 142, residual: -32 },
                  { actual: 310, predicted: 245, residual: 65 },
                  { actual: 101, predicted: 138, residual: -37 },
                  { actual: 69, predicted: 108, residual: -39 },
                  { actual: 179, predicted: 162, residual: 17 },
                  { actual: 185, predicted: 195, residual: -10 },
                  { actual: 118, predicted: 125, residual: -7 },
                  { actual: 257, predicted: 210, residual: 47 },
                  { actual: 84, predicted: 115, residual: -31 },
                  { actual: 219, predicted: 188, residual: 31 },
                  { actual: 202, predicted: 175, residual: 27 },
                  { actual: 52, predicted: 98, residual: -46 },
                  { actual: 281, predicted: 225, residual: 56 },
                ]}
                margin={{ top: 20, right: 40, left: 70, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gridDark} />
                <XAxis
                  dataKey="actual"
                  type="number"
                  domain={[0, 350]}
                  tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                  tickLine={{ stroke: '#94a3b8' }}
                  axisLine={{ stroke: '#94a3b8' }}
                  tickFormatter={(value) => value.toFixed(0)}
                  label={{
                    value: 'Actual Disease Progression',
                    position: 'bottom',
                    offset: 40,
                    fill: '#475569',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  dataKey="predicted"
                  type="number"
                  domain={[0, 350]}
                  tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                  tickLine={{ stroke: '#94a3b8' }}
                  axisLine={{ stroke: '#94a3b8' }}
                  tickFormatter={(value) => value.toFixed(0)}
                  label={{
                    value: 'Predicted Progression',
                    angle: -90,
                    position: 'insideLeft',
                    offset: -10,
                    fill: '#475569',
                    fontSize: 13,
                    fontWeight: 500,
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{value}</span>}
                />
                <Line
                  type="linear"
                  dataKey="actual"
                  data={[{ actual: 0, predicted: 0 }, { actual: 350, predicted: 350 }]}
                  stroke={colors.danger}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  name="Perfect Prediction"
                />
                <Scatter
                  dataKey="predicted"
                  fill={colors.primary}
                  name="Predictions"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Residuals Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Residuals Distribution</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            Distribution of prediction errors (residuals = actual - predicted).
            A good model should have residuals centered around zero with a normal distribution.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { range: '-80 to -60', count: 2 },
                  { range: '-60 to -40', count: 5 },
                  { range: '-40 to -20', count: 12 },
                  { range: '-20 to 0', count: 25 },
                  { range: '0 to 20', count: 22 },
                  { range: '20 to 40', count: 14 },
                  { range: '40 to 60', count: 6 },
                  { range: '60 to 80', count: 3 },
                ]}
                margin={{ top: 20, right: 40, left: 70, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gridDark} vertical={false} />
                <XAxis
                  dataKey="range"
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'system-ui' }}
                  tickLine={{ stroke: '#94a3b8' }}
                  axisLine={{ stroke: '#94a3b8' }}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                  label={{
                    value: 'Residual Range',
                    position: 'bottom',
                    offset: 45,
                    fill: '#475569',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                  tickLine={{ stroke: '#94a3b8' }}
                  axisLine={{ stroke: '#94a3b8' }}
                  label={{
                    value: 'Frequency',
                    angle: -90,
                    position: 'insideLeft',
                    offset: -10,
                    fill: '#475569',
                    fontSize: 13,
                    fontWeight: 500,
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{value}</span>}
                />
                <ReferenceLine x="0 to 20" stroke={colors.success} strokeWidth={2} strokeDasharray="4 4" />
                <Bar dataKey="count" name="Frequency" fill={colors.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Insights Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Most Important Features</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">1.</span>
                <span><strong>s5 (Log triglycerides)</strong> - Strongest predictor (+25.80/std)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">2.</span>
                <span><strong>BMI</strong> - Body mass index strongly predicts progression (+23.16/std)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">3.</span>
                <span><strong>Blood Pressure</strong> - Higher BP correlates with progression (+14.31/std)</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Model Limitations</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">!</span>
                <span>R-squared of 0.45 means 55% of variance is unexplained</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">!</span>
                <span>Linear model cannot capture non-linear biological relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">!</span>
                <span>Small dataset (442 samples) limits generalization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Download notebook CTA */}
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Want to run this yourself?</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Download the complete Jupyter notebook and experiment with the code.
          </p>
        </div>
        <a
          href="/notebooks/linear_regression_diabetes.ipynb"
          download
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2"
        >
          <CodeIcon sx={{ fontSize: 20 }} />
          Download Notebook
        </a>
      </div>
    </motion.div>
  )
})
NotebookSection.displayName = 'NotebookSection'

export default function LinearRegressionDemo() {
  const [selectedDataset, setSelectedDataset] = useState<string>('housing')
  const [result, setResult] = useState<RegressionResult | null>(null)
  const [customPoints, setCustomPoints] = useState<DataPoint[]>([])
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('intro')
  const chartRef = useRef<any>(null)

  const currentDataset = sampleDatasets[selectedDataset]

  // Custom mode bounds
  const customBounds = { xMin: 0, xMax: 100, yMin: 0, yMax: 100 }

  // Serialize custom points for stable dependency
  const customPointsKey = useMemo(() =>
    JSON.stringify(customPoints.map(p => [p.x, p.y])),
    [customPoints]
  )

  // Calculate regression when dataset changes
  useEffect(() => {
    if (!isCustomMode && currentDataset) {
      const calcResult = calculateLinearRegression(currentDataset.x, currentDataset.y)
      setResult(calcResult)
    }
  }, [selectedDataset, isCustomMode, currentDataset])

  // Calculate regression for custom points
  useEffect(() => {
    if (isCustomMode && customPoints.length >= 2) {
      const xValues = customPoints.map((p) => p.x)
      const yValues = customPoints.map((p) => p.y)
      const calcResult = calculateLinearRegression(xValues, yValues)
      setResult(calcResult)
    } else if (isCustomMode && customPoints.length < 2) {
      setResult(null)
    }
  }, [customPointsKey, isCustomMode])

  // Prepare chart data
  const chartData: DataPoint[] = useMemo(() => {
    if (isCustomMode) {
      return customPoints.map((p, i) => ({
        ...p,
        predicted: result?.predictions[i],
        residual: result?.residuals[i],
      }))
    }
    return currentDataset.x.map((x, i) => ({
      x,
      y: currentDataset.y[i],
      predicted: result?.predictions[i],
      residual: result?.residuals[i],
    }))
  }, [isCustomMode, customPoints, currentDataset, result])

  // Line data for regression line - extend beyond data points
  const lineData = useMemo(() => {
    if (!result) return []
    const xValues = isCustomMode ? customPoints.map((p) => p.x) : currentDataset.x
    if (xValues.length === 0) return []

    const minX = isCustomMode ? customBounds.xMin : Math.min(...xValues) - 50
    const maxX = isCustomMode ? customBounds.xMax : Math.max(...xValues) + 50

    // Create multiple points for smooth line
    const points = []
    const step = (maxX - minX) / 20
    for (let x = minX; x <= maxX; x += step) {
      points.push({ x, y: result.slope * x + result.intercept })
    }
    return points
  }, [result, isCustomMode, customPoints, currentDataset, customBounds])

  // Handle click on chart area to add custom point
  const handleChartClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCustomMode) return

    const chartWrapper = e.currentTarget
    const rect = chartWrapper.getBoundingClientRect()

    // Chart margins (must match the chart's margin prop)
    const margin = { top: 20, right: 40, bottom: 60, left: 70 }

    // Calculate click position relative to chart area
    const clickX = e.clientX - rect.left - margin.left
    const clickY = e.clientY - rect.top - margin.top

    // Chart dimensions (excluding margins)
    const chartWidth = rect.width - margin.left - margin.right
    const chartHeight = rect.height - margin.top - margin.bottom

    // Check if click is within chart area
    if (clickX < 0 || clickX > chartWidth || clickY < 0 || clickY > chartHeight) return

    // Convert pixel position to data values
    const xValue = customBounds.xMin + (clickX / chartWidth) * (customBounds.xMax - customBounds.xMin)
    const yValue = customBounds.yMax - (clickY / chartHeight) * (customBounds.yMax - customBounds.yMin)

    const newPoint: DataPoint = {
      x: Math.round(xValue * 10) / 10,
      y: Math.round(yValue * 10) / 10,
    }

    setCustomPoints(prev => [...prev, newPoint])
  }, [isCustomMode, customBounds])

  const clearCustomPoints = () => {
    setCustomPoints([])
    setResult(null)
  }

  const removeLastPoint = () => {
    setCustomPoints(prev => prev.slice(0, -1))
  }

  const sections = [
    { id: 'intro', label: 'Introduction', icon: SchoolIcon },
    { id: 'math', label: 'The Math', icon: CalculateIcon },
    { id: 'interactive', label: 'Interactive Demo', icon: TouchAppIcon },
    { id: 'notebook', label: 'Python Code', icon: CodeIcon },
    { id: 'usecases', label: 'Use Cases', icon: TipsAndUpdatesIcon },
  ]

  return (
    <section className="min-h-screen pt-32 pb-24 bg-white/80 dark:bg-slate-950/80 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors group"
          >
            <ArrowBackIcon className="group-hover:-translate-x-1 transition-transform" sx={{ fontSize: 20 }} />
            Back to Projects
          </Link>

          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 mb-6"
            >
              <TimelineIcon sx={{ fontSize: 18 }} />
              Machine Learning Tutorial
            </motion.span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              Linear <span className="gradient-text">Regression</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive, interactive guide to understanding one of the most fundamental algorithms in machine learning and statistics.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${activeSection === section.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  <Icon sx={{ fontSize: 18 }} />
                  {section.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Introduction Section */}
        {activeSection === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What is Linear Regression?</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                  Linear regression is a <strong className="text-slate-900 dark:text-white">supervised learning algorithm</strong> that models the relationship between a dependent variable (y) and one or more independent variables (x) by fitting a linear equation to the observed data.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Think of it as drawing the "best fit" straight line through a scatter plot of data points. This line can then be used to make predictions about new data.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-slate-900">
                      <BarChartIcon sx={{ fontSize: 24 }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Descriptive</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Understand the relationship between variables and quantify how they change together.
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-slate-900">
                      <TrendingUpIcon sx={{ fontSize: 24 }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Predictive</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Forecast future outcomes based on historical data patterns.
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-slate-900">
                      <SpeedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Interpretable</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Easy to understand and explain—coefficients have clear, intuitive meanings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Example */}
            <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Visual Example</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                The relationship between square footage and house prices. Data points show actual observations; the trend line shows the predicted relationship.
              </p>
              <div className="h-80 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 40, bottom: 60, left: 70 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={colors.danger} />
                        <stop offset="100%" stopColor={colors.warning} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148, 163, 184, 0.2)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['dataMin - 100', 'dataMax + 100']}
                      tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                      tickLine={{ stroke: '#94a3b8' }}
                      axisLine={{ stroke: '#94a3b8' }}
                      tickFormatter={(value) => Number(value).toFixed(0)}
                      label={{
                        value: currentDataset.x_label,
                        position: 'bottom',
                        offset: 40,
                        fill: '#475569',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      type="number"
                      domain={['dataMin - 20', 'dataMax + 20']}
                      tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                      tickLine={{ stroke: '#94a3b8' }}
                      axisLine={{ stroke: '#94a3b8' }}
                      tickFormatter={(value) => Number(value).toFixed(0)}
                      label={{
                        value: currentDataset.y_label,
                        angle: -90,
                        position: 'insideLeft',
                        offset: -10,
                        fill: '#475569',
                        fontSize: 13,
                        fontWeight: 600,
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 10 }}
                      formatter={(value) => <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{value}</span>}
                    />
                    <Scatter
                      name="Data Points"
                      dataKey="y"
                      fill={colors.primary}
                      stroke="#fff"
                      strokeWidth={2}
                      r={8}
                    />
                    <Line
                      data={lineData}
                      type="monotone"
                      dataKey="y"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={false}
                      name="Trend Line"
                      filter="url(#glow)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              {result && (
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-xl px-5 py-3 border border-indigo-200 dark:border-indigo-800">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Equation: </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{result.equation}</span>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-xl px-5 py-3 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">R² Score: </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{result.r_squared}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Math Section */}
        {activeSection === 'math' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">The Linear Equation</h2>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-8 text-center mb-8 border border-indigo-100 dark:border-indigo-800">
                <p className="text-3xl md:text-4xl font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  y = mx + b
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-4">or equivalently</p>
                <p className="text-3xl md:text-4xl font-mono text-purple-600 dark:text-purple-400 font-bold mt-2">
                  y = β₀ + β₁x
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-100 dark:border-cyan-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="font-mono text-lg text-cyan-600 dark:text-cyan-400">m</span> or <span className="font-mono text-lg text-cyan-600 dark:text-cyan-400">β₁</span> — Slope
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    The slope tells you how much y changes for every one-unit increase in x. A positive slope means y increases as x increases; a negative slope means y decreases.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="font-mono text-lg text-amber-600 dark:text-amber-400">b</span> or <span className="font-mono text-lg text-amber-600 dark:text-amber-400">β₀</span> — Intercept
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    The y-intercept is the value of y when x equals zero. It's where the regression line crosses the y-axis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How It's Calculated</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Linear regression uses the <strong className="text-indigo-600 dark:text-indigo-400">Ordinary Least Squares (OLS)</strong> method to find the line that minimizes the sum of squared residuals (errors).
              </p>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-6 border-l-4 border-indigo-500">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</span>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Calculate Means</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-lg pl-11">
                    x̄ = Σx / n &nbsp;&nbsp;&nbsp; ȳ = Σy / n
                  </p>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-6 border-l-4 border-purple-500">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</span>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Calculate Slope</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-lg pl-11">
                    m = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²
                  </p>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-6 border-l-4 border-cyan-500">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">3</span>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Calculate Intercept</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-lg pl-11">
                    b = ȳ - m × x̄
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">R² — Coefficient of Determination</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                R² measures how well the regression line fits the data. It represents the proportion of variance in the dependent variable that's predictable from the independent variable.
              </p>

              <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 font-mono text-center text-xl font-bold">
                  R² = 1 - (SS<sub>res</sub> / SS<sub>tot</sub>)
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-5 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border border-red-100 dark:border-red-800">
                  <p className="text-3xl font-bold text-red-500">0.0 - 0.3</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Weak fit</p>
                  <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-2 mt-3">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                  <p className="text-3xl font-bold text-amber-500">0.3 - 0.7</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Moderate fit</p>
                  <div className="w-full bg-amber-200 dark:bg-amber-800/30 rounded-full h-2 mt-3">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <p className="text-3xl font-bold text-emerald-500">0.7 - 1.0</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Strong fit</p>
                  <div className="w-full bg-emerald-200 dark:bg-emerald-800/30 rounded-full h-2 mt-3">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interactive Demo Section */}
        {activeSection === 'interactive' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interactive Playground</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsCustomMode(false)
                      clearCustomPoints()
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${!isCustomMode
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    <DatasetIcon sx={{ fontSize: 18 }} />
                    Sample Data
                  </button>
                  <button
                    onClick={() => setIsCustomMode(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isCustomMode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    <TouchAppIcon sx={{ fontSize: 18 }} />
                    Draw Points
                  </button>
                </div>
              </div>

              {!isCustomMode && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(sampleDatasets).map(([key, dataset]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDataset(key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedDataset === key
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600'
                        }`}
                    >
                      {dataset.name}
                    </button>
                  ))}
                </div>
              )}

              {isCustomMode && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border border-cyan-200 dark:border-cyan-800">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <TouchAppIcon className="text-cyan-500" sx={{ fontSize: 20 }} />
                    <span>Click anywhere on the chart to add points.</span>
                    <span className="text-slate-500 dark:text-slate-400">({customPoints.length} points)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={removeLastPoint}
                      disabled={customPoints.length === 0}
                      className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Undo Last
                    </button>
                    <button
                      onClick={clearCustomPoints}
                      className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`h-[450px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-2 ${isCustomMode ? 'cursor-crosshair' : ''}`}
                onClick={handleChartClick}
                ref={chartRef}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 40, bottom: 60, left: 70 }}
                  >
                    <defs>
                      <linearGradient id="lineGradientInteractive" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={colors.danger} />
                        <stop offset="100%" stopColor={colors.warning} />
                      </linearGradient>
                      <linearGradient id="pointGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor={colors.secondary} />
                      </linearGradient>
                      <filter id="glowInteractive">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148, 163, 184, 0.2)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={isCustomMode ? [customBounds.xMin, customBounds.xMax] : ['dataMin - 100', 'dataMax + 100']}
                      tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                      tickLine={{ stroke: '#94a3b8' }}
                      axisLine={{ stroke: '#94a3b8' }}
                      tickFormatter={(value) => Number(value).toFixed(1)}
                      label={{
                        value: isCustomMode ? 'X Value' : currentDataset.x_label,
                        position: 'bottom',
                        offset: 40,
                        fill: '#475569',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      type="number"
                      domain={isCustomMode ? [customBounds.yMin, customBounds.yMax] : ['dataMin - 20', 'dataMax + 20']}
                      tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                      tickLine={{ stroke: '#94a3b8' }}
                      axisLine={{ stroke: '#94a3b8' }}
                      tickFormatter={(value) => Number(value).toFixed(1)}
                      label={{
                        value: isCustomMode ? 'Y Value' : currentDataset.y_label,
                        angle: -90,
                        position: 'insideLeft',
                        offset: -10,
                        fill: '#475569',
                        fontSize: 13,
                        fontWeight: 600,
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 10 }}
                      formatter={(value) => <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{value}</span>}
                      iconType="circle"
                      payload={[
                        { value: 'Data Points', type: 'circle', color: colors.primary },
                        ...(result && lineData.length > 0 ? [{ value: 'Regression Line', type: 'line' as const, color: colors.danger }] : [])
                      ]}
                    />
                    <Scatter
                      name="Data Points"
                      dataKey="y"
                      fill="url(#pointGradient)"
                      stroke="#fff"
                      strokeWidth={2}
                      r={isCustomMode ? 10 : 8}
                    />
                    {result && lineData.length > 0 && (
                      <Line
                        data={lineData}
                        type="monotone"
                        dataKey="y"
                        stroke="url(#lineGradientInteractive)"
                        strokeWidth={3}
                        dot={false}
                        name="Regression Line"
                        filter="url(#glowInteractive)"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Results Panel */}
              {result && (
                <div className="mt-8 grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 text-center border border-indigo-100 dark:border-indigo-800">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Equation</p>
                    <p className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">{result.equation}</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-5 text-center border border-cyan-100 dark:border-cyan-800">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Slope (m)</p>
                    <p className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400">{result.slope}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 text-center border border-amber-100 dark:border-amber-800">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Intercept (b)</p>
                    <p className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">{result.intercept}</p>
                  </div>
                  <div className={`rounded-xl p-5 text-center border ${result.r_squared >= 0.7
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-100 dark:border-emerald-800'
                    : result.r_squared >= 0.3
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800'
                    }`}>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">R² Score</p>
                    <p className={`text-lg font-mono font-bold ${result.r_squared >= 0.7 ? 'text-emerald-600 dark:text-emerald-400' :
                      result.r_squared >= 0.3 ? 'text-amber-600 dark:text-amber-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                      {result.r_squared}
                    </p>
                  </div>
                </div>
              )}

              {isCustomMode && customPoints.length < 2 && (
                <div className="mt-6 text-center text-slate-500 dark:text-slate-400">
                  Add at least <span className="font-semibold text-cyan-600 dark:text-cyan-400">2 points</span> to see the regression line
                </div>
              )}
            </div>

            {/* Residuals Chart */}
            {result && chartData.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Residuals Analysis</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Residuals show the difference between actual and predicted values. Ideally, they should be randomly scattered around zero.
                </p>
                <div className="h-72 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.map((d, i) => ({
                        index: i + 1,
                        residual: d.residual,
                        isPositive: (d.residual || 0) >= 0
                      }))}
                      margin={{ top: 20, right: 40, bottom: 60, left: 70 }}
                    >
                      <defs>
                        <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={colors.success} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={colors.success} stopOpacity={0.4} />
                        </linearGradient>
                        <linearGradient id="negativeGradient" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor={colors.danger} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={colors.danger} stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                      <XAxis
                        dataKey="index"
                        tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                        tickLine={{ stroke: '#94a3b8' }}
                        axisLine={{ stroke: '#94a3b8' }}
                        label={{
                          value: 'Data Point Index',
                          position: 'bottom',
                          offset: 40,
                          fill: '#475569',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      />
                      <YAxis
                        tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'system-ui' }}
                        tickLine={{ stroke: '#94a3b8' }}
                        axisLine={{ stroke: '#94a3b8' }}
                        tickFormatter={(value) => Number(value).toFixed(1)}
                        label={{
                          value: 'Residual Value',
                          angle: -90,
                          position: 'insideLeft',
                          offset: -10,
                          fill: '#475569',
                          fontSize: 13,
                          fontWeight: 600,
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: 10 }}
                        formatter={(value) => <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{value}</span>}
                      />
                      <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" />
                      <Bar
                        dataKey="residual"
                        name="Residual"
                        radius={[4, 4, 4, 4]}
                        maxBarSize={40}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={(entry.residual || 0) >= 0 ? 'url(#positiveGradient)' : 'url(#negativeGradient)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Python Notebook Section */}
        {activeSection === 'notebook' && (
          <NotebookSection />
        )}

        {/* Use Cases Section */}
        {activeSection === 'usecases' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Real-World Applications</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { Icon: HomeWorkIcon, title: 'Real Estate', desc: 'Predict house prices based on features like square footage, bedrooms, location, and property age.' },
                  { Icon: ShowChartIcon, title: 'Sales Forecasting', desc: 'Forecast future sales based on advertising spend, seasonality, and historical trends.' },
                  { Icon: LocalHospitalIcon, title: 'Healthcare', desc: 'Predict patient outcomes, drug dosages, or treatment effectiveness.' },
                  { Icon: AccountBalanceIcon, title: 'Finance', desc: 'Model economic indicators, assess risk, and predict stock returns or credit scores.' },
                  { Icon: DirectionsCarIcon, title: 'Automotive', desc: 'Predict fuel efficiency based on vehicle weight, engine size, and aerodynamics.' },
                  { Icon: ThermostatIcon, title: 'Environmental Science', desc: 'Model climate patterns, predict pollution levels, or analyze environmental impact.' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
                        <item.Icon sx={{ fontSize: 22 }} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">When to Use Linear Regression</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2 text-lg">
                    <CheckCircleIcon sx={{ fontSize: 22 }} />
                    Good For
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Continuous target variables (prices, scores, quantities)',
                      'Linear relationships between variables',
                      'When interpretability is important',
                      'Baseline models for comparison',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2 text-lg">
                    <CancelIcon sx={{ fontSize: 22 }} />
                    Not Ideal For
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Classification problems (use logistic regression)',
                      'Non-linear relationships',
                      'Data with many outliers',
                      'Highly correlated features (multicollinearity)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <span className="text-red-500 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-white rounded-2xl p-8 text-center shadow-xl">
              <h2 className="text-2xl font-bold text-white dark:text-slate-900 mb-4">Ready to Explore?</h2>
              <p className="text-slate-300 dark:text-slate-600 mb-6 max-w-xl mx-auto">
                Head to the Interactive Demo section to experiment with different datasets or create your own visualizations!
              </p>
              <button
                onClick={() => setActiveSection('interactive')}
                className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-lg"
              >
                Try Interactive Demo →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
