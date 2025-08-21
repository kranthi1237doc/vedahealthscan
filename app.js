// VEDA Health Scanner Application JavaScript
// Enhanced with BMI calculation, cardiac risk assessment, PDF generation with Professional Letterhead, and face image capture
// Updated for Dr. Navuluri Kranthi Kumar Reddy with Trustworthy Teals Theme

class VEDAHealthScanner {
    constructor() {
        this.videoElement = document.getElementById('videoElement');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.overlayContext = this.overlayCanvas ? this.overlayCanvas.getContext('2d') : null;
        this.mediaStream = null;
        this.faceDetectionInterval = null;
        this.scanningInterval = null;
        this.isScanning = false;
        this.faceDetected = false;
        this.patientData = {};
        this.healthMetrics = {};
        this.cardiacRiskScore = 0;
        this.bmiValue = 0;
        this.bmiCategory = '';
        this.capturedFaceImage = null; // Store the captured face image
        
        // VEDA Hospital data - Updated with correct website
        this.vedaHospital = {
            name: "VEDA Hospital",
            doctor: "Dr. Navuluri Kranthi Kumar Reddy",
            phone: "+91-888-549-3639",
            email: "kranthi1237@gmail.com",
            address: "Opp Sargam Daily, Arundpet, Palandu Road, Narasaraopet - 522601",
            website: "vedahospital.co.in",
            specialty: "Advanced Healthcare & Medical Technology",
            registration: "Medical Registration: AP-MED-2024"
        };

        // Health metrics definitions
        this.healthMetricsConfig = [
            {name: "Heart Rate", unit: "BPM", icon: "❤️", normalRange: "60-100", key: "heartRate"},
            {name: "Blood Pressure", unit: "mmHg", icon: "🩸", normalRange: "120/80", key: "bloodPressure"},
            {name: "Stress Level", unit: "level", icon: "🧠", categories: ["Low", "Medium", "High"], key: "stressLevel"},
            {name: "Oxygen Saturation", unit: "%", icon: "🫁", normalRange: "95-100", key: "oxygenSat"},
            {name: "Breathing Rate", unit: "BPM", icon: "💨", normalRange: "12-20", key: "breathingRate"},
            {name: "Body Temperature", unit: "°F", icon: "🌡️", normalRange: "97-99", key: "bodyTemp"},
            {name: "Skin Health", unit: "score", icon: "✨", normalRange: "7-10", key: "skinHealth"}
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Form inputs for real-time BMI calculation
        const heightInput = document.getElementById('patientHeight');
        const weightInput = document.getElementById('patientWeight');
        
        if (heightInput && weightInput) {
            heightInput.addEventListener('input', () => this.calculateBMI());
            weightInput.addEventListener('input', () => this.calculateBMI());
        }

        // Camera controls
        const startCameraBtn = document.getElementById('startCameraBtn');
        const stopCameraBtn = document.getElementById('stopCameraBtn');
        const beginScanBtn = document.getElementById('beginScanBtn');

        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => this.startCamera());
        }
        if (stopCameraBtn) {
            stopCameraBtn.addEventListener('click', () => this.stopCamera());
        }
        if (beginScanBtn) {
            beginScanBtn.addEventListener('click', () => this.beginHealthScan());
        }

