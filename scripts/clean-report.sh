#!/bin/bash

echo "🧹 Cleaning old reports..."

rm -rf reports/bookstore/html/*
rm -rf reports/bookstore/json/*
rm -rf reports/bookstore/junit/*
rm -rf reports/student/html/*
rm -rf reports/student/json/*
rm -rf reports/student/junit/*
rm -rf test-results/*

echo "✅ Reports cleaned!"