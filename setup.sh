#!/bin/bash

# Visenty Companion - Automated Setup Script
# This script automates the initial setup process

echo "🚀 Visenty Companion Setup"
echo "=========================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION found"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "✓ npm $NPM_VERSION found"
echo ""

# Install dependencies
echo "📦 Installing JavaScript dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

# iOS Setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS - Setting up iOS..."
    
    # Check for CocoaPods
    if ! command -v pod &> /dev/null; then
        echo "⚠️  CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi
    
    # Install pods
    echo "📦 Installing iOS dependencies (this may take a few minutes)..."
    cd ios
    pod install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install iOS dependencies"
        exit 1
    fi
    cd ..
    echo "✓ iOS setup complete"
    echo ""
else
    echo "⚠️  Not on macOS - skipping iOS setup"
    echo ""
fi

# Android Setup
echo "🤖 Checking Android setup..."
if command -v adb &> /dev/null; then
    echo "✓ Android SDK found"
else
    echo "⚠️  Android SDK not found. Please install Android Studio."
fi
echo ""

# Success
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "  • For iOS: npm run ios"
echo "  • For Android: npm run android"
echo ""
echo "📚 Documentation:"
echo "  • Quick start: QUICKSTART.md"
echo "  • Full setup: SETUP.md"
echo "  • Features: FEATURES.md"
echo ""
echo "Happy coding! 🎉"

