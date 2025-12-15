#!/bin/bash

echo "🚀 Running Student tests..."

# Run Chrome tests
echo "📱 Running Chrome tests..."
npx playwright test --project=student-app-chrome

# Run Firefox tests
echo "🦊 Running Firefox tests..."
npx playwright test --project=student-app-firefox

# Generate report
echo "📊 Generating report..."
npx playwright show-report reports/student/html

echo "✅ Student tests completed!"