// AI Health Scanner Application JavaScript

class HealthScanner {
    constructor() {
        this.videoElement = document.getElementById('videoElement');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.overlayContext = this.overlayCanvas.getContext('2d');
        this.mediaStream = null;
        this.faceDetectionInterval = null;
        this.scanningInterval = null;
        this.isScanning = false;
        this.faceDetected = false;
        
        // Health metrics data
        this.healthData = {
            "healthMetrics": [
                {"name": "Heart Rate", "unit": "BPM", "icon": "❤️", "normalRange": "60-100"},
                {"name": "Blood Pressure", "unit": "mmHg", "icon": "🩸", "normalRange": "120/80"},
                {"name": "Stress Level", "unit": "level", "icon": "🧠", "categories": ["Low", "Medium", "High"]},
                {"name": "Oxygen Saturation", "unit": "%", "icon": "🫁", "normalRange": "95-100"},
                {"name": "Breathing Rate", "unit": "BPM", "icon": "💨", "normalRange": "12-20"},
                {"name": "Body Temperature", "unit": "°F", "icon": "🌡️", "normalRange": "97-99"},
                {"name": "Skin Health", "unit": "score", "icon": "✨", "normalRange": "7-10"},
                {"name": "Estimated Age", "unit": "years", "icon": "👤", "note": "AI estimation"}
            ],
            "riskFactors": ["Cardiovascular Disease", "Hypertension", "Diabetes", "Stress-related Disorders"],
            "disclaimers": ["This is a demonstration application only", "Not intended for medical diagnosis", "Consult healthcare professionals for medical advice", "Results are simulated for educational purposes"],
            "recommendations": ["Maintain regular exercise routine", "Follow a balanced diet", "Get adequate sleep (7-9 hours)", "Manage stress through relaxation techniques", "Stay hydrated", "Regular medical check-ups"]
        };
        
        // Bind methods to preserve 'this' context
        this.showScanningSection = this.showScanningSection.bind(this);
        this.showResultsSection = this.showResultsSection.bind(this);
        this.showLandingSection = this.showLandingSection.bind(this);
        this.startCamera = this.startCamera.bind(this);
        this.stopCamera = this.stopCamera.bind(this);
        this.beginAnalysis = this.beginAnalysis.bind(this);
        this.showReportModal = this.showReportModal.bind(this);
        this.hideReportModal = this.hideReportModal.bind(this);
        this.startNewScan = this.startNewScan.bind(this);
        
        this.init();
    }
    
    init() {
        console.log('Initializing HealthScanner...');
        this.setupEventListeners();
        this.setupCanvas();
        console.log('HealthScanner initialized successfully');
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation buttons
        const startScanBtn = document.getElementById('startScanBtn');
        if (startScanBtn) {
            startScanBtn.addEventListener('click', this.showScanningSection);
            console.log('Start scan button listener added');
        } else {
            console.error('Start scan button not found!');
        }
        
        const startCameraBtn = document.getElementById('startCameraBtn');
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', this.startCamera);
        }
        
        const stopCameraBtn = document.getElementById('stopCameraBtn');
        if (stopCameraBtn) {
            stopCameraBtn.addEventListener('click', this.stopCamera);
        }
        
