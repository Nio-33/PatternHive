from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from utils.extractors import TextExtractor
from utils.validators import InputValidator
from utils.file_processors import FileProcessor

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
CORS(app)

# Initialize utilities
extractor = TextExtractor()
validator = InputValidator()
file_processor = FileProcessor()

@app.route('/')
def index():
    """Main application page"""
    return render_template('index.html')

@app.route('/results')
def results():
    """Results display page"""
    return render_template('results.html')

@app.route('/api/extract', methods=['POST'])
def extract_data():
    """Extract emails, phones, and names from text input"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        
        # Validate input
        if not validator.validate_text_input(text):
            return jsonify({'error': 'Invalid text input'}), 400
        
        # Extract data
        results = extractor.extract_all(text)
        
        # Store results in session for export
        session_id = str(uuid.uuid4())
        session[session_id] = {
            'results': results,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify({
            'session_id': session_id,
            'results': results,
            'stats': {
                'emails_found': len(results['emails']),
                'phones_found': len(results['phones']),
                'names_found': len(results['names'])
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Process uploaded file and extract data"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file
        if not validator.validate_file(file):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Process file
        text = file_processor.extract_text(file)
        
        if not text:
            return jsonify({'error': 'Could not extract text from file'}), 400
        
        # Extract data from file content
        results = extractor.extract_all(text)
        
        # Store results in session
        session_id = str(uuid.uuid4())
        session[session_id] = {
            'results': results,
            'filename': file.filename,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify({
            'session_id': session_id,
            'filename': file.filename,
            'results': results,
            'stats': {
                'emails_found': len(results['emails']),
                'phones_found': len(results['phones']),
                'names_found': len(results['names'])
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export/<format_type>/<session_id>')
def export_data(format_type, session_id):
    """Export extracted data in specified format"""
    try:
        if session_id not in session:
            return jsonify({'error': 'Session not found'}), 404
        
        results = session[session_id]['results']
        
        if format_type == 'json':
            return jsonify(results)
        elif format_type == 'csv':
            csv_data = extractor.to_csv(results)
            return csv_data, 200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': f'attachment; filename=extracted_data_{session_id}.csv'
            }
        elif format_type == 'report':
            report = extractor.to_report(results)
            return report, 200, {
                'Content-Type': 'text/plain',
                'Content-Disposition': f'attachment; filename=report_{session_id}.txt'
            }
        else:
            return jsonify({'error': 'Invalid export format'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(413)
def file_too_large(error):
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create utils directory if it doesn't exist
    os.makedirs('utils', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/assets', exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5001)