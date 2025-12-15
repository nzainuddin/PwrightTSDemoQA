#!/bin/bash

echo "📊 Generating combined HTML report..."

# Create combined report directory
mkdir -p reports/combined

# Copy Bookstore report
cp -r reports/bookstore/html reports/combined/bookstore

# Copy Student report
cp -r reports/student/html reports/combined/student

# Create index page
cat > reports/combined/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Test Reports</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .report-link { 
            display: block; 
            padding: 20px; 
            margin: 10px 0; 
            background: #f0f0f0; 
            text-decoration: none; 
            color: #333;
            border-radius: 5px;
        }
        .report-link:hover { background: #e0e0e0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Test Reports</h1>
        <a href="bookstore/index.html" class="report-link">
            <h2>🏪 Bookstore App Tests</h2>
            <p>View Bookstore test results</p>
        </a>
        <a href="student/index.html" class="report-link">
            <h2>🎓 Student App Tests</h2>
            <p>View Student test results</p>
        </a>
    </div>
</body>
</html>
EOF

echo "✅ Combined report generated at reports/combined/index.html"