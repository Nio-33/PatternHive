document.addEventListener('DOMContentLoaded', async () => {
    const sessionIdEl = document.getElementById('session-id');
    const statsGridEl = document.getElementById('stats-grid');
    const filterControlsEl = document.getElementById('filter-controls');
    const resultsContainerEl = document.getElementById('results-container');
    const emptyStateEl = document.getElementById('empty-state');

    // Get session ID from localStorage (set by homepage)
    const sessionId = localStorage.getItem('patternhive_session');
    const filename = localStorage.getItem('patternhive_filename');
    const textInput = localStorage.getItem('patternhive_text_input');

    if (!sessionId) {
        showEmptyState();
        return;
    }

    // Session ID element removed from display

    try {
        // Fetch results from backend using session
        const response = await fetch(`/api/export/json/${sessionId}`);
        
        if (!response.ok) {
            throw new Error('Session not found or expired');
        }
        
        const results = await response.json();
        
        // Display results
        displayStats(results, filename, textInput);
        displayResults(results);
        setupFilters();
        setupExportButtons(sessionId);
        
    } catch (error) {
        console.error('Error loading results:', error);
        showEmptyState();
    }

    function displayStats(results, filename, textInput) {
        // Display stats grid with clean minimal styling
        statsGridEl.innerHTML = `
            <div class="data-card text-center floating">
                <div class="text-3xl mb-4">📧</div>
                <h3 class="text-xl font-orbitron">${results.emails ? results.emails.length : 0} Emails</h3>
            </div>
            <div class="data-card text-center floating" style="animation-delay: 1s;">
                <div class="text-3xl mb-4">📞</div>
                <h3 class="text-xl font-orbitron">${results.phones ? results.phones.length : 0} Phone Numbers</h3>
            </div>
            <div class="data-card text-center floating" style="animation-delay: 2s;">
                <div class="text-3xl mb-4">👤</div>
                <h3 class="text-xl font-orbitron">${results.names ? results.names.length : 0} Names</h3>
            </div>
        `;
        
        // Display source info
        const sourceInfo = filename ? `File: ${filename}` : 'Text Input';
        const sourceElement = document.createElement('div');
        sourceElement.className = 'text-center mb-8 text-cool-gray floating-source';
        sourceElement.innerHTML = `<p>📄 Source: <span class="text-ice-white">${sourceInfo}</span></p>`;
        statsGridEl.parentNode.insertBefore(sourceElement, statsGridEl.nextSibling);
    }

    function displayResults(results) {
        let html = '';
        
        // Emails section
        if (results.emails && results.emails.length > 0) {
            html += `
                <div class="results-section mb-8" data-type="emails">
                    <h3 class="text-2xl font-orbitron mb-4 text-electric-blue">📧 Email Addresses</h3>
                    <div class="grid gap-4">
            `;
            
            results.emails.forEach((email, index) => {
                const emailValue = typeof email === 'object' ? email.email : email;
                const domain = typeof email === 'object' ? email.domain : '';
                const valid = typeof email === 'object' ? email.valid : true;
                const validityText = valid ? 'Valid' : 'Invalid';
                const validityClass = valid ? 'high' : 'low';
                html += `
                    <div class="bg-slate border border-translucent-blue rounded-lg p-4 hover:border-electric-blue transition-colors">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-mono text-ice-white">${emailValue}</span>
                                ${domain ? `<div class="text-xs text-cool-gray mt-1">Domain: ${domain}</div>` : ''}
                            </div>
                            <span class="text-xs px-2 py-1 rounded-full ${getConfidenceBadgeClass(validityClass)}">${validityText}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        // Phones section
        if (results.phones && results.phones.length > 0) {
            html += `
                <div class="results-section mb-8" data-type="phones">
                    <h3 class="text-2xl font-orbitron mb-4 text-electric-blue">📞 Phone Numbers</h3>
                    <div class="grid gap-4">
            `;
            
            results.phones.forEach((phone, index) => {
                const phoneValue = typeof phone === 'object' ? phone.formatted : phone;
                const country = typeof phone === 'object' ? phone.country : '';
                const valid = typeof phone === 'object' ? phone.valid : true;
                const validityText = valid ? 'Valid' : 'Unverified';
                const validityClass = valid ? 'high' : 'medium';
                html += `
                    <div class="bg-slate border border-translucent-blue rounded-lg p-4 hover:border-electric-blue transition-colors">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-mono text-ice-white">${phoneValue}</span>
                                ${country ? `<div class="text-xs text-cool-gray mt-1">Country: ${country}</div>` : ''}
                            </div>
                            <span class="text-xs px-2 py-1 rounded-full ${getConfidenceBadgeClass(validityClass)}">${validityText}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        // Names section
        if (results.names && results.names.length > 0) {
            html += `
                <div class="results-section mb-8" data-type="names">
                    <h3 class="text-2xl font-orbitron mb-4 text-electric-blue">👤 Full Names</h3>
                    <div class="grid gap-4">
            `;
            
            results.names.forEach((name, index) => {
                const nameValue = typeof name === 'object' ? name.name : name;
                const confidence = typeof name === 'object' ? name.confidence : 0.5;
                const nameType = typeof name === 'object' ? name.type : 'unknown';
                const confidenceText = confidence >= 0.8 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low';
                const confidenceClass = confidence >= 0.8 ? 'high' : confidence >= 0.5 ? 'medium' : 'low';
                html += `
                    <div class="bg-slate border border-translucent-blue rounded-lg p-4 hover:border-electric-blue transition-colors">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-mono text-ice-white">${nameValue}</span>
                                <div class="text-xs text-cool-gray mt-1">Type: ${nameType.replace('_', ' ')} | Confidence: ${(confidence * 100).toFixed(0)}%</div>
                            </div>
                            <span class="text-xs px-2 py-1 rounded-full ${getConfidenceBadgeClass(confidenceClass)}">${confidenceText}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        if (html === '') {
            html = `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-2xl font-orbitron mb-2">No Data Extracted</h3>
                    <p class="text-cool-gray">No emails, phone numbers, or names were found in the processed content.</p>
                </div>
            `;
        }
        
        resultsContainerEl.innerHTML = html;
    }

    function getConfidenceBadgeClass(confidence) {
        const confLower = typeof confidence === 'string' ? confidence.toLowerCase() : confidence;
        switch (confLower) {
            case 'high':
                return 'bg-neon-green text-charcoal';
            case 'medium':
                return 'bg-amber-glow text-charcoal';
            case 'low':
            case 'estimated':
                return 'bg-cool-gray text-charcoal';
            default:
                return 'bg-translucent-blue text-ice-white';
        }
    }

    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const resultsSections = document.querySelectorAll('.results-section');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                
                // Show/hide sections based on filter
                resultsSections.forEach(section => {
                    if (filter === 'all' || section.dataset.type === filter) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
            });
        });
    }

    function setupExportButtons(sessionId) {
        // Add export buttons after filter controls
        const filterSection = filterControlsEl.parentElement;
        const exportSection = document.createElement('section');
        exportSection.className = 'text-center mb-8';
        exportSection.innerHTML = `
            <h3 class="text-xl font-orbitron mb-4">Export Results</h3>
            <div class="flex flex-wrap justify-center gap-4 mb-6">
                <button id="export-csv" class="export-btn floating-export-csv">📄 Download CSV</button>
                <button id="export-json" class="export-btn floating-export-json">📋 Download JSON</button>
            </div>
            <div class="text-center">
                <a href="/" class="text-electric-blue hover:underline text-sm">&larr; Back to Home</a>
            </div>
        `;
        
        filterSection.parentNode.insertBefore(exportSection, filterSection.nextSibling);
        
        // Add export functionality
        document.getElementById('export-csv').addEventListener('click', () => {
            window.location.href = `/api/export/csv/${sessionId}`;
        });
        
        document.getElementById('export-json').addEventListener('click', () => {
            window.location.href = `/api/export/json/${sessionId}`;
        });
    }

    function showEmptyState() {
        statsGridEl.style.display = 'none';
        filterControlsEl.parentElement.style.display = 'none';
        resultsContainerEl.style.display = 'none';
        emptyStateEl.classList.remove('hidden');
    }

    // Add export button styles
    const style = document.createElement('style');
    style.textContent = `
        .export-btn {
            font-family: 'Orbitron', sans-serif;
            padding: 0.8rem 1.8rem;
            background: transparent;
            color: #4AE3EC;
            border: 1px solid #4AE3EC;
            border-radius: 50px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .export-btn:hover {
            background: #4AE3EC10;
            box-shadow: 0 0 15px #4AE3EC20;
        }

        /* Individual floating animations for export buttons */
        .floating-export-csv {
            animation: float 10s ease-in-out infinite;
            animation-delay: 0s;
        }

        .floating-export-json {
            animation: float 12s ease-in-out infinite;
            animation-delay: 1.5s;
        }
        
        .results-section {
            margin-bottom: 3rem;
        }
    `;
    document.head.appendChild(style);
});
