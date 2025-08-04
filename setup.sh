#!/bin/bash

# PatternHive Setup Script
# This script sets up the PatternHive development environment

echo "🧩 Setting up PatternHive..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.8 or higher and try again."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "env" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv env
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source env/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p static/css static/js static/assets templates utils

echo "✅ Setup complete!"
echo ""
echo "To start PatternHive:"
echo "  1. Activate the virtual environment: source env/bin/activate"
echo "  2. Run the application: python run.py"
echo ""
echo "Or simply run: ./run.py (after activating the environment)"