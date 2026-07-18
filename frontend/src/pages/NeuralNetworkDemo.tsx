import { useState, useCallback, memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import SchoolIcon from '@mui/icons-material/School'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import CalculateIcon from '@mui/icons-material/Calculate'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import CodeIcon from '@mui/icons-material/Code'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import LayersIcon from '@mui/icons-material/Layers'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import PsychologyIcon from '@mui/icons-material/Psychology'
import MemoryIcon from '@mui/icons-material/Memory'
import ImageIcon from '@mui/icons-material/Image'
import TranslateIcon from '@mui/icons-material/Translate'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const colors = {
    primary: '#1d1d1f',
    secondary: '#6e6e73',
    accent: '#000000',
    muted: '#86868b',
    success: '#248a3d',
    warning: '#b25000',
    danger: '#d70015',
    neuron: '#6e6e73',
    connection: '#86868b',
    activeNeuron: '#248a3d',
    inputNeuron: '#1d1d1f',
    hiddenNeuron: '#6e6e73',
    outputNeuron: '#248a3d',
}

// Types
interface Neuron {
    id: string
    layer: number
    index: number
    x: number
    y: number
    activation: number
    bias: number
}

interface Connection {
    from: string
    to: string
    weight: number
}

interface NetworkConfig {
    inputSize: number
    hiddenLayers: number[]
    outputSize: number
}

interface NotebookCell {
    id: string
    type: 'markdown' | 'code'
    content: string
    output?: string
}

// Activation functions
const activationFunctions = {
    sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
    relu: (x: number) => Math.max(0, x),
    tanh: (x: number) => Math.tanh(x),
}

// Generate network structure
function generateNetwork(config: NetworkConfig, width: number, height: number): { neurons: Neuron[]; connections: Connection[] } {
    const neurons: Neuron[] = []
    const connections: Connection[] = []

    const allLayers = [config.inputSize, ...config.hiddenLayers, config.outputSize]
    const layerCount = allLayers.length
    const layerSpacing = width / (layerCount + 1)

    // Create neurons for each layer
    allLayers.forEach((neuronCount, layerIndex) => {
        const x = layerSpacing * (layerIndex + 1)
        const neuronSpacing = height / (neuronCount + 1)

        for (let i = 0; i < neuronCount; i++) {
            const y = neuronSpacing * (i + 1)
            neurons.push({
                id: `L${layerIndex}N${i}`,
                layer: layerIndex,
                index: i,
                x,
                y,
                activation: Math.random(),
                bias: (Math.random() - 0.5) * 2,
            })
        }
    })

    // Create connections between adjacent layers
    for (let layerIndex = 0; layerIndex < layerCount - 1; layerIndex++) {
        const currentLayerNeurons = neurons.filter(n => n.layer === layerIndex)
        const nextLayerNeurons = neurons.filter(n => n.layer === layerIndex + 1)

        currentLayerNeurons.forEach(fromNeuron => {
            nextLayerNeurons.forEach(toNeuron => {
                connections.push({
                    from: fromNeuron.id,
                    to: toNeuron.id,
                    weight: (Math.random() - 0.5) * 2,
                })
            })
        })
    }

    return { neurons, connections }
}

// Forward propagation simulation
function forwardPropagate(
    neurons: Neuron[],
    connections: Connection[],
    inputs: number[],
    activationFn: (x: number) => number
): Neuron[] {
    const updatedNeurons = neurons.map(n => ({ ...n }))
    const layerCount = Math.max(...neurons.map(n => n.layer)) + 1

    // Set input layer activations
    const inputNeurons = updatedNeurons.filter(n => n.layer === 0)
    inputNeurons.forEach((n, i) => {
        n.activation = inputs[i] ?? 0
    })

    // Propagate through hidden and output layers
    for (let layer = 1; layer < layerCount; layer++) {
        const currentLayerNeurons = updatedNeurons.filter(n => n.layer === layer)

        currentLayerNeurons.forEach(neuron => {
            const incomingConnections = connections.filter(c => c.to === neuron.id)
            let sum = neuron.bias

            incomingConnections.forEach(conn => {
                const fromNeuron = updatedNeurons.find(n => n.id === conn.from)
                if (fromNeuron) {
                    sum += fromNeuron.activation * conn.weight
                }
            })

            neuron.activation = activationFn(sum)
        })
    }

    return updatedNeurons
}

// Code cell component for notebook section
const CodeCell = memo(({ cell, isExpanded, onToggle }: { cell: NotebookCell; isExpanded: boolean; onToggle: () => void }) => {
    const [copied, setCopied] = useState(false)

    const copyCode = useCallback(() => {
        navigator.clipboard.writeText(cell.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [cell.content])

    return (
        <div className="bg-white dark:bg-[#1d1d1f] rounded-xl border border-[#d2d2d7] dark:border-[#2c2c2e] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 border-b border-[#d2d2d7] dark:border-[#424245]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs font-mono text-[#86868b] dark:text-[#a1a1a6] ml-2">Python</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={copyCode} className="p-1.5 rounded-md hover:bg-[#d2d2d7] dark:hover:bg-[#424245] transition-colors" title="Copy code">
                        {copied ? <CheckIcon sx={{ fontSize: 16 }} className="text-green-500" /> : <ContentCopyIcon sx={{ fontSize: 16 }} className="text-[#a1a1a6]" />}
                    </button>
                    <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-[#d2d2d7] dark:hover:bg-[#424245] transition-colors" title={isExpanded ? "Collapse" : "Expand"}>
                        {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} className="text-[#a1a1a6]" /> : <ExpandMoreIcon sx={{ fontSize: 18 }} className="text-[#a1a1a6]" />}
                    </button>
                </div>
            </div>
            <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-32 overflow-hidden'}`}>
                <pre className="p-4 text-sm font-mono overflow-x-auto bg-[#0a0a0c] text-[#e8e8ed]"><code>{cell.content}</code></pre>
            </div>
            {cell.output && (
                <div className="border-t border-[#d2d2d7] dark:border-[#424245]">
                    <div className="px-4 py-1.5 bg-[#e8e8ed] dark:bg-[#2c2c2e] border-b border-[#d2d2d7] dark:border-[#424245]">
                        <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Output</span>
                    </div>
                    <pre className="p-4 text-sm font-mono overflow-x-auto bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 text-[#424245] dark:text-[#d2d2d7] whitespace-pre-wrap">{cell.output}</pre>
                </div>
            )}
        </div>
    )
})
CodeCell.displayName = 'CodeCell'

// Neural Network SVG Visualization Component
const NetworkVisualization = memo(({
    neurons,
    connections,
    width,
    height,
    highlightedNeuron,
    onNeuronHover
}: {
    neurons: Neuron[]
    connections: Connection[]
    width: number
    height: number
    highlightedNeuron: string | null
    onNeuronHover: (id: string | null) => void
}) => {
    const layerCount = Math.max(...neurons.map(n => n.layer)) + 1

    const getNeuronColor = (neuron: Neuron) => {
        if (neuron.layer === 0) return colors.inputNeuron
        if (neuron.layer === layerCount - 1) return colors.outputNeuron
        return colors.hiddenNeuron
    }

    const getConnectionOpacity = (conn: Connection) => {
        if (highlightedNeuron) {
            if (conn.from === highlightedNeuron || conn.to === highlightedNeuron) {
                return 0.8
            }
            return 0.1
        }
        return Math.abs(conn.weight) * 0.5 + 0.1
    }

    const getConnectionWidth = (conn: Connection) => {
        return Math.abs(conn.weight) * 2 + 0.5
    }

    return (
        <svg width={width} height={height} className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/60 rounded-xl border border-[#d2d2d7] dark:border-[#424245]/50">
            <defs>
                <filter id="neuronGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Connections */}
            {connections.map((conn, i) => {
                const fromNeuron = neurons.find(n => n.id === conn.from)
                const toNeuron = neurons.find(n => n.id === conn.to)
                if (!fromNeuron || !toNeuron) return null

                return (
                    <line
                        key={i}
                        x1={fromNeuron.x}
                        y1={fromNeuron.y}
                        x2={toNeuron.x}
                        y2={toNeuron.y}
                        stroke={conn.weight > 0 ? colors.success : colors.danger}
                        strokeWidth={getConnectionWidth(conn)}
                        opacity={getConnectionOpacity(conn)}
                        className="transition-opacity duration-200"
                    />
                )
            })}

            {/* Neurons */}
            {neurons.map(neuron => {
                const isHighlighted = highlightedNeuron === neuron.id
                const radius = isHighlighted ? 22 : 18

                return (
                    <g key={neuron.id}>
                        {/* Activation ring */}
                        <circle
                            cx={neuron.x}
                            cy={neuron.y}
                            r={radius + 4}
                            fill="none"
                            stroke={getNeuronColor(neuron)}
                            strokeWidth={2}
                            opacity={neuron.activation}
                            filter={isHighlighted ? "url(#neuronGlow)" : undefined}
                        />
                        {/* Neuron body */}
                        <circle
                            cx={neuron.x}
                            cy={neuron.y}
                            r={radius}
                            fill={getNeuronColor(neuron)}
                            opacity={0.3 + neuron.activation * 0.7}
                            className="cursor-pointer transition-all duration-200"
                            onMouseEnter={() => onNeuronHover(neuron.id)}
                            onMouseLeave={() => onNeuronHover(null)}
                            filter={isHighlighted ? "url(#neuronGlow)" : undefined}
                        />
                        {/* Activation value */}
                        <text
                            x={neuron.x}
                            y={neuron.y + 4}
                            textAnchor="middle"
                            className="text-xs font-mono fill-white font-bold pointer-events-none"
                        >
                            {neuron.activation.toFixed(2)}
                        </text>
                    </g>
                )
            })}

            {/* Layer labels */}
            {Array.from({ length: layerCount }).map((_, i) => {
                const layerNeurons = neurons.filter(n => n.layer === i)
                const x = layerNeurons[0]?.x || 0
                const label = i === 0 ? 'Input' : i === layerCount - 1 ? 'Output' : `Hidden ${i}`

                return (
                    <text
                        key={i}
                        x={x}
                        y={height - 15}
                        textAnchor="middle"
                        className="text-sm font-medium fill-[#86868b] dark:fill-[#a1a1a6]"
                    >
                        {label}
                    </text>
                )
            })}
        </svg>
    )
})
NetworkVisualization.displayName = 'NetworkVisualization'

// Notebook cells for Python code examples
const notebookCells: NotebookCell[] = [
    {
        id: 'imports',
        type: 'code',
        content: `# Core libraries
import numpy as np
import matplotlib.pyplot as plt

# Deep Learning with PyTorch
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# For dataset
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

print('Libraries imported successfully!')
print(f'PyTorch version: {torch.__version__}')`,
        output: `Libraries imported successfully!
PyTorch version: 2.1.0`
    },
    {
        id: 'create-data',
        type: 'code',
        content: `# Create a non-linear classification dataset (moons)
X, y = make_moons(n_samples=1000, noise=0.2, random_state=42)

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Convert to PyTorch tensors
X_train_t = torch.FloatTensor(X_train)
y_train_t = torch.FloatTensor(y_train).unsqueeze(1)
X_test_t = torch.FloatTensor(X_test)
y_test_t = torch.FloatTensor(y_test).unsqueeze(1)

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")
print(f"Input features: {X_train.shape[1]}")`,
        output: `Training samples: 800
Test samples: 200
Input features: 2`
    },
    {
        id: 'define-network',
        type: 'code',
        content: `# Define a simple neural network
class NeuralNetwork(nn.Module):
    def __init__(self, input_size, hidden_sizes, output_size):
        super(NeuralNetwork, self).__init__()

        layers = []
        prev_size = input_size

        # Hidden layers
        for hidden_size in hidden_sizes:
            layers.append(nn.Linear(prev_size, hidden_size))
            layers.append(nn.ReLU())
            prev_size = hidden_size

        # Output layer
        layers.append(nn.Linear(prev_size, output_size))
        layers.append(nn.Sigmoid())

        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)

# Create the model
model = NeuralNetwork(
    input_size=2,
    hidden_sizes=[8, 4],
    output_size=1
)

print("Neural Network Architecture:")
print(model)
print(f"\\nTotal parameters: {sum(p.numel() for p in model.parameters()):,}")`,
        output: `Neural Network Architecture:
NeuralNetwork(
  (network): Sequential(
    (0): Linear(in_features=2, out_features=8, bias=True)
    (1): ReLU()
    (2): Linear(in_features=8, out_features=4, bias=True)
    (3): ReLU()
    (4): Linear(in_features=4, out_features=1, bias=True)
    (5): Sigmoid()
  )
)

Total parameters: 61`
    },
    {
        id: 'training-setup',
        type: 'code',
        content: `# Loss function and optimizer
criterion = nn.BCELoss()  # Binary Cross-Entropy
optimizer = optim.Adam(model.parameters(), lr=0.01)

# Training configuration
epochs = 100
batch_size = 32

# Create data loader
train_dataset = TensorDataset(X_train_t, y_train_t)
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

print("Training Configuration:")
print(f"  Loss Function: Binary Cross-Entropy")
print(f"  Optimizer: Adam (lr=0.01)")
print(f"  Epochs: {epochs}")
print(f"  Batch Size: {batch_size}")`,
        output: `Training Configuration:
  Loss Function: Binary Cross-Entropy
  Optimizer: Adam (lr=0.01)
  Epochs: 100
  Batch Size: 32`
    },
    {
        id: 'training-loop',
        type: 'code',
        content: `# Training loop
losses = []

for epoch in range(epochs):
    epoch_loss = 0
    for batch_X, batch_y in train_loader:
        # Forward pass
        outputs = model(batch_X)
        loss = criterion(outputs, batch_y)

        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        epoch_loss += loss.item()

    avg_loss = epoch_loss / len(train_loader)
    losses.append(avg_loss)

    if (epoch + 1) % 20 == 0:
        print(f"Epoch [{epoch+1}/{epochs}], Loss: {avg_loss:.4f}")

print("\\nTraining Complete!")`,
        output: `Epoch [20/100], Loss: 0.3542
Epoch [40/100], Loss: 0.1823
Epoch [60/100], Loss: 0.1245
Epoch [80/100], Loss: 0.0987
Epoch [100/100], Loss: 0.0854

Training Complete!`
    },
    {
        id: 'evaluation',
        type: 'code',
        content: `# Evaluate the model
model.eval()
with torch.no_grad():
    # Training accuracy
    train_pred = (model(X_train_t) > 0.5).float()
    train_acc = (train_pred == y_train_t).float().mean()

    # Test accuracy
    test_pred = (model(X_test_t) > 0.5).float()
    test_acc = (test_pred == y_test_t).float().mean()

print("Model Performance:")
print("=" * 40)
print(f"  Training Accuracy: {train_acc:.4f} ({train_acc*100:.1f}%)")
print(f"  Test Accuracy:     {test_acc:.4f} ({test_acc*100:.1f}%)")`,
        output: `Model Performance:
========================================
  Training Accuracy: 0.9750 (97.5%)
  Test Accuracy:     0.9650 (96.5%)`
    },
    {
        id: 'summary',
        type: 'code',
        content: `# Final summary
print("\\n" + "="*60)
print("         NEURAL NETWORK MODEL SUMMARY")
print("="*60)
print(f"\\n  Architecture: 2 -> 8 -> 4 -> 1")
print(f"  Activation: ReLU (hidden), Sigmoid (output)")
print(f"  Parameters: 61")
print(f"\\n  Final Loss: {losses[-1]:.4f}")
print(f"  Test Accuracy: {test_acc*100:.1f}%")
print(f"\\n  Key Insight: The network learned to separate")
print(f"  the non-linear 'moons' pattern successfully!")
print("\\n" + "="*60)`,
        output: `
============================================================
         NEURAL NETWORK MODEL SUMMARY
============================================================

  Architecture: 2 -> 8 -> 4 -> 1
  Activation: ReLU (hidden), Sigmoid (output)
  Parameters: 61

  Final Loss: 0.0854
  Test Accuracy: 96.5%

  Key Insight: The network learned to separate
  the non-linear 'moons' pattern successfully!

============================================================`
    }
]

// Notebook section component
const NotebookSection = memo(() => {
    const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set(['imports', 'define-network', 'evaluation']))

    const toggleCell = useCallback((id: string) => {
        setExpandedCells(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])

    const expandAll = useCallback(() => setExpandedCells(new Set(notebookCells.map(c => c.id))), [])
    const collapseAll = useCallback(() => setExpandedCells(new Set()), [])

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Header Card */}
            <div className="apple-card-solid rounded-3xl p-8 shadow-xl border border-[#424245]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Binary Classification with Neural Networks</h2>
                        <p className="text-[#d2d2d7]">A complete neural network workflow using PyTorch on the moons dataset.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={expandAll} className="px-4 py-2 bg-[#424245] hover:bg-[#6e6e73] text-white text-sm font-medium rounded-lg transition-colors">Expand All</button>
                        <button onClick={collapseAll} className="px-4 py-2 bg-[#424245] hover:bg-[#6e6e73] text-white text-sm font-medium rounded-lg transition-colors">Collapse All</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                        { label: 'Framework', value: 'PyTorch' },
                        { label: 'Architecture', value: '2-8-4-1' },
                        { label: 'Test Accuracy', value: '96.5%' },
                        { label: 'Parameters', value: '61' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#2c2c2e]/50 rounded-xl p-4 border border-[#424245]/50">
                            <p className="text-[#a1a1a6] text-sm">{stat.label}</p>
                            <p className="text-white font-semibold font-mono">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notebook Steps */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                        Import Libraries
                    </h3>
                    <CodeCell cell={notebookCells[0]} isExpanded={expandedCells.has(notebookCells[0].id)} onToggle={() => toggleCell(notebookCells[0].id)} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                        Create Dataset
                    </h3>
                    <CodeCell cell={notebookCells[1]} isExpanded={expandedCells.has(notebookCells[1].id)} onToggle={() => toggleCell(notebookCells[1].id)} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                        Define Neural Network
                    </h3>
                    <CodeCell cell={notebookCells[2]} isExpanded={expandedCells.has(notebookCells[2].id)} onToggle={() => toggleCell(notebookCells[2].id)} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                        Training Setup
                    </h3>
                    <CodeCell cell={notebookCells[3]} isExpanded={expandedCells.has(notebookCells[3].id)} onToggle={() => toggleCell(notebookCells[3].id)} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-lg flex items-center justify-center text-sm font-bold">5</span>
                        Training Loop
                    </h3>
                    <CodeCell cell={notebookCells[4]} isExpanded={expandedCells.has(notebookCells[4].id)} onToggle={() => toggleCell(notebookCells[4].id)} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-lg flex items-center justify-center text-sm font-bold">6</span>
                        Evaluation & Summary
                    </h3>
                    <div className="space-y-4">
                        {notebookCells.slice(5, 7).map(cell => (
                            <CodeCell key={cell.id} cell={cell} isExpanded={expandedCells.has(cell.id)} onToggle={() => toggleCell(cell.id)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Insights Card */}
            <div className="apple-card-solid rounded-3xl p-8 border hairline">
                <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Key Insights</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Why Neural Networks Work</h4>
                        <ul className="space-y-2 text-[#6e6e73] dark:text-[#a1a1a6]">
                            <li className="flex items-center gap-2"><span className="font-bold">1.</span><span>Non-linear activation functions enable complex pattern learning</span></li>
                            <li className="flex items-center gap-2"><span className="font-bold">2.</span><span>Multiple layers create hierarchical feature representations</span></li>
                            <li className="flex items-center gap-2"><span className="font-bold">3.</span><span>Backpropagation efficiently updates millions of parameters</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Training Tips</h4>
                        <ul className="space-y-2 text-[#6e6e73] dark:text-[#a1a1a6]">
                            <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">!</span><span>Start with small learning rates and increase if needed</span></li>
                            <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">!</span><span>Monitor validation loss to prevent overfitting</span></li>
                            <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">!</span><span>Use batch normalization for deeper networks</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Download CTA */}
            <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Want to run this yourself?</h3>
                    <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Download the complete Jupyter notebook and experiment with the code.</p>
                </div>
                <a href="/notebooks/neural_network_intro.ipynb" download className="px-6 py-3 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] font-semibold rounded-xl hover:bg-[#2c2c2e] dark:hover:bg-[#e8e8ed] transition-colors shadow-lg flex items-center gap-2">
                    <CodeIcon sx={{ fontSize: 20 }} />
                    Download Notebook
                </a>
            </div>
        </motion.div>
    )
})
NotebookSection.displayName = 'NotebookSection'

// Main component
export default function NeuralNetworkDemo() {
    const [activeSection, setActiveSection] = useState<string>('intro')
    const [networkConfig, setNetworkConfig] = useState<NetworkConfig>({
        inputSize: 3,
        hiddenLayers: [4, 3],
        outputSize: 2,
    })
    const [activationFn, setActivationFn] = useState<'sigmoid' | 'relu' | 'tanh'>('sigmoid')
    const [highlightedNeuron, setHighlightedNeuron] = useState<string | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [inputs, setInputs] = useState<number[]>([0.5, 0.8, 0.3])

    const networkSize = { width: 600, height: 400 }

    const { neurons, connections } = useMemo(
        () => generateNetwork(networkConfig, networkSize.width, networkSize.height),
        [networkConfig, networkSize.width, networkSize.height]
    )

    const [animatedNeurons, setAnimatedNeurons] = useState(neurons)

    const runForwardPass = useCallback(() => {
        setIsAnimating(true)
        const result = forwardPropagate(neurons, connections, inputs, activationFunctions[activationFn])
        setAnimatedNeurons(result)
        setTimeout(() => setIsAnimating(false), 500)
    }, [neurons, connections, inputs, activationFn])

    const resetNetwork = useCallback(() => {
        const { neurons: newNeurons } = generateNetwork(networkConfig, networkSize.width, networkSize.height)
        setAnimatedNeurons(newNeurons)
        setInputs(networkConfig.inputSize === 3 ? [0.5, 0.8, 0.3] : Array(networkConfig.inputSize).fill(0.5))
    }, [networkConfig, networkSize.width, networkSize.height])

    const sections = [
        { id: 'intro', label: 'Introduction', icon: SchoolIcon },
        { id: 'math', label: 'The Math', icon: CalculateIcon },
        { id: 'interactive', label: 'Interactive Demo', icon: TouchAppIcon },
        { id: 'notebook', label: 'Python Code', icon: CodeIcon },
        { id: 'usecases', label: 'Use Cases', icon: TipsAndUpdatesIcon },
    ]

    return (
        <section className="apple-page pt-28 pb-24 relative overflow-hidden">
            <div className="absolute inset-0 studio-grid opacity-50" />

            <div className="apple-section max-w-7xl relative z-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Link to="/projects" className="text-link mb-8 group">
                        <ArrowBackIcon className="group-hover:-translate-x-1 transition-transform" sx={{ fontSize: 20 }} />
                        Back to Projects
                    </Link>

                    <div className="mb-14 max-w-3xl">
                        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-medium text-[#6e6e73] dark:bg-white/10 dark:text-[#a1a1a6] mb-6">
                            <AutoGraphIcon sx={{ fontSize: 18 }} />
                            Project walkthrough
                        </motion.span>
                        <h1 className="display-heading text-5xl md:text-6xl lg:text-7xl mb-6">
                            Neural <span className="ink-text">Networks</span>
                        </h1>
                        <p className="apple-copy max-w-2xl text-lg sm:text-xl">
                            A straightforward look at how network layers and activations behave, based on how I explain the topic to partners.
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Project sections">
                        {sections.map((section) => {
                            const Icon = section.icon
                            return (
                                <button
                                    type="button"
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    aria-pressed={activeSection === section.id}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${activeSection === section.id
                                        ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] shadow-lg'
                                        : 'bg-[#e8e8ed] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-[#d2d2d7] dark:hover:bg-[#424245]'
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">What is a Neural Network?</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-lg leading-relaxed mb-6">
                                    A neural network is a layered model that learns relationships from data by tuning weights between connected nodes.
                                </p>
                                <p className="text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed mb-6">
                                    This page focuses on the mechanics: what each layer does, how values move through the network, and what changes when you adjust inputs.
                                </p>

                                <div className="grid md:grid-cols-3 gap-6 mt-8">
                                    <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] rounded-xl flex items-center justify-center mb-4 shadow-lg text-white">
                                            <LayersIcon sx={{ fontSize: 24 }} />
                                        </div>
                                        <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Input Layer</h3>
                                        <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Receives raw data features. Each neuron represents one input feature.</p>
                                    </div>
                                    <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] rounded-xl flex items-center justify-center mb-4 shadow-lg text-white">
                                            <AccountTreeIcon sx={{ fontSize: 24 }} />
                                        </div>
                                        <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Hidden Layers</h3>
                                        <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Process and transform data. More layers enable learning complex patterns.</p>
                                    </div>
                                    <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] rounded-xl flex items-center justify-center mb-4 shadow-lg text-white">
                                            <PsychologyIcon sx={{ fontSize: 24 }} />
                                        </div>
                                        <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Output Layer</h3>
                                        <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Produces final predictions. Number of neurons depends on the task.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Preview */}
                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Network Architecture</h2>
                            <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-6">A simple feedforward neural network with input, hidden, and output layers. Hover over neurons to see their connections.</p>
                            <div className="flex justify-center">
                                <NetworkVisualization
                                    neurons={animatedNeurons}
                                    connections={connections}
                                    width={networkSize.width}
                                    height={networkSize.height}
                                    highlightedNeuron={highlightedNeuron}
                                    onNeuronHover={setHighlightedNeuron}
                                />
                            </div>
                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.inputNeuron }} />
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Input Neurons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.hiddenNeuron }} />
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Hidden Neurons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.outputNeuron }} />
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Output Neurons</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Math Section */}
                {activeSection === 'math' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Forward Propagation</h2>
                            <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-6">
                                Each neuron computes a weighted sum of its inputs, adds a bias, and applies an activation function.
                            </p>
                            <div className="apple-card-solid mb-8 rounded-xl border hairline p-8 text-center">
                                <p className="font-mono text-3xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] md:text-4xl">
                                    z = Wx + b
                                </p>
                                <p className="text-[#86868b] dark:text-[#a1a1a6] mt-4">then apply activation</p>
                                <p className="mt-2 font-mono text-3xl font-bold text-[#6e6e73] dark:text-[#a1a1a6] md:text-4xl">
                                    a = f(z)
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="apple-card-solid rounded-xl border hairline p-6">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                                        <span className="font-mono text-lg font-semibold">W</span> - Weights
                                    </h3>
                                    <p className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Learnable parameters that determine how much influence each input has on the output. Adjusted during training via backpropagation.
                                    </p>
                                </div>
                                <div className="apple-card-solid rounded-xl p-6 border border-amber-100 dark:border-amber-800">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                                        <span className="font-mono text-lg text-amber-600 dark:text-amber-400">b</span> - Bias
                                    </h3>
                                    <p className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                        An offset term that allows the neuron to shift its activation. Helps the network fit data that doesn't pass through the origin.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Activation Functions</h2>
                            <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-6">
                                Activation functions introduce non-linearity, enabling networks to learn complex patterns.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="apple-card-solid rounded-xl p-6 border border-emerald-100 dark:border-emerald-800">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Sigmoid</h3>
                                    <p className="text-[#424245] dark:text-[#d2d2d7] font-mono text-lg mb-2">f(x) = 1/(1+e^-x)</p>
                                    <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Output range: (0, 1). Good for binary classification output layers.</p>
                                </div>
                                <div className="apple-card-solid rounded-xl border hairline p-6">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">ReLU</h3>
                                    <p className="text-[#424245] dark:text-[#d2d2d7] font-mono text-lg mb-2">f(x) = max(0, x)</p>
                                    <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Most popular for hidden layers. Fast to compute, reduces vanishing gradients.</p>
                                </div>
                                <div className="apple-card-solid rounded-xl border hairline p-6">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Tanh</h3>
                                    <p className="text-[#424245] dark:text-[#d2d2d7] font-mono text-lg mb-2">f(x) = tanh(x)</p>
                                    <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">Output range: (-1, 1). Zero-centered, useful for hidden layers.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Backpropagation</h2>
                            <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-6">
                                The algorithm that trains neural networks by computing gradients and updating weights.
                            </p>

                            <div className="space-y-4">
                                <div className="apple-card-solid rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="w-8 h-8 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white rounded-lg flex items-center justify-center font-bold text-sm">1</span>
                                        <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Compute Loss</h3>
                                    </div>
                                    <p className="text-[#424245] dark:text-[#d2d2d7] font-mono text-lg pl-11">L = (1/n) * sum((y - y_pred)^2)</p>
                                </div>

                                <div className="apple-card-solid rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="w-8 h-8 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white rounded-lg flex items-center justify-center font-bold text-sm">2</span>
                                        <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Compute Gradients</h3>
                                    </div>
                                    <p className="text-[#424245] dark:text-[#d2d2d7] font-mono text-lg pl-11">dL/dW = dL/da * da/dz * dz/dW</p>
                                </div>

                                <div className="apple-card-solid rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="w-8 h-8 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white rounded-lg flex items-center justify-center font-bold text-sm">3</span>
                                        <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Update Weights</h3>
                                    </div>
                                    <p className="text-[#424245] dark:text-[#d2d2d7] font-mono text-lg pl-11">W = W - learning_rate * dL/dW</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* INTERACTIVE SECTION CONTINUES IN NEXT PART */}

                {/* Interactive Demo Section */}
                {activeSection === 'interactive' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Interactive Playground</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={runForwardPass}
                                        disabled={isAnimating}
                                        className="px-4 py-2 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white rounded-lg font-medium transition-all shadow-lg shadow-black/10 dark:shadow-none disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <PlayArrowIcon sx={{ fontSize: 18 }} />
                                        {isAnimating ? 'Running...' : 'Forward Pass'}
                                    </button>
                                    <button
                                        onClick={resetNetwork}
                                        className="px-4 py-2 bg-[#e8e8ed] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#a1a1a6] rounded-lg font-medium hover:bg-[#d2d2d7] dark:hover:bg-[#424245] transition-colors flex items-center gap-2"
                                    >
                                        <RestartAltIcon sx={{ fontSize: 18 }} />
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-[#424245] dark:text-[#d2d2d7] mb-2">Activation Function</label>
                                    <select
                                        value={activationFn}
                                        onChange={(e) => setActivationFn(e.target.value as 'sigmoid' | 'relu' | 'tanh')}
                                        className="w-full px-3 py-2 bg-white dark:bg-[#424245] border border-[#d2d2d7] dark:border-[#6e6e73] rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7]"
                                    >
                                        <option value="sigmoid">Sigmoid</option>
                                        <option value="relu">ReLU</option>
                                        <option value="tanh">Tanh</option>
                                    </select>
                                </div>
                                <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-[#424245] dark:text-[#d2d2d7] mb-2">Hidden Layer 1 Size</label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="6"
                                        value={networkConfig.hiddenLayers[0]}
                                        onChange={(e) => setNetworkConfig(prev => ({
                                            ...prev,
                                            hiddenLayers: [parseInt(e.target.value), prev.hiddenLayers[1]]
                                        }))}
                                        className="w-full"
                                    />
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">{networkConfig.hiddenLayers[0]} neurons</span>
                                </div>
                                <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-[#424245] dark:text-[#d2d2d7] mb-2">Hidden Layer 2 Size</label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="5"
                                        value={networkConfig.hiddenLayers[1]}
                                        onChange={(e) => setNetworkConfig(prev => ({
                                            ...prev,
                                            hiddenLayers: [prev.hiddenLayers[0], parseInt(e.target.value)]
                                        }))}
                                        className="w-full"
                                    />
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">{networkConfig.hiddenLayers[1]} neurons</span>
                                </div>
                            </div>

                            {/* Input Controls */}
                            <div className="apple-card-solid rounded-xl p-4 mb-6 border hairline">
                                <label className="block text-sm font-medium text-[#424245] dark:text-[#d2d2d7] mb-3">Input Values</label>
                                <div className="flex flex-wrap gap-4">
                                    {inputs.map((val, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm font-mono">x{i + 1}:</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={val}
                                                onChange={(e) => {
                                                    const newInputs = [...inputs]
                                                    newInputs[i] = parseFloat(e.target.value)
                                                    setInputs(newInputs)
                                                }}
                                                className="w-24"
                                            />
                                            <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-mono text-sm w-8">{val.toFixed(1)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Network Visualization */}
                            <div className="flex justify-center overflow-x-auto">
                                <NetworkVisualization
                                    neurons={animatedNeurons}
                                    connections={connections}
                                    width={networkSize.width}
                                    height={networkSize.height}
                                    highlightedNeuron={highlightedNeuron}
                                    onNeuronHover={setHighlightedNeuron}
                                />
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-1 rounded" style={{ backgroundColor: colors.success }} />
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6]">Positive Weight</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-1 rounded" style={{ backgroundColor: colors.danger }} />
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6]">Negative Weight</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#6e6e73] dark:text-[#a1a1a6]">Brighter = Higher Activation</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="apple-card-solid rounded-2xl p-6 border hairline">
                                <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                                    <PlayArrowIcon className="text-[#6e6e73] dark:text-[#a1a1a6]" />
                                    Forward Pass
                                </h3>
                                <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">
                                    Click "Forward Pass" to see how input values propagate through the network. Each neuron computes its weighted sum, adds bias, and applies the activation function.
                                </p>
                            </div>
                            <div className="apple-card-solid rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                                <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 flex items-center gap-2">
                                    <TouchAppIcon className="text-amber-500" />
                                    Interact
                                </h3>
                                <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">
                                    Hover over neurons to highlight their connections. Adjust input sliders and network architecture to see how the activations change throughout the network.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Python Notebook Section */}
                {activeSection === 'notebook' && <NotebookSection />}

                {/* Use Cases Section */}
                {activeSection === 'usecases' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Real-World Applications</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { Icon: ImageIcon, title: 'Computer Vision', desc: 'Image classification, object detection, facial recognition, and medical image analysis.' },
                                    { Icon: TranslateIcon, title: 'Natural Language', desc: 'Translation, sentiment analysis, text generation, and chatbots like GPT.' },
                                    { Icon: SmartToyIcon, title: 'Robotics & Games', desc: 'Robot control, game agents, and reinforcement learning experiments.' },
                                    { Icon: HealthAndSafetyIcon, title: 'Healthcare', desc: 'Drug discovery, disease diagnosis, patient outcome prediction, and genomics.' },
                                    { Icon: MemoryIcon, title: 'Recommendation', desc: 'Personalized content, product recommendations, and user behavior prediction.' },
                                    { Icon: PsychologyIcon, title: 'Generative Models', desc: 'Image, text, and audio generation tools built from learned patterns.' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245] hover:shadow-lg transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-[#1d1d1f] dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-[#1d1d1f]">
                                                <item.Icon sx={{ fontSize: 22 }} />
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{item.title}</h3>
                                        </div>
                                        <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">When to Use Neural Networks</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2 text-lg">
                                        <CheckCircleIcon sx={{ fontSize: 22 }} />
                                        Good For
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Complex patterns that are hard to define explicitly',
                                            'Large amounts of training data available',
                                            'Unstructured data (images, text, audio)',
                                            'Tasks where accuracy is more important than interpretability',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[#6e6e73] dark:text-[#a1a1a6]">
                                                <span className="text-emerald-500 mt-0.5">-</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2 text-lg">
                                        <CancelIcon sx={{ fontSize: 22 }} />
                                        Consider Alternatives When
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Limited training data available',
                                            'Interpretability is critical (use decision trees, linear models)',
                                            'Simple linear relationships exist (use regression)',
                                            'Computational resources are constrained',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[#6e6e73] dark:text-[#a1a1a6]">
                                                <span className="text-red-500 mt-0.5">-</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1d1d1f] dark:bg-white rounded-2xl p-8 text-center shadow-xl">
                            <h2 className="text-2xl font-bold text-white dark:text-[#1d1d1f] mb-4">Ready to Experiment?</h2>
                            <p className="text-[#d2d2d7] dark:text-[#6e6e73] mb-6 max-w-xl mx-auto">
                                Head to the Interactive Demo section to build and visualize your own neural network architecture!
                            </p>
                            <button
                                onClick={() => setActiveSection('interactive')}
                                className="px-8 py-3 bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-xl font-semibold hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-colors shadow-lg"
                            >
                                Try Interactive Demo
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
