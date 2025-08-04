/**
 * PatternHive - Results Page Logic
 * Handles result display, filtering, and export functionality
 */

class ResultsPage {
    constructor() {
        this.sessionId = null;
        this.currentResults = null;
        this.currentFilter = 'all';
        
        // DOM elements
        this.elements = {
            // Session info
            sessionId: document.getElementById('session-id'),
            processedTime: document.getElementById('processed-time'),
            filename: document.getElementById('filename'),
            filenameItem: document.getElementById('filename-item'),
            
            // Statistics
            emailCount: document.getElementById('email-count'),
            phoneCount: document.getElementById('phone-count'),
            nameCount: document.getElementById('name-count'),
            
            // Badges
            emailBadge: document.getElementById('email-badge'),
            phoneBadge: document.getElementById('phone-badge'),
            nameBadge: document.getElementById('name-badge'),
            
            // Result grids
            emailGrid: document.getElementById('email-grid'),
            phoneGrid: document.getElementById('phone-grid'),
            nameGrid: document.getElementById('name-grid'),
            
            // Categories
            emailResults: document.getElementById('email-results'),
            phoneResults: document.getElementById('phone-results'),
            nameResults: document.getElementById('name-results'),
            
            // Controls
            filterButtons: document.querySelectorAll('.filter-btn'),
            exportJsonBtn: document.getElementById('export-json-btn'),
            exportCsvBtn: document.getElementById('export-csv-btn'),
            exportReportBtn: document.getElementById('export-report-btn'),
            printResultsBtn: document.getElementById('print-results-btn'),
            
            // States
            loadingOverlay: document.getElementById('loading-overlay'),
            emptyState: document.getElementById('empty-state'),
            resultsSection: document.getElementById('results-section'),
            exportSection: document.getElementById('export-section'),
            notificationContainer: document.getElementById('notification-container')
        };
        
        this.init();
    }
    
    init() {
        this.getSessionIdFromUrl();
        this.setupEventListeners();
        this.loadResults();
        
        console.log('Results page initialized');
    }
    
    getSessionIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.sessionId = urlParams.get('session');
        
        if (!this.sessionId) {
            this.showEmptyState();
            return;
        }
        
