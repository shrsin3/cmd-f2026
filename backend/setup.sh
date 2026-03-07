#!/bin/bash

echo "🚀 Setting up cmd-f 2026 ADHD Backend..."

# 1. Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    python -m venv venv
    echo "✅ Virtual environment created."
fi

# 2. Determine the activation path (Windows vs Unix)
if [ -f "venv/Scripts/activate" ]; then
    VENV_PATH="venv/Scripts/activate" # Windows
elif [ -f "venv/bin/activate" ]; then
    VENV_PATH="venv/bin/activate"    # Mac/Linux
fi

# 3. Activate and Install
source "$VENV_PATH"
echo "📦 Installing Gemini dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✨ Setup complete!"
echo "To activate manually: source $VENV_PATH"
echo "To run: python AI_task_breaker.py"