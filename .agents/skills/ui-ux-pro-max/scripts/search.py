#!/usr/bin/env python3
"""
UI/UX Pro Max local search utility.
Performs offline queries against local design intelligence database files.
"""

import sys
import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, '..', 'data')

def load_json(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def search_items(items, query):
    query = query.lower()
    matches = []
    for item in items:
        text = json.dumps(item).lower()
        if query in text:
            matches.append(item)
    return matches

def main():
    if len(sys.argv) < 3:
        print("Usage: python search.py <style|palette|typography|guideline> <keyword>")
        sys.exit(1)

    category = sys.argv[1].lower()
    keyword = sys.argv[2].lower()

    file_map = {
        'style': 'styles.json',
        'palette': 'palettes.json',
        'typography': 'typography.json',
        'guideline': 'guidelines.json'
    }

    target_file = file_map.get(category)
    if not target_file:
        print(f"Unknown category: {category}. Choose from: {list(file_map.keys())}")
        sys.exit(1)

    data = load_json(target_file)
    results = search_items(data, keyword)

    if not results:
        print(f"No results found for '{keyword}' in {category}.")
        print("Available entries:")
        for item in data[:3]:
            print(f"- {item.get('name') or item.get('rule') or item.get('category')}")
        return

    print(f"Found {len(results)} match(es) in {category}:")
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()