        this.elements.sessionId.textContent = this.sessionId;
    }
    
    setupEventListeners() {
        // Filter buttons
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn.dataset.filter));
        });
        
        // Export buttons
        this.elements.exportJsonBtn.addEventListener('click', () => this.exportData('json'));
        this.elements.exportCsvBtn.addEventListener('click', () => this.exportData('csv'));
        this.elements.exportReportBtn.addEventListener('click', () => this.exportData('report'));
        
        // Print button
        this.elements.printResultsBtn.addEventListener('click', () => this.printResults());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'p':
                        e.preventDefault();
                        this.printResults();
                        break;
                    case 's':
                        e.preventDefault();
                        this.exportData('json');
                        break;
                }
            }
        });
    }
    
    async loadResults() {
        if (!this.sessionId) return;
        
        this.showLoading();
        
        try {
            // Try to get results from localStorage first (for recently processed data)
            const cachedResults = localStorage.getItem(`patternhive_session_${this.sessionId}`);
            
            if (cachedResults) {
                const data = JSON.parse(cachedResults);
                this.displayResults(data.results, data.stats, data.filename);
                this.elements.processedTime.textContent = new Date(data.timestamp).toLocaleString();
                if (data.filename) {
                    this.elements.filename.textContent = data.filename;
                    this.elements.filenameItem.style.display = 'flex';
                }
            } else {
                // If not cached, show message about session expiry
                this.showEmptyState();
                this.showNotification('Session data not found. Results are only available during the current browser session.', 'warning');
                return;
            }
            
        } catch (error) {
            console.error('Error loading results:', error);
            this.showNotification('Error loading results: ' + error.message, 'error');
            this.showEmptyState();
        } finally {
            this.hideLoading();
        }
    }
    
    displayResults(results, stats, filename = null) {
        this.currentResults = results;
        
        // Update statistics
        this.animateCounter(this.elements.emailCount, stats.emails_found);
        this.animateCounter(this.elements.phoneCount, stats.phones_found);
        this.animateCounter(this.elements.nameCount, stats.names_found);
        
        // Update badges
        this.elements.emailBadge.textContent = stats.emails_found;
        this.elements.phoneBadge.textContent = stats.phones_found;
        this.elements.nameBadge.textContent = stats.names_found;
        
        // Display results
        this.displayEmailResults(results.emails);
        this.displayPhoneResults(results.phones);
        this.displayNameResults(results.names);
        
        // Show results section
        this.elements.emptyState.style.display = 'none';
        this.elements.resultsSection.style.display = 'block';
        this.elements.exportSection.style.display = 'block';
        
        // Set up animations
        this.setupResultAnimations();
    }
    
    displayEmailResults(emails) {
        this.elements.emailGrid.innerHTML = '';
        
        if (emails.length === 0) {
            this.elements.emailResults.style.display = 'none';
            return;
        }
        
        this.elements.emailResults.style.display = 'block';
        
        emails.forEach((email, index) => {
            const card = this.createResultCard({
                value: email.email,
                meta: email.domain,
                status: email.valid ? 'valid' : 'invalid',
                type: 'email'
            });
            
            card.style.animationDelay = `${index * 0.1}s`;
            this.elements.emailGrid.appendChild(card);
        });
    }
    
    displayPhoneResults(phones) {
        this.elements.phoneGrid.innerHTML = '';
        
        if (phones.length === 0) {
            this.elements.phoneResults.style.display = 'none';
            return;
        }
        
        this.elements.phoneResults.style.display = 'block';
        
        phones.forEach((phone, index) => {
            const card = this.createResultCard({
                value: phone.formatted,
                meta: phone.country || 'Unknown',
                status: phone.valid ? 'valid' : 'invalid',
                type: 'phone'
            });
            
            card.style.animationDelay = `${index * 0.1}s`;
            this.elements.phoneGrid.appendChild(card);
        });
    }
    
    displayNameResults(names) {
        this.elements.nameGrid.innerHTML = '';
        
        if (names.length === 0) {
            this.elements.nameResults.style.display = 'none';
            return;
        }
        
        this.elements.nameResults.style.display = 'block';
        
        names.forEach((name, index) => {
            const card = this.createResultCard({
                value: name.name,
                meta: name.type.replace('_', ' '),
                confidence: name.confidence,
                type: 'name'
            });
            
            card.style.animationDelay = `${index * 0.1}s`;
            this.elements.nameGrid.appendChild(card);
        });
    }
    
    createResultCard({ value, meta, status, confidence, type }) {
        const card = document.createElement('div');
        card.className = 'result-card hover-glow';
        card.dataset.type = type;
        
        let statusBadge = '';
        let confidenceBar = '';
        
        if (status) {
            const statusClass = status === 'valid' ? 'status-valid' : 'status-invalid';
            const statusText = status === 'valid' ? '✓ Valid' : '✗ Invalid';
            statusBadge = `<span class="result-status ${statusClass}">${statusText}</span>`;
        }
        
        if (confidence !== undefined) {
            const confidencePercent = Math.round(confidence * 100);
            confidenceBar = `
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
                </div>
                <span class="result-status">${confidencePercent}% confidence</span>
            `;
        }
        
        card.innerHTML = `
            <div class="result-value">${this.escapeHtml(value)}</div>
            <div class="result-meta">
                <span>${this.escapeHtml(meta)}</span>
                ${statusBadge}
            </div>
            ${confidenceBar}
        `;
        
        return card;
    }
    
    handleFilter(filterType) {
        this.currentFilter = filterType;
        
        // Update active filter button
        this.elements.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filterType);
        });
        
        // Filter results
        if (filterType === 'all') {
            this.elements.emailResults.style.display = 'block';
            this.elements.phoneResults.style.display = 'block';
            this.elements.nameResults.style.display = 'block';
        } else {
            this.elements.emailResults.style.display = filterType === 'emails' ? 'block' : 'none';
            this.elements.phoneResults.style.display = filterType === 'phones' ? 'block' : 'none';
            this.elements.nameResults.style.display = filterType === 'names' ? 'block' : 'none';
        }
        
        // Animate filtered results
        this.animateFilteredResults();
        
        // Show notification
        const filterNames = { 
            all: 'All Results', 
            emails: 'Email Addresses', 
            phones: 'Phone Numbers', 
            names: 'Names' 
        };
        this.showNotification(`Showing: ${filterNames[filterType]}`, 'success');
    }
    
    async exportData(format) {
        if (!this.sessionId) {
            this.showNotification('No data to export', 'warning');
            return;
        }
        
        try {
            const url = `/api/export/${format}/${this.sessionId}`;
            
            if (format === 'json') {
                // For JSON, create and download from cached data
                const jsonString = JSON.stringify(this.currentResults, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                this.downloadBlob(blob, `extracted_data_${this.sessionId}.json`);
            } else {
                // For CSV and report, try the API endpoint
                const link = document.createElement('a');
                link.href = url;
                link.download = `extracted_data_${this.sessionId}.${format === 'report' ? 'txt' : format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            this.showNotification(`Results exported as ${format.toUpperCase()}`, 'success');
            
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Error exporting data', 'error');
        }
    }
    
    printResults() {
        window.print();
    }
    
    setupResultAnimations() {
        // Animate result cards entrance
        const cards = document.querySelectorAll('.result-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    
    animateFilteredResults() {
        const visibleCards = document.querySelectorAll('.result-card');
        visibleCards.forEach((card, index) => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transition = 'transform 0.3s ease-out';
                card.style.transform = 'scale(1)';
            }, index * 25);
        });
    }
    
    showLoading() {
        this.elements.loadingOverlay.classList.remove('hidden');
    }
    
    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    }
    
    showEmptyState() {
        this.elements.emptyState.style.display = 'block';
        this.elements.resultsSection.style.display = 'none';
        this.elements.exportSection.style.display = 'none';
        this.hideLoading();
    }
    
    animateCounter(element, targetValue) {
        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        this.elements.notificationContainer.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
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

// Initialize results page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resultsPage = new ResultsPage();
});