        const beginAnalysisBtn = document.getElementById('beginAnalysisBtn');
        if (beginAnalysisBtn) {
            beginAnalysisBtn.addEventListener('click', this.beginAnalysis);
        }
        
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', this.showReportModal);
        }
        
        const newScanBtn = document.getElementById('newScanBtn');
        if (newScanBtn) {
            newScanBtn.addEventListener('click', this.startNewScan);
        }
        
        // Modal controls
        const closeReportModal = document.getElementById('closeReportModal');
        if (closeReportModal) {
            closeReportModal.addEventListener('click', this.hideReportModal);
        }
        
        const closeReportModalBtn = document.getElementById('closeReportModalBtn');
        if (closeReportModalBtn) {
            closeReportModalBtn.addEventListener('click', this.hideReportModal);
        }
        
        // Click outside modal to close
        const reportModal = document.getElementById('reportModal');
        if (reportModal) {
            reportModal.addEventListener('click', (e) => {
                if (e.target.id === 'reportModal') {
                    this.hideReportModal();
                }
            });
        }
        
        console.log('Event listeners setup complete');
    }
    
    setupCanvas() {
        if (this.overlayCanvas) {
            // Set canvas size to match video dimensions
            this.overlayCanvas.width = 640;
            this.overlayCanvas.height = 480;
            console.log('Canvas setup complete');
        }
    }
    
    showScanningSection() {
        console.log('Showing scanning section...');
        
        const landingSection = document.getElementById('landingSection');
        const scanningSection = document.getElementById('scanningSection');
        const resultsSection = document.getElementById('resultsSection');
        
        if (landingSection) landingSection.classList.add('hidden');
        if (scanningSection) scanningSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
        
        console.log('Scanning section displayed');
    }
    
    showResultsSection() {
        console.log('Showing results section...');
        
        const landingSection = document.getElementById('landingSection');
        const scanningSection = document.getElementById('scanningSection');
        const resultsSection = document.getElementById('resultsSection');
        
        if (landingSection) landingSection.classList.add('hidden');
        if (scanningSection) scanningSection.classList.add('hidden');
        if (resultsSection) resultsSection.classList.remove('hidden');
        
        this.displayResults();
        console.log('Results section displayed');
    }
    
    showLandingSection() {
        console.log('Showing landing section...');
        
        const landingSection = document.getElementById('landingSection');
        const scanningSection = document.getElementById('scanningSection');
        const resultsSection = document.getElementById('resultsSection');
        
        if (landingSection) landingSection.classList.remove('hidden');
        if (scanningSection) scanningSection.classList.add('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
        
        console.log('Landing section displayed');
    }
    
    async startCamera() {
        console.log('Starting camera...');
        
        try {
            // Update UI immediately
            this.updateCameraStatus('Requesting permission...');
            
            // Request camera access
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });
            
            // Setup video stream
            if (this.videoElement) {
                this.videoElement.srcObject = this.mediaStream;
                this.videoElement.classList.remove('hidden');
            }
            
            const cameraPlaceholder = document.getElementById('cameraPlaceholder');
            if (cameraPlaceholder) {
                cameraPlaceholder.classList.add('hidden');
            }
            
            // Update controls
            const startCameraBtn = document.getElementById('startCameraBtn');
            const stopCameraBtn = document.getElementById('stopCameraBtn');
            const beginAnalysisBtn = document.getElementById('beginAnalysisBtn');
            
            if (startCameraBtn) startCameraBtn.classList.add('hidden');
            if (stopCameraBtn) stopCameraBtn.classList.remove('hidden');
            if (beginAnalysisBtn) beginAnalysisBtn.classList.remove('hidden');
            
            // Update status
            this.updateCameraStatus('Active');
            this.updateFaceStatus('Detecting...');
            
            // Start face detection
            this.startFaceDetection();
            
            console.log('Camera started successfully');
            
        } catch (error) {
            console.error('Camera access denied or error:', error);
            this.updateCameraStatus('Access denied');
            this.showCameraError();
        }
    }
    
    stopCamera() {
        console.log('Stopping camera...');
        
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        // Reset UI
        if (this.videoElement) {
            this.videoElement.classList.add('hidden');
        }
        
        const cameraPlaceholder = document.getElementById('cameraPlaceholder');
        if (cameraPlaceholder) {
            cameraPlaceholder.classList.remove('hidden');
        }
        
        const startCameraBtn = document.getElementById('startCameraBtn');
        const stopCameraBtn = document.getElementById('stopCameraBtn');
        const beginAnalysisBtn = document.getElementById('beginAnalysisBtn');
        const faceDetectionIndicator = document.getElementById('faceDetectionIndicator');
        
        if (startCameraBtn) startCameraBtn.classList.remove('hidden');
        if (stopCameraBtn) stopCameraBtn.classList.add('hidden');
        if (beginAnalysisBtn) {
            beginAnalysisBtn.classList.add('hidden');
            beginAnalysisBtn.disabled = true;
        }
        if (faceDetectionIndicator) faceDetectionIndicator.classList.add('hidden');
        
        // Clear canvas
        if (this.overlayContext) {
            this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        }
        
        // Stop detection
        this.stopFaceDetection();
        
        // Update status
        this.updateCameraStatus('Inactive');
        this.updateFaceStatus('Waiting');
        this.updateAnalysisStatus('No');
        
        this.faceDetected = false;
        console.log('Camera stopped');
    }
    
    startFaceDetection() {
        console.log('Starting face detection...');
        this.faceDetectionInterval = setInterval(() => {
            this.simulateFaceDetection();
        }, 500);
    }
    
    stopFaceDetection() {
        if (this.faceDetectionInterval) {
            clearInterval(this.faceDetectionInterval);
            this.faceDetectionInterval = null;
            console.log('Face detection stopped');
        }
    }
    
    simulateFaceDetection() {
        if (!this.overlayContext) return;
        
        // Simulate face detection with random success rate
        const detectionSuccess = Math.random() > 0.3; // 70% success rate
        
        this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        if (detectionSuccess && this.videoElement && this.videoElement.videoWidth > 0) {
            // Draw face detection rectangle
            const faceX = 160 + (Math.random() - 0.5) * 20; // Slight variation
            const faceY = 120 + (Math.random() - 0.5) * 20;
            const faceWidth = 320 + (Math.random() - 0.5) * 40;
            const faceHeight = 240 + (Math.random() - 0.5) * 30;
            
            this.overlayContext.strokeStyle = '#32A0CB';
            this.overlayContext.lineWidth = 3;
            this.overlayContext.strokeRect(faceX, faceY, faceWidth, faceHeight);
            
            // Draw corner markers
            this.drawCornerMarkers(faceX, faceY, faceWidth, faceHeight);
            
            // Draw facial landmarks
            this.drawFacialLandmarks(faceX, faceY, faceWidth, faceHeight);
            
            if (!this.faceDetected) {
                this.faceDetected = true;
                const faceDetectionIndicator = document.getElementById('faceDetectionIndicator');
                const beginAnalysisBtn = document.getElementById('beginAnalysisBtn');
                
                if (faceDetectionIndicator) faceDetectionIndicator.classList.remove('hidden');
                if (beginAnalysisBtn) beginAnalysisBtn.disabled = false;
                
                this.updateFaceStatus('Detected ✓');
                this.updateAnalysisStatus('Yes');
            }
        } else {
            if (this.faceDetected) {
                this.faceDetected = false;
                const faceDetectionIndicator = document.getElementById('faceDetectionIndicator');
                const beginAnalysisBtn = document.getElementById('beginAnalysisBtn');
                
                if (faceDetectionIndicator) faceDetectionIndicator.classList.add('hidden');
                if (beginAnalysisBtn) beginAnalysisBtn.disabled = true;
                
                this.updateFaceStatus('Detecting...');
                this.updateAnalysisStatus('No');
            }
        }
    }
    
    drawCornerMarkers(x, y, width, height) {
        const markerSize = 20;
        const cornerPositions = [
            [x, y], [x + width, y],
            [x, y + height], [x + width, y + height]
        ];
        
        this.overlayContext.strokeStyle = '#50B8C6';
        this.overlayContext.lineWidth = 4;
        
        cornerPositions.forEach(([cx, cy]) => {
            // Top-left corner style markers
            this.overlayContext.beginPath();
            this.overlayContext.moveTo(cx, cy);
            this.overlayContext.lineTo(cx + (cx === x ? markerSize : -markerSize), cy);
            this.overlayContext.moveTo(cx, cy);
            this.overlayContext.lineTo(cx, cy + (cy === y ? markerSize : -markerSize));
            this.overlayContext.stroke();
        });
    }
    
    drawFacialLandmarks(x, y, width, height) {
        // Draw simulated facial landmarks
        const landmarks = [
            // Eyes
            [x + width * 0.3, y + height * 0.35],
            [x + width * 0.7, y + height * 0.35],
            // Nose
            [x + width * 0.5, y + height * 0.55],
            // Mouth corners
            [x + width * 0.4, y + height * 0.75],
            [x + width * 0.6, y + height * 0.75],
        ];
        
        this.overlayContext.fillStyle = '#32A0CB';
        landmarks.forEach(([lx, ly]) => {
            this.overlayContext.beginPath();
            this.overlayContext.arc(lx, ly, 3, 0, 2 * Math.PI);
            this.overlayContext.fill();
        });
    }
    
    async beginAnalysis() {
        console.log('Beginning analysis...');
        
        if (!this.faceDetected || this.isScanning) {
            console.log('Cannot begin analysis: face not detected or already scanning');
            return;
        }
        
        this.isScanning = true;
        
        // Show scanning overlay
        const scanningOverlay = document.getElementById('scanningOverlay');
        if (scanningOverlay) {
            scanningOverlay.classList.remove('hidden');
        }
        
        // Stop face detection during scanning
        this.stopFaceDetection();
        
        // Start scanning animation
        await this.runScanningAnimation();
        
        // Complete scanning
        this.completeScan();
    }
    
    async runScanningAnimation() {
        console.log('Running scanning animation...');
        
        const progressFill = document.getElementById('progressFill');
        const scanningStatus = document.getElementById('scanningStatus');
        
        const steps = [
            { progress: 15, text: 'Initializing facial recognition...', duration: 800 },
            { progress: 30, text: 'Analyzing facial features...', duration: 1000 },
            { progress: 45, text: 'Detecting vital signs...', duration: 1200 },
            { progress: 60, text: 'Processing heart rate...', duration: 1000 },
            { progress: 75, text: 'Analyzing blood pressure...', duration: 1000 },
            { progress: 90, text: 'Computing health metrics...', duration: 800 },
            { progress: 100, text: 'Analysis complete!', duration: 500 }
        ];
        
        for (const step of steps) {
            if (progressFill) progressFill.style.width = `${step.progress}%`;
            if (scanningStatus) scanningStatus.textContent = step.text;
            await this.delay(step.duration);
        }
        
        console.log('Scanning animation complete');
    }
    
    completeScan() {
        console.log('Completing scan...');
        
        this.isScanning = false;
        
        // Hide scanning overlay
        const scanningOverlay = document.getElementById('scanningOverlay');
        if (scanningOverlay) {
            scanningOverlay.classList.add('hidden');
        }
        
        // Stop camera
        this.stopCamera();
        
        // Show results
        setTimeout(() => {
            this.showResultsSection();
        }, 500);
    }
    
    displayResults() {
        console.log('Displaying results...');
        
        // Generate and display health metrics
        const metrics = this.generateHealthMetrics();
        const overallScore = this.calculateOverallScore(metrics);
        
        // Update overall score
        const overallScoreElement = document.getElementById('overallScore');
        const scoreStatusElement = document.getElementById('scoreStatus');
        
        if (overallScoreElement) overallScoreElement.textContent = overallScore;
        if (scoreStatusElement) scoreStatusElement.textContent = this.getHealthStatus(overallScore);
        
        // Update score circle CSS variable
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.style.setProperty('--score', overallScore);
        }
        
        // Display metrics
        this.displayMetricsGrid(metrics);
        
        // Display risk factors
        this.displayRiskFactors(overallScore);
        
        // Display recommendations
        this.displayRecommendations();
        
        console.log('Results displayed successfully');
    }
    
    generateHealthMetrics() {
        const metrics = [];
        
        // Heart Rate
        metrics.push({
            name: 'Heart Rate',
            value: this.randomBetween(60, 100),
            unit: 'BPM',
            icon: '❤️',
            status: 'normal'
        });
        
        // Blood Pressure
        const systolic = this.randomBetween(110, 140);
        const diastolic = this.randomBetween(70, 90);
        metrics.push({
            name: 'Blood Pressure',
            value: `${systolic}/${diastolic}`,
            unit: 'mmHg',
            icon: '🩸',
            status: systolic > 130 ? 'warning' : 'normal'
        });
        
        // Stress Level
        const stressLevels = ['Low', 'Medium', 'High'];
        const stressLevel = stressLevels[Math.floor(Math.random() * stressLevels.length)];
        metrics.push({
            name: 'Stress Level',
            value: stressLevel,
            unit: '',
            icon: '🧠',
            status: stressLevel === 'Low' ? 'normal' : stressLevel === 'Medium' ? 'warning' : 'critical'
        });
        
        // Oxygen Saturation
        metrics.push({
            name: 'Oxygen Saturation',
            value: this.randomBetween(95, 100),
            unit: '%',
            icon: '🫁',
            status: 'normal'
        });
        
        // Breathing Rate
        metrics.push({
            name: 'Breathing Rate',
            value: this.randomBetween(12, 20),
            unit: 'BPM',
            icon: '💨',
            status: 'normal'
        });
        
        // Body Temperature
        const temp = (this.randomBetween(970, 990) / 10).toFixed(1);
        metrics.push({
            name: 'Body Temperature',
            value: temp,
            unit: '°F',
            icon: '🌡️',
            status: 'normal'
        });
        
        // Skin Health
        metrics.push({
            name: 'Skin Health',
            value: this.randomBetween(7, 10),
            unit: '/10',
            icon: '✨',
            status: 'normal'
        });
        
        // Estimated Age
        const baseAge = 25 + Math.floor(Math.random() * 40); // Random base age
        const variance = Math.floor(Math.random() * 11) - 5; // ±5 years
        metrics.push({
            name: 'Estimated Age',
            value: Math.max(18, baseAge + variance),
            unit: 'years',
            icon: '👤',
            status: 'normal'
        });
        
        return metrics;
    }
    
    displayMetricsGrid(metrics) {
        const grid = document.getElementById('metricsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        metrics.forEach(metric => {
            const card = document.createElement('div');
            card.className = 'metric-card';
            
            card.innerHTML = `
                <div class="metric-header">
                    <span class="metric-icon">${metric.icon}</span>
                    <h4 class="metric-name">${metric.name}</h4>
                </div>
                <div class="metric-value">
                    ${metric.value}<span class="metric-unit">${metric.unit}</span>
                </div>
                <div class="metric-status ${metric.status}">
                    ${metric.status === 'normal' ? '✓ Normal' : 
                      metric.status === 'warning' ? '⚠ Monitor' : '⚠ Attention'}
                </div>
            `;
            
            grid.appendChild(card);
        });
    }
    
    calculateOverallScore(metrics) {
        // Simulate overall health score calculation
        let score = 85; // Base score
        
        metrics.forEach(metric => {
            if (metric.status === 'warning') score -= 5;
            if (metric.status === 'critical') score -= 10;
        });
        
        return Math.max(60, Math.min(100, score));
    }
    
    getHealthStatus(score) {
        if (score >= 90) return 'Excellent Health';
        if (score >= 80) return 'Good Health';
        if (score >= 70) return 'Fair Health';
        return 'Needs Attention';
    }
    
    displayRiskFactors(overallScore) {
        const container = document.getElementById('riskFactors');
        if (!container) return;
        
        container.innerHTML = '';
        
        const riskLevels = ['Low', 'Medium', 'High'];
        
        this.healthData.riskFactors.forEach(factor => {
            // Risk level based on overall score and randomness
            let riskLevel;
            if (overallScore >= 85) {
                riskLevel = Math.random() > 0.8 ? 'Medium' : 'Low';
            } else if (overallScore >= 75) {
                riskLevel = Math.random() > 0.6 ? 'Medium' : 'Low';
            } else {
                riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
            }
            
            const riskElement = document.createElement('div');
            riskElement.className = `risk-factor ${riskLevel.toLowerCase()}`;
            
            riskElement.innerHTML = `
                <span class="risk-name">${factor}</span>
                <span class="risk-level ${riskLevel.toLowerCase()}">${riskLevel} Risk</span>
            `;
            
            container.appendChild(riskElement);
        });
    }
    
    displayRecommendations() {
        const container = document.getElementById('recommendationsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        const icons = ['🏃‍♂️', '🥗', '😴', '🧘‍♀️', '💧', '🏥'];
        
        this.healthData.recommendations.forEach((recommendation, index) => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            
            item.innerHTML = `
                <span class="recommendation-icon">${icons[index] || '💡'}</span>
                <p class="recommendation-text">${recommendation}</p>
            `;
            
            container.appendChild(item);
        });
    }
    
    showReportModal() {
        console.log('Showing report modal...');
        const reportModal = document.getElementById('reportModal');
        if (reportModal) {
            reportModal.classList.remove('hidden');
        }
    }
    
    hideReportModal() {
        console.log('Hiding report modal...');
        const reportModal = document.getElementById('reportModal');
        if (reportModal) {
            reportModal.classList.add('hidden');
        }
    }
    
    startNewScan() {
        console.log('Starting new scan...');
        
        // Reset all states
        this.faceDetected = false;
        this.isScanning = false;
        
        // Clear any intervals
        this.stopFaceDetection();
        
        // Reset progress
        const progressFill = document.getElementById('progressFill');
        const scanningStatus = document.getElementById('scanningStatus');
        
        if (progressFill) progressFill.style.width = '0%';
        if (scanningStatus) scanningStatus.textContent = 'Initializing...';
        
        // Show scanning section
        this.showScanningSection();
    }
    
    showCameraError() {
        const placeholder = document.getElementById('cameraPlaceholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="camera-icon">⚠️</div>
                <p>Camera access denied or unavailable</p>
                <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-8);">
                    Please enable camera permissions and try again
                </p>
            `;
        }
    }
    
    updateCameraStatus(status) {
        const cameraStatus = document.getElementById('cameraStatus');
        if (cameraStatus) cameraStatus.textContent = status;
    }
    
    updateFaceStatus(status) {
        const faceStatus = document.getElementById('faceStatus');
        if (faceStatus) faceStatus.textContent = status;
    }
    
    updateAnalysisStatus(status) {
        const analysisStatus = document.getElementById('analysisStatus');
        if (analysisStatus) analysisStatus.textContent = status;
    }
    
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global variable to store the instance
let healthScannerInstance = null;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing HealthScanner...');
    try {
        healthScannerInstance = new HealthScanner();
        window.healthScanner = healthScannerInstance; // Make it globally accessible
        console.log('HealthScanner instance created successfully');
    } catch (error) {
        console.error('Error initializing HealthScanner:', error);
    }
});

// Additional utility functions for enhanced user experience
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause any active processes when tab is not visible
        console.log('Tab hidden - pausing active processes');
    } else {
        // Resume processes when tab becomes visible
        console.log('Tab visible - resuming processes');
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// Handle page unload to clean up resources
window.addEventListener('beforeunload', () => {
    // Clean up media streams if they exist
    if (healthScannerInstance && healthScannerInstance.mediaStream) {
        healthScannerInstance.stopCamera();
    }
});

// Keyboard shortcuts for accessibility
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        const modal = document.getElementById('reportModal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    }
    
    // Space to start/stop camera when in scanning section
    if (e.code === 'Space' && !document.getElementById('scanningSection').classList.contains('hidden')) {
        e.preventDefault();
        const startBtn = document.getElementById('startCameraBtn');
        const stopBtn = document.getElementById('stopCameraBtn');
        
        if (startBtn && !startBtn.classList.contains('hidden')) {
            startBtn.click();
        } else if (stopBtn && !stopBtn.classList.contains('hidden')) {
            stopBtn.click();
        }
    }
});

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a production app
        console.log('PWA features ready');
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}