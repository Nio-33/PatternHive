/**
 * PatternHive - Main Application Logic
 * Handles UI interactions, API calls, and data processing
 */

class PatternHive {
    constructor() {
        this.currentSession = null;
        this.currentResults = null;
        this.isProcessing = false;
        
        // DOM elements
        this.elements = {
            // Tabs
            textTab: document.getElementById('text-tab'),
            fileTab: document.getElementById('file-tab'),
            textPanel: document.getElementById('text-panel'),
            filePanel: document.getElementById('file-panel'),
            
            // Input elements
            textInput: document.getElementById('text-input'),
            fileInput: document.getElementById('file-input'),
            uploadArea: document.getElementById('upload-area'),
            uploadProgress: document.getElementById('upload-progress'),
            progressFill: document.querySelector('.progress-fill'),
            progressText: document.querySelector('.progress-text'),
            
            // Buttons
            processTextBtn: document.getElementById('process-text-btn'),
            clearTextBtn: document.getElementById('clear-text-btn'),
            exportJsonBtn: document.getElementById('export-json-btn'),
            exportCsvBtn: document.getElementById('export-csv-btn'),
            exportReportBtn: document.getElementById('export-report-btn'),
            
            // Results
            statsGrid: document.getElementById('stats-grid'),
            emailCount: document.getElementById('email-count'),
            phoneCount: document.getElementById('phone-count'),
            nameCount: document.getElementById('name-count'),
            resultsSection: document.getElementById('results-section'),
            resultsContainer: document.getElementById('results-container'),
            exportSection: document.getElementById('export-section'),
            emptyState: document.getElementById('empty-state'),
            
            // Processing status
            processingStatus: document.getElementById('processing-status'),
            
            // Overlays
            loadingOverlay: document.getElementById('loading-overlay'),
            notificationContainer: document.getElementById('notification-container')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupRealTimeProcessing();
        console.log('PatternHive initialized successfully');
    }
    
    setupEventListeners() {
        // Tab switching
        this.elements.textTab.addEventListener('click', () => this.switchTab('text'));
        this.elements.fileTab.addEventListener('click', () => this.switchTab('file'));
        
        // Text processing
        this.elements.processTextBtn.addEventListener('click', () => this.processText());
        this.elements.clearTextBtn.addEventListener('click', () => this.clearText());
        
        // File processing
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.elements.uploadArea.addEventListener('click', () => this.elements.fileInput.click());
        
        // Remove export button listeners (they're on the results page now)
        
        // Remove stat card listeners (they're on the results page now)
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.processText();
                        break;
                    case 'Delete':
                    case 'Backspace':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.clearText();
                        }
                        break;
                }
            }
        });
    }
    
    setupDragAndDrop() {
        const uploadArea = this.elements.uploadArea;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            });
        });
        
        uploadArea.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
    }
    
    setupRealTimeProcessing() {
        let timeout;
        this.elements.textInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const text = this.elements.textInput.value.trim();
                if (text.length > 50) { // Only process if substantial content
                    this.processText(true); // Silent processing
                }
            }, 1000); // Debounce for 1 second
        });
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        if (tabName === 'text') {
            this.elements.textTab.classList.add('active');
            this.elements.textTab.setAttribute('aria-selected', 'true');
            this.elements.textPanel.classList.add('active');
        } else {
            this.elements.fileTab.classList.add('active');
            this.elements.fileTab.setAttribute('aria-selected', 'true');
            this.elements.filePanel.classList.add('active');
        }
    }
    
    async processText(silent = false) {
        const text = this.elements.textInput.value.trim();
        
        if (!text) {
            if (!silent) {
                this.showNotification('Please enter some text', 'warning');
            }
            return;
        }
        
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        if (!silent) {
            this.showLoading();
            this.updateButtonState(this.elements.processTextBtn, true);
        }
        
        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.currentSession = data.session_id;
            this.currentResults = data.results;
            
            // Cache results for the results page
            this.cacheResults(data.session_id, data.results, data.stats);
            
            // Redirect to results page
            this.redirectToResults(data.session_id);
            
            if (!silent) {
                this.showNotification('Text processed successfully!', 'success');
            }
            
        } catch (error) {
            console.error('Error processing text:', error);
            if (!silent) {
                this.showNotification('Error processing text: ' + error.message, 'error');
            }
        } finally {
            this.isProcessing = false;
            if (!silent) {
                this.hideLoading();
                this.updateButtonState(this.elements.processTextBtn, false);
            }
        }
    }
    
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleFileUpload(file);
        }
    }
    
    async handleFileUpload(file) {
        if (this.isProcessing) return;
        
        // Validate file size
        if (file.size > 16 * 1024 * 1024) {
            this.showNotification('File too large. Maximum size is 16MB.', 'error');
            return;
        }
        
        // Validate file type
        const allowedTypes = ['.txt', '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.csv'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExt)) {
            this.showNotification('Unsupported file type. Please use: ' + allowedTypes.join(', '), 'error');
            return;
        }
        
        this.isProcessing = true;
        this.showUploadProgress();
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.currentSession = data.session_id;
            this.currentResults = data.results;
            
            // Cache results for the results page
            this.cacheResults(data.session_id, data.results, data.stats, data.filename);
            
            // Redirect to results page
            this.redirectToResults(data.session_id);
            
            this.showNotification(`File "${data.filename}" processed successfully!`, 'success');
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.showNotification('Error processing file: ' + error.message, 'error');
        } finally {
            this.isProcessing = false;
            this.hideUploadProgress();
            // Clear file input
            this.elements.fileInput.value = '';
        }
    }
    
    cacheResults(sessionId, results, stats, filename = null) {
        // Store results in localStorage for the results page
        const cacheData = {
            results: results,
            stats: stats,
            timestamp: new Date().toISOString(),
            filename: filename
        };
        
        localStorage.setItem(`patternhive_session_${sessionId}`, JSON.stringify(cacheData));
    }
    
    redirectToResults(sessionId) {
        // Show processing status briefly before redirect
        this.elements.emptyState.style.display = 'none';
        this.elements.processingStatus.style.display = 'block';
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
            window.location.href = `/results?session=${sessionId}`;
        }, 1500);
    }
    
    clearText() {
        this.elements.textInput.value = '';
        this.elements.processingStatus.style.display = 'none';
        this.elements.emptyState.style.display = 'block';
        this.showNotification('Text cleared', 'success');
    }
    
    showLoading() {
        this.elements.loadingOverlay.classList.remove('hidden');
    }
    
    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    }
    
    showUploadProgress() {
        this.elements.uploadProgress.classList.remove('hidden');
        this.elements.progressFill.style.width = '0%';
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            this.elements.progressFill.style.width = progress + '%';
            
            if (progress >= 90) {
                clearInterval(interval);
            }
        }, 200);
    }
    
    hideUploadProgress() {
        this.elements.progressFill.style.width = '100%';
        setTimeout(() => {
            this.elements.uploadProgress.classList.add('hidden');
        }, 500);
    }
    
    updateButtonState(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = `
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <span>Processing...</span>
            `;
        } else {
            button.disabled = false;
            button.innerHTML = `
                <span class="btn-icon">⚡</span>
                <span class="btn-text">Process Text</span>
                <div class="btn-glow"></div>
            `;
        }
    }
    
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        this.elements.notificationContainer.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.patternHive = new PatternHive();
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Skip service worker for now
        console.log('PatternHive ready for service worker registration');
    });
}