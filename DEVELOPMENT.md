# 🧩 PatternHive Development Guide

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Web browser with WebGL support
- Terminal/Command prompt

### Setup & Installation

1. **Clone and setup the project:**
   ```bash
   # Make setup script executable and run it
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start the development server:**
   ```bash
   # Activate virtual environment
   source env/bin/activate
   
   # Run the application
   python run.py
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5001`

## Project Structure

```
PatternHive/
├── app.py                 # Flask application main file
├── run.py                 # Development server runner
├── setup.sh              # Setup script
├── requirements.txt       # Python dependencies
├── utils/                 # Backend utilities
│   ├── extractors.py     # Regex extraction logic
│   ├── validators.py     # Input validation
│   └── file_processors.py # File handling utilities
├── templates/
│   ├── index.html        # Main input page
│   └── results.html      # Results display page
├── static/
│   ├── css/
│   │   ├── style.css     # Main stylesheet
│   │   └── animations.css # Animation definitions
│   ├── js/
│   │   ├── main.js       # Main page logic (input handling)
│   │   ├── results.js    # Results page logic (display & export)
│   │   ├── effects.js    # WebGL and Three.js effects
│   │   └── animations.js # GSAP animations
│   └── assets/           # Static assets
└── env/                  # Python virtual environment
```

## Application Workflow

### 📝 **Main Page** (`/`)
1. User inputs text or uploads file
2. Real-time validation and processing
3. Results cached in localStorage
4. Automatic redirect to results page

### 📊 **Results Page** (`/results?session=<id>`)
1. Displays extracted data with statistics
2. Advanced filtering and search
3. Multiple export formats
4. Print functionality
5. Navigation back to main page

## Features Implemented

### ✅ Backend (Flask API)
- **Text Processing API** (`/api/extract`)
  - Email extraction with validation
  - Phone number extraction (international formats)
  - Name extraction with confidence scoring
  
- **File Upload API** (`/api/upload`)
  - PDF text extraction
  - DOCX document parsing
  - Excel file reading
  - CSV file processing
  
- **Export API** (`/api/export/{format}/{session_id}`)
  - JSON export
  - CSV export
  - Formatted text reports

### ✅ Frontend (Vanilla JavaScript)
- **Two-Page Architecture**
  - Main page: Input and processing
  - Results page: Display and export
  
- **Interactive UI**
  - Tab-based input (text/file)
  - Real-time processing with redirect
  - Drag & drop file upload
  
- **Results Display**
  - Dedicated results page with enhanced features
  - Animated statistics cards
  - Advanced filtering options
  - Categorized result grids
  - Confidence scoring visualization
  - Print functionality
  
- **Visual Effects**
  - Three.js 3D background
  - Particle trail system
  - GSAP animations
  - Glass-morphism design

### ✅ Design System
- **Futuristic Theme**
  - Dark color palette
  - Neon accent colors
  - Glass-morphism effects
  - Orbitron + Inter typography
  
- **Animations**
  - Micro-interactions
  - Loading states
  - Hover effects
  - Scroll-triggered animations

## API Endpoints

### POST `/api/extract`
Extract data from text input.

**Request:**
```json
{
  "text": "Contact john.doe@example.com or call (555) 123-4567"
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "results": {
    "emails": [{"email": "john.doe@example.com", "valid": true, "domain": "example.com"}],
    "phones": [{"phone": "(555) 123-4567", "formatted": "(555) 123-4567", "valid": true, "country": "US"}],
    "names": [{"name": "John Doe", "confidence": 0.85, "type": "first_last"}]
  },
  "stats": {
    "emails_found": 1,
    "phones_found": 1,
    "names_found": 1
  }
}
```

### POST `/api/upload`
Process uploaded file.

**Request:** Multipart form with file upload

**Response:** Same format as `/api/extract`

### GET `/api/export/{format}/{session_id}`
Export results in specified format.

**Formats:** `json`, `csv`, `report`

## Development Commands

### Running the Application
```bash
# Development server with auto-reload
source env/bin/activate
python run.py

# Or using Flask directly
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5001
```

### Testing
```bash
# Test API endpoints
curl -X POST -H "Content-Type: application/json" \
     -d '{"text":"test@example.com"}' \
     http://localhost:5001/api/extract

# Test file upload
curl -X POST -F "file=@test.pdf" \
     http://localhost:5001/api/upload

# Test results page
curl http://localhost:5001/results?session=<session-id>
```

### Dependencies Management
```bash
# Add new dependency
pip install package-name
pip freeze > requirements.txt

# Update dependencies
pip install -r requirements.txt --upgrade
```

## Customization

### Adding New Extraction Patterns
Edit `utils/extractors.py`:

```python
# Add new regex pattern
self.custom_pattern = re.compile(r'your-regex-here')

# Add extraction method
def extract_custom_data(self, text: str) -> List[Dict]:
    matches = self.custom_pattern.findall(text)
    # Process matches...
    return results
```

### Styling Customization
Edit CSS variables in `static/css/style.css`:

```css
:root {
    --color-primary-accent: #your-color;
    --font-primary: 'Your-Font', monospace;
}
```

### Adding New Animations
Edit `static/js/animations.js`:

```javascript
// Add custom animation
setupCustomAnimation() {
    gsap.from('.your-element', {
        duration: 1,
        opacity: 0,
        y: 50
    });
}
```

## Performance Optimization

### Backend
- Input size limits (1MB text, 16MB files)
- Session-based result caching
- File processing limits (100 PDF pages, 10k Excel rows)

### Frontend
- WebGL fallbacks for older devices
- Animation performance monitoring
- Lazy loading for large result sets

## Security Features

### Input Validation
- XSS prevention
- File type validation
- Size limit enforcement
- Input sanitization

### API Security
- CORS configuration
- Rate limiting ready
- Session management
- Error handling

## Browser Support

### Minimum Requirements
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Optional Features
- WebGL for 3D effects
- ES6+ for modern JavaScript
- CSS Grid for layout

## Troubleshooting

### Common Issues

**Dependencies not installing:**
```bash
# Update pip first
pip install --upgrade pip
# Try installing without pandas if it fails
pip install -r requirements.txt --no-deps
```

**WebGL effects not working:**
- Check browser WebGL support at `chrome://gpu/`
- Disable effects in `effects.js` if needed

**File upload failing:**
- Check file size (max 16MB)
- Verify file type support
- Check server logs for errors

### Debug Mode
Set `debug=True` in `app.py` for detailed error messages.

## Contributing

### Code Style
- Follow PEP 8 for Python
- Use meaningful variable names
- Add docstrings to functions
- Comment complex regex patterns

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature
```

## Future Enhancements

### Planned Features
- [ ] Machine learning name extraction
- [ ] Advanced file format support
- [ ] Real-time collaboration
- [ ] API key authentication
- [ ] Database storage
- [ ] Docker containerization

### Performance Improvements
- [ ] Redis caching
- [ ] Async file processing
- [ ] CDN integration
- [ ] Service worker caching

---

**Built with ❤️ using Python Flask, Vanilla JavaScript, Three.js, and GSAP**