        // Global functions
        window.proceedToScan = () => this.proceedToScan();
        window.generatePDFReport = () => this.generatePDFReport();
        window.startNewScan = () => this.startNewScan();
        window.contactVEDA = () => this.contactVEDA();
    }

    setupFormValidation() {
        const form = document.getElementById('patientForm');
        if (form) {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateInput(input));
            });
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const name = input.name;
        let isValid = true;
        let errorMessage = '';

        switch (name) {
            case 'patientAge':
                const age = parseInt(value);
                if (age < 18 || age > 100) {
                    isValid = false;
                    errorMessage = 'Age must be between 18 and 100 years';
                }
                break;
            case 'patientHeight':
                const height = parseInt(value);
                if (height < 100 || height > 250) {
                    isValid = false;
                    errorMessage = 'Height must be between 100 and 250 cm';
                }
                break;
            case 'patientWeight':
                const weight = parseInt(value);
                if (weight < 30 || weight > 200) {
                    isValid = false;
                    errorMessage = 'Weight must be between 30 and 200 kg';
                }
                break;
        }

        // Update input styling
        if (isValid) {
            input.style.borderColor = '';
            this.removeErrorMessage(input);
        } else {
            input.style.borderColor = '#F44336';
            this.showErrorMessage(input, errorMessage);
        }

        return isValid;
    }

    showErrorMessage(input, message) {
        this.removeErrorMessage(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#F44336';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    removeErrorMessage(input) {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    calculateBMI() {
        const height = parseFloat(document.getElementById('patientHeight').value);
        const weight = parseFloat(document.getElementById('patientWeight').value);
        
        if (height && weight && height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            this.bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
            
            // Determine BMI category
            if (this.bmiValue < 18.5) {
                this.bmiCategory = 'Underweight';
            } else if (this.bmiValue < 25) {
                this.bmiCategory = 'Normal Weight';
            } else if (this.bmiValue < 30) {
                this.bmiCategory = 'Overweight';
            } else {
                this.bmiCategory = 'Obese';
            }

            // Update display
            this.updateBMIDisplay();
        }
    }

    updateBMIDisplay() {
        const bmiDisplay = document.getElementById('bmiDisplay');
        const bmiValue = document.getElementById('bmiValue');
        const bmiCategoryElement = document.getElementById('bmiCategory');

        if (bmiDisplay && bmiValue && bmiCategoryElement) {
            bmiDisplay.style.display = 'block';
            bmiValue.textContent = this.bmiValue;
            bmiCategoryElement.textContent = this.bmiCategory;
            
            // Apply appropriate color
            bmiCategoryElement.className = 'bmi-category';
            if (this.bmiValue < 18.5) {
                bmiCategoryElement.classList.add('bmi-underweight');
            } else if (this.bmiValue < 25) {
                bmiCategoryElement.classList.add('bmi-normal');
            } else if (this.bmiValue < 30) {
                bmiCategoryElement.classList.add('bmi-overweight');
            } else {
                bmiCategoryElement.classList.add('bmi-obese');
            }
        }
    }

    proceedToScan() {
        // Validate form
        const form = document.getElementById('patientForm');
        const requiredInputs = form.querySelectorAll('input[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateInput(input) || !input.value.trim()) {
                isValid = false;
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Store patient data
        this.patientData = {
            name: document.getElementById('patientName').value,
            age: parseInt(document.getElementById('patientAge').value),
            height: parseInt(document.getElementById('patientHeight').value),
            weight: parseInt(document.getElementById('patientWeight').value),
            bloodSugar: parseInt(document.getElementById('bloodSugar').value) || null,
            gender: document.getElementById('patientGender').value,
            contact: document.getElementById('patientContact').value,
            bmi: this.bmiValue,
            bmiCategory: this.bmiCategory
        };

        // Hide form and show scanning section
        document.getElementById('patientFormSection').style.display = 'none';
        document.getElementById('scanningSection').style.display = 'block';
        
        // Scroll to scanning section
        document.getElementById('scanningSection').scrollIntoView({ behavior: 'smooth' });
    }

    async startCamera() {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            
            if (this.videoElement) {
                this.videoElement.srcObject = this.mediaStream;
                
                // Update UI
                document.getElementById('startCameraBtn').style.display = 'none';
                document.getElementById('stopCameraBtn').style.display = 'inline-block';
                document.getElementById('beginScanBtn').style.display = 'inline-block';
                document.getElementById('scanStatus').innerHTML = '<p>Camera active. Position your face in the center and click "Begin Health Analysis".</p>';
                
                // Start face detection simulation
                this.startFaceDetection();
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            document.getElementById('scanStatus').innerHTML = '<p style="color: #F44336;">Error accessing camera. Please check permissions and try again.</p>';
        }
    }

    stopCamera() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        if (this.faceDetectionInterval) {
            clearInterval(this.faceDetectionInterval);
            this.faceDetectionInterval = null;
        }

        // Update UI
        document.getElementById('startCameraBtn').style.display = 'inline-block';
        document.getElementById('stopCameraBtn').style.display = 'none';
        document.getElementById('beginScanBtn').style.display = 'none';
        document.getElementById('scanStatus').innerHTML = '<p>Camera stopped. Click "Start Camera" to begin.</p>';
        
        // Clear canvas
        if (this.overlayContext) {
            this.overlayContext.clearRect(0, 0, 640, 480);
        }
    }

    startFaceDetection() {
        this.faceDetectionInterval = setInterval(() => {
            this.simulateFaceDetection();
        }, 100);
    }

    simulateFaceDetection() {
        if (!this.overlayContext) return;

        // Clear previous drawings
        this.overlayContext.clearRect(0, 0, 640, 480);

        // Simulate face detection (random position with some stability)
        const faceWidth = 200;
        const faceHeight = 250;
        const centerX = 320 + (Math.random() - 0.5) * 20;
        const centerY = 240 + (Math.random() - 0.5) * 20;
        const x = centerX - faceWidth / 2;
        const y = centerY - faceHeight / 2;

        // Draw face detection rectangle with Teal colors
        this.overlayContext.strokeStyle = '#4CAF50'; // Success green
        this.overlayContext.lineWidth = 3;
        this.overlayContext.strokeRect(x, y, faceWidth, faceHeight);

        // Draw corner indicators with Teal primary
        const cornerSize = 20;
        this.overlayContext.strokeStyle = '#008B8B'; // Teal primary
        this.overlayContext.lineWidth = 4;
        
        // Top-left corner
        this.overlayContext.beginPath();
        this.overlayContext.moveTo(x, y + cornerSize);
        this.overlayContext.lineTo(x, y);
        this.overlayContext.lineTo(x + cornerSize, y);
        this.overlayContext.stroke();
        
        // Top-right corner
        this.overlayContext.beginPath();
        this.overlayContext.moveTo(x + faceWidth - cornerSize, y);
        this.overlayContext.lineTo(x + faceWidth, y);
        this.overlayContext.lineTo(x + faceWidth, y + cornerSize);
        this.overlayContext.stroke();
        
        // Bottom-left corner
        this.overlayContext.beginPath();
        this.overlayContext.moveTo(x, y + faceHeight - cornerSize);
        this.overlayContext.lineTo(x, y + faceHeight);
        this.overlayContext.lineTo(x + cornerSize, y + faceHeight);
        this.overlayContext.stroke();
        
        // Bottom-right corner
        this.overlayContext.beginPath();
        this.overlayContext.moveTo(x + faceWidth - cornerSize, y + faceHeight);
        this.overlayContext.lineTo(x + faceWidth, y + faceHeight);
        this.overlayContext.lineTo(x + faceWidth, y + faceHeight - cornerSize);
        this.overlayContext.stroke();

        this.faceDetected = true;
    }

    // Face image capture during scanning
    captureFaceImage() {
        if (!this.videoElement || this.videoElement.videoWidth === 0) {
            console.warn('Video not ready for capture');
            return null;
        }

        try {
            // Create a canvas to capture the video frame
            const captureCanvas = document.createElement('canvas');
            const captureContext = captureCanvas.getContext('2d');
            
            // Set canvas dimensions to match video
            captureCanvas.width = this.videoElement.videoWidth;
            captureCanvas.height = this.videoElement.videoHeight;
            
            // Draw the current video frame to the canvas
            captureContext.drawImage(this.videoElement, 0, 0, captureCanvas.width, captureCanvas.height);
            
            // Convert to base64 image data
            const imageDataUrl = captureCanvas.toDataURL('image/jpeg', 0.8);
            
            console.log('Face image captured successfully');
            return imageDataUrl;
            
        } catch (error) {
            console.error('Error capturing face image:', error);
            return null;
        }
    }

    beginHealthScan() {
        if (!this.faceDetected) {
            alert('Please ensure your face is detected before beginning the scan.');
            return;
        }

        this.isScanning = true;
        
        // Capture the face image at the start of scanning
        this.capturedFaceImage = this.captureFaceImage();
        
        // Update UI
        document.getElementById('beginScanBtn').style.display = 'none';
        document.getElementById('scanStatus').innerHTML = `
            <div style="text-align: center;">
                <div class="loading" style="margin: 0 auto 1rem;"></div>
                <p>Analyzing facial features and vital signs...</p>
                <p>Please remain still and look directly at the camera.</p>
                <p style="color: #008B8B; font-weight: 600;">✅ Face image captured for report</p>
            </div>
        `;

        // Show scan overlay
        document.getElementById('scanOverlay').style.display = 'flex';

        // Simulate scanning process
        let progress = 0;
        const scanInterval = setInterval(() => {
            progress += 10;
            
            if (progress <= 100) {
                document.getElementById('scanStatus').innerHTML = `
                    <div style="text-align: center;">
                        <div class="loading" style="margin: 0 auto 1rem;"></div>
                        <p>Analyzing facial features and vital signs... ${progress}%</p>
                        <p>Please remain still and look directly at the camera.</p>
                        <p style="color: #008B8B; font-weight: 600;">✅ Face image captured for report</p>
                    </div>
                `;
            }
            
            if (progress >= 100) {
                clearInterval(scanInterval);
                this.completeScan();
            }
        }, 500);
    }

    completeScan() {
        this.isScanning = false;
        
        // Generate health metrics
        this.generateHealthMetrics();
        
        // Calculate cardiac risk
        this.calculateCardiacRisk();
        
        // Stop camera
        this.stopCamera();
        
        // Hide scanning section and show results
        document.getElementById('scanningSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        // Populate results
        this.displayResults();
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    generateHealthMetrics() {
        this.healthMetrics = {
            heartRate: this.generateRealisticValue(60, 100),
            bloodPressure: {
                systolic: this.generateRealisticValue(110, 140),
                diastolic: this.generateRealisticValue(70, 90)
            },
            stressLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            oxygenSat: this.generateRealisticValue(95, 100),
            breathingRate: this.generateRealisticValue(12, 20),
            bodyTemp: (this.generateRealisticValue(970, 990) / 10).toFixed(1),
            skinHealth: this.generateRealisticValue(6, 10)
        };
    }

    generateRealisticValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calculateCardiacRisk() {
        let riskPoints = 0;
        const factors = [];

        // Age factor
        const ageFactor = Math.max(0, (this.patientData.age - 20) * 0.5);
        riskPoints += ageFactor;
        factors.push({
            name: 'Age Factor',
            points: ageFactor.toFixed(1),
            description: `Age: ${this.patientData.age} years`
        });

        // BMI factor
        let bmiFactor = 0;
        if (this.bmiValue >= 30) {
            bmiFactor = 4;
        } else if (this.bmiValue >= 25) {
            bmiFactor = 2;
        }
        riskPoints += bmiFactor;
        factors.push({
            name: 'BMI Factor',
            points: bmiFactor,
            description: `BMI: ${this.bmiValue} (${this.bmiCategory})`
        });

        // Blood sugar factor
        let bloodSugarFactor = 0;
        if (this.patientData.bloodSugar) {
            if (this.patientData.bloodSugar > 180) {
                bloodSugarFactor = 5;
            } else if (this.patientData.bloodSugar > 140) {
                bloodSugarFactor = 3;
            }
        }
        riskPoints += bloodSugarFactor;
        factors.push({
            name: 'Blood Sugar',
            points: bloodSugarFactor,
            description: this.patientData.bloodSugar ? 
                `${this.patientData.bloodSugar} mg/dL` : 'Not provided'
        });

        // Stress factor
        let stressFactor = 0;
        if (this.healthMetrics.stressLevel === 'High') {
            stressFactor = 2;
        }
        riskPoints += stressFactor;
        factors.push({
            name: 'Stress Level',
            points: stressFactor,
            description: `Facial analysis: ${this.healthMetrics.stressLevel}`
        });

        // Blood pressure factor
        let bpFactor = 0;
        if (this.healthMetrics.bloodPressure.systolic > 140 || 
            this.healthMetrics.bloodPressure.diastolic > 90) {
            bpFactor = 3;
        }
        riskPoints += bpFactor;
        factors.push({
            name: 'Blood Pressure',
            points: bpFactor,
            description: `${this.healthMetrics.bloodPressure.systolic}/${this.healthMetrics.bloodPressure.diastolic} mmHg`
        });

        // Heart rate factor
        let hrFactor = 0;
        if (this.healthMetrics.heartRate > 100) {
            hrFactor = 1;
        }
        riskPoints += hrFactor;
        factors.push({
            name: 'Heart Rate',
            points: hrFactor,
            description: `${this.healthMetrics.heartRate} BPM`
        });

        this.cardiacRiskScore = riskPoints;
        this.riskFactors = factors;
    }

    getCardiacRiskLevel() {
        if (this.cardiacRiskScore <= 5) {
            return { level: 'Low Risk', class: 'risk-low' };
        } else if (this.cardiacRiskScore <= 10) {
            return { level: 'Moderate Risk', class: 'risk-moderate' };
        } else if (this.cardiacRiskScore <= 15) {
            return { level: 'High Risk', class: 'risk-high' };
        } else {
            return { level: 'Critical Risk', class: 'risk-critical' };
        }
    }

    displayResults() {
        // Overall health score
        const overallScore = Math.max(20, 100 - (this.cardiacRiskScore * 5));
        document.getElementById('overallScore').textContent = Math.round(overallScore);
        
        const scoreStatus = document.getElementById('scoreStatus');
        if (overallScore >= 80) {
            scoreStatus.textContent = 'Excellent Health';
            scoreStatus.style.color = '#4CAF50';
        } else if (overallScore >= 60) {
            scoreStatus.textContent = 'Good Health';
            scoreStatus.style.color = '#FF9800';
        } else {
            scoreStatus.textContent = 'Needs Attention';
            scoreStatus.style.color = '#F44336';
        }

        // Cardiac risk
        const riskLevel = this.getCardiacRiskLevel();
        const riskScoreElement = document.getElementById('cardiacRiskScore');
        riskScoreElement.textContent = riskLevel.level;
        riskScoreElement.className = `risk-score ${riskLevel.class}`;
        
        document.getElementById('riskPoints').textContent = this.cardiacRiskScore.toFixed(1);

        // Risk breakdown
        const riskBreakdown = document.getElementById('riskBreakdown');
        riskBreakdown.innerHTML = this.riskFactors.map(factor => `
            <div class="risk-factor">
                <div class="risk-factor-name">${factor.name}</div>
                <div class="risk-factor-points">+${factor.points} points - ${factor.description}</div>
            </div>
        `).join('');

        // Health metrics
        this.displayHealthMetrics();

        // Recommendations
        this.displayRecommendations();
    }

    displayHealthMetrics() {
        const metricsGrid = document.getElementById('metricsGrid');
        
        const metricsHTML = this.healthMetricsConfig.map(config => {
            let value, status, statusClass;
            
            switch (config.key) {
                case 'heartRate':
                    value = `${this.healthMetrics.heartRate} ${config.unit}`;
                    status = (this.healthMetrics.heartRate >= 60 && this.healthMetrics.heartRate <= 100) ? 'Normal' : 'Abnormal';
                    statusClass = status === 'Normal' ? 'status-normal' : 'status-warning';
                    break;
                case 'bloodPressure':
                    value = `${this.healthMetrics.bloodPressure.systolic}/${this.healthMetrics.bloodPressure.diastolic} ${config.unit}`;
                    status = (this.healthMetrics.bloodPressure.systolic <= 130 && this.healthMetrics.bloodPressure.diastolic <= 85) ? 'Normal' : 'Elevated';
                    statusClass = status === 'Normal' ? 'status-normal' : 'status-warning';
                    break;
                case 'stressLevel':
                    value = this.healthMetrics.stressLevel;
                    status = this.healthMetrics.stressLevel === 'Low' ? 'Good' : (this.healthMetrics.stressLevel === 'Medium' ? 'Moderate' : 'High');
                    statusClass = status === 'Good' ? 'status-normal' : (status === 'Moderate' ? 'status-warning' : 'status-danger');
                    break;
                case 'oxygenSat':
                    value = `${this.healthMetrics.oxygenSat}${config.unit}`;
                    status = this.healthMetrics.oxygenSat >= 95 ? 'Normal' : 'Low';
                    statusClass = status === 'Normal' ? 'status-normal' : 'status-danger';
                    break;
                case 'breathingRate':
                    value = `${this.healthMetrics.breathingRate} ${config.unit}`;
                    status = (this.healthMetrics.breathingRate >= 12 && this.healthMetrics.breathingRate <= 20) ? 'Normal' : 'Abnormal';
                    statusClass = status === 'Normal' ? 'status-normal' : 'status-warning';
                    break;
                case 'bodyTemp':
                    value = `${this.healthMetrics.bodyTemp}${config.unit}`;
                    status = (parseFloat(this.healthMetrics.bodyTemp) >= 97 && parseFloat(this.healthMetrics.bodyTemp) <= 99) ? 'Normal' : 'Abnormal';
                    statusClass = status === 'Normal' ? 'status-normal' : 'status-warning';
                    break;
                case 'skinHealth':
                    value = `${this.healthMetrics.skinHealth}/10`;
                    status = this.healthMetrics.skinHealth >= 7 ? 'Good' : (this.healthMetrics.skinHealth >= 5 ? 'Fair' : 'Poor');
                    statusClass = status === 'Good' ? 'status-normal' : (status === 'Fair' ? 'status-warning' : 'status-danger');
                    break;
            }

            return `
                <div class="metric-card">
                    <div class="metric-icon">${config.icon}</div>
                    <div class="metric-name">${config.name}</div>
                    <div class="metric-value">${value}</div>
                    <div class="metric-status ${statusClass}">${status}</div>
                </div>
            `;
        }).join('');

        // Add BMI card
        const bmiStatusClass = this.bmiValue < 18.5 ? 'status-warning' : 
                             (this.bmiValue < 25 ? 'status-normal' : 
                             (this.bmiValue < 30 ? 'status-warning' : 'status-danger'));

        const bmiCard = `
            <div class="metric-card">
                <div class="metric-icon">⚖️</div>
                <div class="metric-name">BMI</div>
                <div class="metric-value">${this.bmiValue} kg/m²</div>
                <div class="metric-status ${bmiStatusClass}">${this.bmiCategory}</div>
            </div>
        `;

        metricsGrid.innerHTML = metricsHTML + bmiCard;
    }

    displayRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        let recommendations = [];

        const riskLevel = this.getCardiacRiskLevel();
        
        if (riskLevel.level === 'Low Risk') {
            recommendations = [
                { icon: '✅', text: 'Continue your healthy lifestyle habits' },
                { icon: '🏃‍♂️', text: 'Maintain regular exercise routine (30 minutes daily)' },
                { icon: '📅', text: 'Schedule annual health check-ups at VEDA Hospital' },
                { icon: '🥗', text: 'Follow a balanced, nutritious diet' }
            ];
        } else if (riskLevel.level === 'Moderate Risk') {
            recommendations = [
                { icon: '⚠️', text: 'Schedule consultation with Dr. Navuluri Kranthi Kumar Reddy within 6 months' },
                { icon: '💪', text: 'Increase physical activity to 45 minutes daily' },
                { icon: '🧘‍♀️', text: 'Practice stress management techniques' },
                { icon: '🩺', text: 'Monitor blood pressure regularly' }
            ];
        } else if (riskLevel.level === 'High Risk') {
            recommendations = [
                { icon: '🚨', text: 'Immediate consultation with Dr. Navuluri Kranthi Kumar Reddy recommended' },
                { icon: '🏥', text: 'Comprehensive cardiac evaluation at VEDA Hospital' },
                { icon: '💊', text: 'Discuss medication options with healthcare provider' },
                { icon: '📊', text: 'Regular health monitoring every 3 months' }
            ];
        } else {
            recommendations = [
                { icon: '🚨', text: 'URGENT: Contact VEDA Hospital immediately (+91-888-549-3639)' },
                { icon: '🏥', text: 'Emergency cardiac assessment required' },
                { icon: '👨‍⚕️', text: 'Intensive medical management with Dr. Navuluri Kranthi Kumar Reddy' },
                { icon: '📱', text: 'Daily health monitoring recommended' }
            ];
        }

        // Add general recommendations
        recommendations.push(
            { icon: '🚭', text: 'Avoid smoking and limit alcohol consumption' },
            { icon: '💧', text: 'Stay well hydrated (8-10 glasses of water daily)' },
            { icon: '😴', text: 'Ensure adequate sleep (7-9 hours nightly)' }
        );

        recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <span class="recommendation-icon">${rec.icon}</span>
                <span class="recommendation-text">${rec.text}</span>
            </div>
        `).join('');
    }

    generatePDFReport() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // ===== PROFESSIONAL LETTERHEAD =====
            
            // Header Background - Teal Gradient Effect
            doc.setFillColor(0, 139, 139); // Teal primary
            doc.rect(0, 0, 210, 35, 'F');
            
            // Hospital Name - Large and Prominent
            doc.setFontSize(28);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.text('VEDA HOSPITAL', 105, 15, { align: 'center' });
            
            // Subtitle
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text('Advanced Healthcare & Medical Technology', 105, 22, { align: 'center' });
            
            // Doctor Name
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text('Dr. Navuluri Kranthi Kumar Reddy', 105, 30, { align: 'center' });
            
            // Professional Line Separator
            doc.setLineWidth(0.8);
            doc.setDrawColor(64, 224, 208); // Teal accent
            doc.line(10, 38, 200, 38);
            
            // Contact Information Bar
            doc.setFontSize(9);
            doc.setTextColor(0, 139, 139);
            doc.setFont("helvetica", "normal");
            
            // Left side contact
            doc.text('📞 +91-888-549-3639', 15, 45);
            doc.text('✉️ kranthi1237@gmail.com', 15, 50);
            
            // Center address
            doc.text('🏥 Opp Sargam Daily, Arundpet, Palandu Road', 105, 45, { align: 'center' });
            doc.text('Narasaraopet - 522601, Andhra Pradesh', 105, 50, { align: 'center' });
            
            // Right side
            doc.text('🌐 vedahospital.co.in', 195, 45, { align: 'right' });
            doc.text('Medical Registration: AP-MED-2024', 195, 50, { align: 'right' });
            
            // Professional Border
            doc.setLineWidth(1);
            doc.setDrawColor(0, 139, 139);
            doc.rect(8, 8, 194, 47, 'S');
            
            // Report Title
            doc.setFontSize(18);
            doc.setTextColor(0, 139, 139);
            doc.setFont("helvetica", "bold");
            doc.text('AI-POWERED HEALTH SCREENING REPORT', 105, 65, { align: 'center' });
            
            // Report Metadata
            const reportId = `VEDA-${Date.now()}`;
            const currentDate = new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'Asia/Kolkata'
            });
            const currentTime = new Date().toLocaleTimeString('en-IN', {
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });
            
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "normal");
            doc.text(`Report ID: ${reportId}`, 15, 75);
            doc.text(`Generated: ${currentDate} at ${currentTime}`, 195, 75, { align: 'right' });
            
            // Main content separator
            doc.setLineWidth(0.5);
            doc.setDrawColor(176, 230, 230); // Soft teal
            doc.line(15, 80, 195, 80);
            
            // ===== PATIENT INFORMATION SECTION =====
            let y = 90;
            
            // Section Header
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 102); // Dark teal
            doc.setFont("helvetica", "bold");
            doc.text('👤 PATIENT INFORMATION', 15, y);
            
            // Section Background
            doc.setFillColor(224, 248, 248); // Pale teal
            doc.rect(15, y + 2, 180, 45, 'F');
            
            y += 10;
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            
            // Patient details in two columns
            doc.text(`Full Name: ${this.patientData.name}`, 20, y);
            doc.text(`Age: ${this.patientData.age} years`, 110, y);
            
            y += 6;
            doc.text(`Height: ${this.patientData.height} cm`, 20, y);
            doc.text(`Weight: ${this.patientData.weight} kg`, 110, y);
            
            y += 6;
            doc.text(`BMI: ${this.bmiValue} kg/m² (${this.bmiCategory})`, 20, y);
            doc.text(`Gender: ${this.patientData.gender}`, 110, y);
            
            y += 6;
            if (this.patientData.bloodSugar) {
                doc.text(`Blood Sugar: ${this.patientData.bloodSugar} mg/dL`, 20, y);
            } else {
                doc.text(`Blood Sugar: Not provided`, 20, y);
            }
            doc.text(`Contact: ${this.patientData.contact || 'Not provided'}`, 110, y);
            
            // ===== FACE IMAGE SECTION =====
            y += 20;
            if (this.capturedFaceImage) {
                doc.setFontSize(14);
                doc.setTextColor(0, 102, 102);
                doc.setFont("helvetica", "bold");
                doc.text('📸 CAPTURED FACIAL IMAGE', 15, y);
                
                y += 8;
                try {
                    // Add professional frame around image
                    doc.setFillColor(0, 139, 139);
                    doc.rect(18, y, 86, 66, 'F');
                    
                    // Add the captured face image
                    doc.addImage(this.capturedFaceImage, 'JPEG', 20, y + 2, 82, 62);
                    
                    // Image caption and metadata
                    doc.setFontSize(9);
                    doc.setTextColor(100, 100, 100);
                    doc.setFont("helvetica", "italic");
                    doc.text('Patient facial image captured during AI health analysis', 20, y + 68);
                    doc.text(`Captured: ${currentTime} on ${new Date().toLocaleDateString('en-IN')}`, 20, y + 73);
                    
                    // Technical details
                    doc.setFont("helvetica", "normal");
                    doc.text('Image Quality: High Definition JPEG', 110, y + 15);
                    doc.text('Capture Method: Real-time video stream', 110, y + 21);
                    doc.text('Analysis: AI-powered facial recognition', 110, y + 27);
                    doc.text('Privacy: Locally processed only', 110, y + 33);
                    doc.text('Medical Use: Documentation & identification', 110, y + 39);
                    
                    y += 80;
                } catch (imageError) {
                    console.warn('Could not add face image to PDF:', imageError);
                    doc.setFontSize(10);
                    doc.setTextColor(150, 150, 150);
                    doc.text('Face image capture available in digital format only', 20, y + 5);
                    y += 15;
                }
            } else {
                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text('📸 Face image was not captured during this session', 15, y);
                y += 15;
            }
            
            // ===== NEW PAGE FOR HEALTH METRICS =====
            doc.addPage();
            y = 20;
            
            // Page Header
            doc.setFillColor(0, 139, 139);
            doc.rect(0, 0, 210, 15, 'F');
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.text('VEDA HOSPITAL - HEALTH ANALYSIS REPORT', 105, 10, { align: 'center' });
            
            // Health Metrics Section
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 102);
            doc.text('📊 HEALTH METRICS ANALYSIS', 15, y);
            
            // Metrics background
            doc.setFillColor(224, 248, 248);
            doc.rect(15, y + 2, 180, 55, 'F');
            
            y += 12;
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            
            // Health metrics in organized layout
            doc.text(`❤️  Heart Rate: ${this.healthMetrics.heartRate} BPM`, 20, y);
            doc.text(`🩸 Blood Pressure: ${this.healthMetrics.bloodPressure.systolic}/${this.healthMetrics.bloodPressure.diastolic} mmHg`, 110, y);
            
            y += 8;
            doc.text(`🧠 Stress Level: ${this.healthMetrics.stressLevel}`, 20, y);
            doc.text(`🫁 Oxygen Saturation: ${this.healthMetrics.oxygenSat}%`, 110, y);
            
            y += 8;
            doc.text(`💨 Breathing Rate: ${this.healthMetrics.breathingRate} BPM`, 20, y);
            doc.text(`🌡️  Body Temperature: ${this.healthMetrics.bodyTemp}°F`, 110, y);
            
            y += 8;
            doc.text(`✨ Skin Health Score: ${this.healthMetrics.skinHealth}/10`, 20, y);
            doc.text(`⚖️  BMI: ${this.bmiValue} kg/m² (${this.bmiCategory})`, 110, y);
            
            // ===== CARDIAC RISK ASSESSMENT =====
            y += 25;
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 102);
            doc.setFont("helvetica", "bold");
            doc.text('❤️ CARDIAC RISK ASSESSMENT', 15, y);
            
            y += 10;
            const riskLevel = this.getCardiacRiskLevel();
            
            // Risk level with color coding
            doc.setFontSize(13);
            if (riskLevel.level.includes('Low')) {
                doc.setTextColor(76, 175, 80); // Green
            } else if (riskLevel.level.includes('Moderate')) {
                doc.setTextColor(255, 152, 0); // Orange
            } else if (riskLevel.level.includes('High')) {
                doc.setTextColor(64, 224, 208); // Teal accent
            } else {
                doc.setTextColor(244, 67, 54); // Red
            }
            doc.setFont("helvetica", "bold");
            doc.text(`Risk Level: ${riskLevel.level}`, 20, y);
            doc.text(`Total Risk Points: ${this.cardiacRiskScore.toFixed(1)}`, 20, y + 8);
            
            // Risk factors breakdown
            y += 20;
            doc.setFontSize(12);
            doc.setTextColor(0, 102, 102);
            doc.text('Risk Factor Analysis:', 20, y);
            
            y += 8;
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            
            this.riskFactors.forEach(factor => {
                doc.text(`• ${factor.name}: +${factor.points} pts - ${factor.description}`, 25, y);
                y += 6;
            });
            
            // ===== RECOMMENDATIONS =====
            y += 10;
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 102);
            doc.setFont("helvetica", "bold");
            doc.text('💡 HEALTH RECOMMENDATIONS', 15, y);
            
            y += 10;
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            
            const recommendations = document.querySelectorAll('.recommendation-text');
            recommendations.forEach(rec => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`• ${rec.textContent}`, 20, y);
                y += 6;
            });
            
            // ===== PROFESSIONAL DISCLAIMERS =====
            if (y > 230) {
                doc.addPage();
                y = 20;
            }
            
            y += 15;
            doc.setFillColor(255, 248, 240); // Light warning background
            doc.rect(15, y, 180, 45, 'F');
            
            doc.setFontSize(12);
            doc.setTextColor(0, 139, 139);
            doc.setFont("helvetica", "bold");
            doc.text('⚠️ IMPORTANT MEDICAL DISCLAIMERS', 20, y + 8);
            
            y += 18;
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            
            const disclaimers = [
                '• This is a demonstration application developed for VEDA Hospital technology showcase.',
                '• All health metrics are AI-simulated for educational and demonstration purposes only.',
                '• The captured facial image is used for documentation and technology demonstration.',
                '• NOT intended for medical diagnosis, treatment, or clinical decision making.',
                '• Always consult Dr. Navuluri Kranthi Kumar Reddy for professional medical advice.',
                '• For medical emergencies, contact VEDA Hospital immediately at +91-888-549-3639.',
                '• Visit vedahospital.co.in for comprehensive healthcare services.'
            ];
            
            disclaimers.forEach(disclaimer => {
                doc.text(disclaimer, 20, y);
                y += 5;
            });
            
            // ===== PROFESSIONAL FOOTER =====
            doc.addPage();
            y = 20;
            
            // Final consultation section
            doc.setFillColor(0, 139, 139);
            doc.rect(15, y, 180, 40, 'F');
            
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.text('🏥 FOR PROFESSIONAL MEDICAL CONSULTATION', 105, y + 12, { align: 'center' });
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text('VEDA Hospital - Dr. Navuluri Kranthi Kumar Reddy', 105, y + 20, { align: 'center' });
            doc.text('📞 +91-888-549-3639  |  ✉️ kranthi1237@gmail.com  |  🌐 vedahospital.co.in', 105, y + 28, { align: 'center' });
            doc.text('Advanced Healthcare & Medical Technology Solutions', 105, y + 35, { align: 'center' });
            
            // Report signature area
            y += 60;
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Report Generated by:', 20, y);
            doc.text('VEDA Health Scanner - AI Technology Platform', 20, y + 6);
            doc.text('Under supervision of Dr. Navuluri Kranthi Kumar Reddy', 20, y + 12);
            
            doc.text('Digital Signature:', 20, y + 25);
            doc.setFont("helvetica", "italic");
            doc.text('This report is digitally generated and does not require physical signature', 20, y + 31);
            
            // Final footer
            y += 50;
            doc.setFillColor(224, 248, 248);
            doc.rect(15, y, 180, 20, 'F');
            doc.setFontSize(8);
            doc.setTextColor(0, 102, 102);
            doc.setFont("helvetica", "normal");
            doc.text('© 2025 VEDA Hospital - All Rights Reserved | Advanced AI-Powered Healthcare Solutions', 105, y + 10, { align: 'center' });
            doc.text('This document contains confidential medical information and is intended for authorized use only.', 105, y + 15, { align: 'center' });
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const filename = `VEDA_Health_Report_${this.patientData.name.replace(/\s+/g, '_')}_${timestamp}.pdf`;
            
            // Save PDF
            doc.save(filename);
            
            // Show success message
            const imageStatus = this.capturedFaceImage ? 'with professional letterhead and captured face image' : 'with professional letterhead';
            alert(`Professional PDF health report generated successfully ${imageStatus}! Check your downloads folder.`);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF report. Please try again or contact VEDA Hospital support.');
        }
    }

    startNewScan() {
        // Reset all data including face image
        this.patientData = {};
        this.healthMetrics = {};
        this.cardiacRiskScore = 0;
        this.bmiValue = 0;
        this.bmiCategory = '';
        this.capturedFaceImage = null; // Reset face image
        
        // Reset form
        document.getElementById('patientForm').reset();
        document.getElementById('bmiDisplay').style.display = 'none';
        
        // Show form section, hide others
        document.getElementById('patientFormSection').style.display = 'block';
        document.getElementById('scanningSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    contactVEDA() {
        const message = `Hello VEDA Hospital,

I have completed an AI health screening using the VEDA Health Scanner and would like to schedule a consultation with Dr. Navuluri Kranthi Kumar Reddy.

Patient Details:
Name: ${this.patientData.name || 'Not provided'}
Age: ${this.patientData.age || 'Not provided'}
Contact: ${this.patientData.contact || 'Not provided'}
BMI: ${this.bmiValue || 'Not calculated'}
Risk Level: ${this.getCardiacRiskLevel().level || 'Not assessed'}
Face Image: ${this.capturedFaceImage ? 'Captured during scan' : 'Not captured'}

Please let me know available appointment times for a comprehensive health consultation.

Thank you for your innovative healthcare services!

Best regards,
${this.patientData.name || 'Patient'}`;
        
        const phoneNumber = '+918885493639';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Try to open WhatsApp, fallback to phone call
        const userChoice = confirm(`Contact VEDA Hospital:

✅ OK - Send WhatsApp message to Dr. Navuluri Kranthi Kumar Reddy
❌ Cancel - Make direct phone call (+91-888-549-3639)

Choose your preferred contact method:`);
        
        if (userChoice) {
            window.open(whatsappUrl, '_blank');
        } else {
            window.open(`tel:${phoneNumber}`);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vedaScanner = new VEDAHealthScanner();
    console.log('VEDA Health Scanner with professional letterhead and face image capture initialized for Dr. Navuluri Kranthi Kumar Reddy');
});