#!/bin/bash

# Basic Setup Script for ADHD Backend
# Creates virtual environment and installs dependencies

echo "Setting up cmd-f 2026 Backend..."

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""