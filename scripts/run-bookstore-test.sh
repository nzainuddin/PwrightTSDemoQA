#!/bin/bash

echo "🚀 Running Bookstore tests..."

# Run Chrome tests
echo "📱 Running Chrome tests..."
npx playwright test --project=boostore-app-chrome

# Run Firefox tests
echo "🦊 Running Firefox tests..."
npx playwright test --project=boostore-app-firefox

# Generate report
echo "📊 Generating report..."
npx playwright show-report reports/bookstore/html

echo "✅ Bookstore tests completed!"