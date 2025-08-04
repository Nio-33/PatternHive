#!/usr/bin/env python3
"""
PatternHive - Development Server Runner
Run this script to start the PatternHive application
"""

import os
import sys

if __name__ == '__main__':
    # Ensure we're using the virtual environment
    venv_python = os.path.join('env', 'bin', 'python')
    if os.path.exists(venv_python) and sys.executable != os.path.abspath(venv_python):
        print("⚠️  Please activate the virtual environment first:")
        print("   source env/bin/activate")
        print("   python run.py")
        sys.exit(1)
    
    # Import and run the Flask app
    try:
        from app import app
        print("🧩 Starting PatternHive...")
        print("🌐 Open http://localhost:5001 in your browser")
        print("⚡ Press Ctrl+C to stop")
        app.run(debug=True, host='0.0.0.0', port=5001)
    except KeyboardInterrupt:
        print("\n👋 PatternHive stopped")
    except ImportError as e:
        print(f"❌ Error importing app: {e}")
        print("Make sure all dependencies are installed:")
        print("   pip install -r requirements.txt")
        sys.exit(1)