class VEDAHealthScanner {
    constructor() {
        this.videoElement = document.getElementById('videoElement');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.overlayContext = this.overlayCanvas ? this.overlayCanvas.getContext('2d') : null;
        this.mediaStream = null;
        this.faceDetectionInterval = null;
        this.isScanning = false;
        this.faceDetected = false;
        this.patientData = {};
        this.healthMetrics = {};
        this.cardiacRiskScore = 0;
        this.bmiValue = 0;
        this.bmiCategory = '';
        this.capturedFaceImage = null;

        this.vedaHospital = {
            name: "VEDA HOSPITAL",
            doctor: "Dr. Navuluri Kranthi Kumar Reddy",
            phone: "+91-790-122-8989",
            email: "vedahospitalnrt@gmail.com",
            address: "Opp Sangam Dairy, Arundpet, Palandu Road",
            city: "Narasaraopet - 522601, Andhra Pradesh, India",
            website: "vedahospital.co.in",
            registration: "16/G1/DRA/2022"
        };

        this.healthMetricsConfig = [
            {name: "Heart Rate", unit: "BPM", key: "heartRate"},
            {name: "Blood Pressure", unit: "mmHg", key: "bloodPressure"},
            {name: "Stress Level", unit: "", key: "stressLevel"},
            {name: "Oxygen Saturation", unit: "%", key: "oxygenSat"},
            {name: "Breathing Rate", unit: "BPM", key: "breathingRate"},
            {name: "Body Temperature", unit: "°F", key: "bodyTemp"},
            {name: "Skin Health Score", unit: "/10", key: "skinHealth"}
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        const heightInput = document.getElementById('patientHeight');
        const weightInput = document.getElementById('patientWeight');

        if (heightInput && weightInput) {
            heightInput.addEventListener('input', () => this.calculateBMI());
            weightInput.addEventListener('input', () => this.calculateBMI());
        }

        const startCameraBtn = document.getElementById('startCameraBtn');
        const stopCameraBtn = document.getElementById('stopCameraBtn');
        const beginScanBtn = document.getElementById('beginScanBtn');

        if (startCameraBtn) startCameraBtn.addEventListener('click', () => this.startCamera());
        if (stopCameraBtn) stopCameraBtn.addEventListener('click', () => this.stopCamera());
        if (beginScanBtn) beginScanBtn.addEventListener('click', () => this.beginHealthScan());

        window.proceedToScan = () => window.vedaScanner.proceedToScan();
        window.generatePDFReport = () => window.vedaScanner.generatePDFReport();
        window.startNewScan = () => window.vedaScanner.startNewScan();
        window.contactVEDA = () => window.vedaScanner.contactVEDA();
    }

    setupFormValidation() {
        const form = document.getElementById('patientForm');
        if (!form) return;
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const name = input.name;
        let isValid = true;
        let errorMessage = '';

        switch (name) {
            case 'patientAge':
                const age = parseInt(value, 10);
                if (age < 18 || age > 100) {
                    isValid = false;
                    errorMessage = 'Age must be between 18 and 100 years';
                }
                break;
            case 'patientHeight':
                const height = parseInt(value, 10);
                if (height < 100 || height > 250) {
                    isValid = false;
                    errorMessage = 'Height must be between 100 and 250 cm';
                }
                break;
            case 'patientWeight':
                const weight = parseInt(value, 10);
                if (weight < 30 || weight > 200) {
                    isValid = false;
                    errorMessage = 'Weight must be between 30 and 200 kg';
                }
                break;
        }

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
        if (existingError) existingError.remove();
    }

    calculateBMI() {
        const height = parseFloat(document.getElementById('patientHeight').value);
        const weight = parseFloat(document.getElementById('patientWeight').value);
        if (height && weight && height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            this.bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
            this.bmiCategory = this.getBMICategory(this.bmiValue);
            this.updateBMIDisplay();
        }
    }

    getBMICategory(bmi) {
        const bmiNum = parseFloat(bmi);
        if (bmiNum < 18.5) return "Underweight";
        if (bmiNum < 25) return "Normal Weight";
        if (bmiNum < 30) return "Overweight";
        return "Obese";
    }

    updateBMIDisplay() {
        const bmiDisplay = document.getElementById('bmiDisplay');
        const bmiValue = document.getElementById('bmiValue');
        const bmiCategoryElement = document.getElementById('bmiCategory');

        if (bmiDisplay && bmiValue && bmiCategoryElement) {
            bmiDisplay.style.display = 'block';
            bmiValue.textContent = this.bmiValue;
            bmiCategoryElement.textContent = this.bmiCategory;
            bmiCategoryElement.className = 'bmi-category';
        }
    }

    proceedToScan() {
        const form = document.getElementById('patientForm');
        const requiredInputs = form.querySelectorAll('input[required]');
        let isValid = true;
        requiredInputs.forEach(input => {
            if (!this.validateInput(input) || !input.value.trim()) isValid = false;
        });
        if (!isValid) {
            alert('Please fill in all required fields correctly.');
            return;
        }
        this.patientData = {
            name: document.getElementById('patientName').value,
            age: parseInt(document.getElementById('patientAge').value, 10),
            height: parseInt(document.getElementById('patientHeight').value, 10),
            weight: parseInt(document.getElementById('patientWeight').value, 10),
            bloodSugar: parseInt(document.getElementById('bloodSugar').value, 10) || null,
            gender: document.getElementById('patientGender').value,
            contact: document.getElementById('patientContact').value,
            bmi: this.bmiValue,
            bmiCategory: this.bmiCategory
        };
        document.getElementById('patientFormSection').style.display = 'none';
        document.getElementById('scanningSection').style.display = 'block';
        document.getElementById('scanningSection').scrollIntoView({ behavior: 'smooth' });
    }

    async startCamera() {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            if (this.videoElement) {
                this.videoElement.srcObject = this.mediaStream;
                document.getElementById('startCameraBtn').style.display = 'none';
                document.getElementById('stopCameraBtn').style.display = 'inline-block';
                document.getElementById('beginScanBtn').style.display = 'inline-block';
                document.getElementById('scanStatus').innerHTML = '<p>Camera active. Position your face in the center and click "Begin Health Analysis".</p>';
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
        document.getElementById('startCameraBtn').style.display = 'inline-block';
        document.getElementById('stopCameraBtn').style.display = 'none';
        document.getElementById('beginScanBtn').style.display = 'none';
        document.getElementById('scanStatus').innerHTML = '<p>Camera stopped. Click "Start Camera" to begin.</p>';
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
        this.overlayContext.clearRect(0, 0, 640, 480);
        const faceWidth = 200, faceHeight = 250;
        const centerX = 320, centerY = 240;
        const x = centerX - faceWidth / 2, y = centerY - faceHeight / 2;
        this.overlayContext.strokeStyle = '#4CAF50';
        this.overlayContext.lineWidth = 3;
        this.overlayContext.strokeRect(x, y, faceWidth, faceHeight);
        this.faceDetected = true;
    }

    captureFaceImage() {
        if (!this.videoElement || this.videoElement.videoWidth === 0) return null;
        try {
            const captureCanvas = document.createElement('canvas');
            const captureContext = captureCanvas.getContext('2d');
            captureCanvas.width = this.videoElement.videoWidth;
            captureCanvas.height = this.videoElement.videoHeight;
            captureContext.drawImage(this.videoElement, 0, 0, captureCanvas.width, captureCanvas.height);
            return captureCanvas.toDataURL('image/jpeg', 0.8);
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
        this.capturedFaceImage = this.captureFaceImage();
        document.getElementById('beginScanBtn').style.display = 'none';
        document.getElementById('scanStatus').innerHTML = `
            <div style="text-align:center;">
                <div class="loading" style="margin:0 auto 1rem;"></div>
                <p>Analyzing facial features and vital signs...</p>
                <p>Please remain still and look directly at the camera.</p>
            </div>
        `;
        document.getElementById('scanOverlay').style.display = 'flex';

        let progress = 0;
        const scanInterval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                document.getElementById('scanStatus').innerHTML = `
                    <div style="text-align:center;">
                        <div class="loading" style="margin:0 auto 1rem;"></div>
                        <p>Analyzing facial features and vital signs... ${progress}%</p>
                        <p>Please remain still and look directly at the camera.</p>
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
        this.generateHealthMetrics();
        this.calculateCardiacRisk();
        this.stopCamera();
        document.getElementById('scanningSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        this.displayResults();
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    generateHealthMetrics() {
        this.healthMetrics = {
            heartRate: this.generateRealisticValue(65, 90),
            bloodPressure: {
                systolic: this.generateRealisticValue(120, 140),
                diastolic: this.generateRealisticValue(72, 88)
            },
            stressLevel: 'Low',
            oxygenSat: this.generateRealisticValue(97, 99),
            breathingRate: this.generateRealisticValue(12, 16),
            bodyTemp: (this.generateRealisticValue(975, 985) / 10).toFixed(1),
            skinHealth: this.generateRealisticValue(7, 10)
        };
    }

    generateRealisticValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calculateCardiacRisk() {
        let riskPoints = 0;
        const factors = [];
        const ageFactor = Math.max(0, (this.patientData.age - 20) * 0.5);
        riskPoints += ageFactor;
        factors.push({ name: 'Age Factor', points: ageFactor.toFixed(1), description: `Age: ${this.patientData.age} years` });
        let bmiFactor = 0;
        if (this.bmiValue >= 30) bmiFactor = 4;
        else if (this.bmiValue >= 25) bmiFactor = 2;
        riskPoints += bmiFactor;
        factors.push({ name: "BMI Factor", points: bmiFactor, description: `BMI: ${this.bmiValue} (${this.bmiCategory})` });
        let bloodSugarFactor = 0;
        if (this.patientData.bloodSugar) {
            if (this.patientData.bloodSugar > 180) bloodSugarFactor = 5;
            else if (this.patientData.bloodSugar > 140) bloodSugarFactor = 3;
        }
        riskPoints += bloodSugarFactor;
        factors.push({ name: "Blood Sugar", points: bloodSugarFactor, description: this.patientData.bloodSugar ? `${this.patientData.bloodSugar} mg/dL` : "Not provided" });
        let stressFactor = 0; // always Low
        riskPoints += stressFactor;
        factors.push({ name: "Stress Level", points: stressFactor, description: `Facial analysis: ${this.healthMetrics.stressLevel}` });
        let bpFactor = 0;
        if (this.healthMetrics.bloodPressure.systolic > 140 || this.healthMetrics.bloodPressure.diastolic > 90) bpFactor = 3;
        riskPoints += bpFactor;
        factors.push({ name: "Blood Pressure", points: bpFactor, description: `${this.healthMetrics.bloodPressure.systolic}/${this.healthMetrics.bloodPressure.diastolic} mmHg` });
        let hrFactor = 0;
        if (this.healthMetrics.heartRate > 100) hrFactor = 1;
        riskPoints += hrFactor;
        factors.push({ name: "Heart Rate", points: hrFactor, description: `${this.healthMetrics.heartRate} BPM` });
        this.cardiacRiskScore = riskPoints;
        this.riskFactors = factors;
    }

    getCardiacRiskLevel() {
        if (this.cardiacRiskScore <= 5) return { level: 'Low Risk', class: 'risk-low' };
        if (this.cardiacRiskScore <= 10) return { level: 'High Risk', class: 'risk-high' };
        return { level: 'Critical Risk', class: 'risk-critical' };
    }

    displayResults() {
        const overallScore = Math.max(20, 100 - (this.cardiacRiskScore * 5));
        document.getElementById('overallScore').textContent = Math.round(overallScore);
        const scoreStatus = document.getElementById('scoreStatus');
        scoreStatus.textContent = overallScore >= 60 ? "Good Health" : "Needs Attention";
        scoreStatus.style.color = overallScore >= 80 ? "#4CAF50" : (overallScore >= 60 ? "#FF9800" : "#F44336");
        const riskLevel = this.getCardiacRiskLevel();
        const riskScoreElement = document.getElementById('cardiacRiskScore');
        riskScoreElement.textContent = riskLevel.level;
        riskScoreElement.className = `risk-score ${riskLevel.class}`;
        document.getElementById('riskPoints').textContent = this.cardiacRiskScore.toFixed(1);
        const riskBreakdown = document.getElementById('riskBreakdown');
        riskBreakdown.innerHTML = this.riskFactors.map(factor => `
            <div class="risk-factor">
                <div class="risk-factor-name">${factor.name}</div>
                <div class="risk-factor-points">+${factor.points} points - ${factor.description}</div>
            </div>
        `).join('');
        this.displayHealthMetrics();
        this.displayRecommendations();
    }

    displayHealthMetrics() {
        const metricsGrid = document.getElementById('metricsGrid');
        const html = this.healthMetricsConfig.map(config => {
            let val;
            switch (config.key) {
                case 'heartRate': val = `${this.healthMetrics.heartRate} ${config.unit}`; break;
                case 'bloodPressure': val = `${this.healthMetrics.bloodPressure.systolic}/${this.healthMetrics.bloodPressure.diastolic} ${config.unit}`; break;
                case 'stressLevel': val = this.healthMetrics.stressLevel; break;
                case 'oxygenSat': val = `${this.healthMetrics.oxygenSat}${config.unit}`; break;
                case 'breathingRate': val = `${this.healthMetrics.breathingRate} ${config.unit}`; break;
                case 'bodyTemp': val = `${this.healthMetrics.bodyTemp}${config.unit}`; break;
                case 'skinHealth': val = `${this.healthMetrics.skinHealth}/10`; break;
            }
            return `<div class="metric-card">
                <div class="metric-name">${config.name}</div>
                <div class="metric-value">${val}</div>
            </div>`;
        }).join('');
        metricsGrid.innerHTML = html + `
            <div class="metric-card">
                <div class="metric-name">BMI</div>
                <div class="metric-value">${this.bmiValue} kg/m²</div>
                <div class="metric-status">${this.bmiCategory}</div>
            </div>
        `;
    }

    displayRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        const riskLevel = this.getCardiacRiskLevel();
        let recommendations = [];
        if (riskLevel.level === 'Low Risk') {
            recommendations = [
                'Continue your healthy lifestyle habits',
                'Maintain regular exercise routine (30 minutes daily)',
                'Schedule annual health check-ups at VEDA Hospital',
                'Follow a balanced, nutritious diet'
            ];
        } else if (riskLevel.level === 'High Risk') {
            recommendations = [
                'Immediate consultation with Dr. Navuluri Kranthi Kumar Reddy recommended',
                'Comprehensive cardiac evaluation at VEDA Hospital',
                'Discuss medication options with healthcare provider',
                'Regular health monitoring every 3 months'
            ];
        } else {
            recommendations = [
                'URGENT: Contact VEDA Hospital immediately (+91-790-122-8989)',
                'Emergency cardiac assessment required',
                'Intensive medical management with Dr. Navuluri Kranthi Kumar Reddy',
                'Daily health monitoring recommended'
            ];
        }
        recommendations.push('Avoid smoking and limit alcohol consumption');
        recommendations.push('Stay well hydrated (8-10 glasses of water daily)');
        recommendations.push('Ensure adequate sleep (7-9 hours nightly)');
        recommendationsList.innerHTML = recommendations.map(t => `<div class="recommendation-item">${t}</div>`).join('');
    }

    generatePDFReport() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Letterhead
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(0, 43, 54);
            doc.text(this.vedaHospital.name, 105, 18, {align: "center"});
            doc.setFontSize(11);
            doc.setTextColor(0, 139, 139);
            doc.setFont("helvetica", "normal");
            doc.text(this.vedaHospital.doctor, 105, 26, {align: "center"});
            doc.text(this.vedaHospital.address, 105, 33, {align: "center"});
            doc.text(this.vedaHospital.city, 105, 39, {align: "center"});
            doc.text(`Phone: ${this.vedaHospital.phone}`, 25, 33);
            doc.text(`Email: ${this.vedaHospital.email}`, 25, 39);
            doc.text(`Medical Registration: ${this.vedaHospital.registration}`, 25, 45);

            doc.setFontSize(15);
            doc.setTextColor(0, 102, 102);
            doc.setFont("helvetica", "bold");
            doc.text("AI-POWERED HEALTH SCREENING REPORT", 105, 55, {align: "center"});

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const dateStr = new Date().toLocaleString("en-IN");
            doc.text(`Report ID: VEDA-${Date.now()}`, 15, 60);
            doc.text(`Generated: ${dateStr}`, 130, 60);

            doc.setLineWidth(0.5);
            doc.setDrawColor(50, 150, 150);
            doc.line(18, 62, 192, 62);

            // Patient Info
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(34, 34, 34);
            doc.text("PATIENT INFORMATION", 15, 72);

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);

            let y = 78;
            doc.text(`Full Name: ${this.patientData.name}`, 15, y);
            doc.text(`Age: ${this.patientData.age} years`, 115, y);

            y += 6;
            doc.text(`Height: ${this.patientData.height} cm`, 15, y);
            doc.text(`Weight: ${this.patientData.weight} kg`, 115, y);

            y += 6;
            doc.text(`BMI: ${this.bmiValue} kg/m² (${this.bmiCategory})`, 15, y);
            doc.text(`Gender: ${this.patientData.gender}`, 115, y);

            y += 6;
            doc.text(`Blood Sugar: ${this.patientData.bloodSugar ? this.patientData.bloodSugar + ' mg/dL' : 'Not provided'}`, 15, y);
            doc.text(`Contact: ${this.patientData.contact || 'Not provided'}`, 115, y);

            // Face Image
            y += 12;
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(34, 34, 34);
            doc.text("CAPTURED FACIAL IMAGE", 15, y);
            y += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            if (this.capturedFaceImage) {
                try {
                    doc.addImage(this.capturedFaceImage, 'JPEG', 16, y, 50, 35);
                    doc.text("Patient facial image captured during AI health analysis", 70, y + 8);
                    doc.text(`Captured: ${new Date().toLocaleTimeString("en-IN")} on ${new Date().toLocaleDateString("en-IN")}`, 70, y + 13);
                } catch (e) {
                    doc.text("Face image available in digital format only.", 16, y);
                }
            } else {
                doc.text("Face image was not captured during this session.", 16, y);
            }

            // Health Metrics
            y += 42;
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(34, 34, 34);
            doc.text("HEALTH METRICS ANALYSIS", 15, y);
            y += 7;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text(`Heart Rate: ${this.healthMetrics.heartRate} BPM`, 15, y);
            doc.text(`Blood Pressure: ${this.healthMetrics.bloodPressure.systolic}/${this.healthMetrics.bloodPressure.diastolic} mmHg`, 80, y);
            y += 6;
            doc.text(`Stress Level: ${this.healthMetrics.stressLevel}`, 15, y);
            doc.text(`Oxygen Saturation: ${this.healthMetrics.oxygenSat}%`, 80, y);
            y += 6;
            doc.text(`Breathing Rate: ${this.healthMetrics.breathingRate} BPM`, 15, y);
            doc.text(`Body Temperature: ${this.healthMetrics.bodyTemp}°F`, 80, y);
            y += 6;
            doc.text(`Skin Health Score: ${this.healthMetrics.skinHealth}/10`, 15, y);
            doc.text(`BMI: ${this.bmiValue} kg/m² (${this.bmiCategory})`, 80, y);

            // Cardiac Risk
            y += 12;
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(34, 34, 34);
            doc.text("CARDIAC RISK ASSESSMENT", 15, y);
            y += 7;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const riskLevel = this.getCardiacRiskLevel();
            doc.text(`Risk Level: ${riskLevel.level}`, 15, y);
            doc.text(`Total Risk Points: ${this.cardiacRiskScore.toFixed(1)}`, 80, y);
            y += 7;
            doc.text('Risk Factor Analysis:', 15, y);
            for (let factor of this.riskFactors) {
                y += 6;
                doc.text(`- ${factor.name}: +${factor.points} pts - ${factor.description}`, 18, y);
            }

            // Recommendations
            y += 10;
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(34, 34, 34);
            doc.text("HEALTH RECOMMENDATIONS", 15, y);
            y += 8;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            let recs = document.querySelectorAll('.recommendation-item');
            for (let rec of recs) {
                doc.text('- ' + rec.textContent, 18, y);
                y += 6;
                if (y > 265) {
                    doc.addPage();
                    y = 18;
                    doc.setFontSize(10);
                }
            }

            // Disclaimers
            y += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 139, 139);
            doc.text("IMPORTANT MEDICAL DISCLAIMERS", 15, y);
            y += 8;
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const disclaimers = [
                "This is a demonstration application developed for VEDA Hospital technology showcase.",
                "All health metrics are AI-simulated for educational and demonstration purposes only.",
                "The captured facial image is used for documentation and technology demonstration.",
                "NOT intended for medical diagnosis, treatment, or clinical decision making.",
                "Always consult Dr. Navuluri Kranthi Kumar Reddy for professional medical advice.",
                `For medical emergencies, contact VEDA Hospital immediately at ${this.vedaHospital.phone}.`,
                `Visit ${this.vedaHospital.website} for comprehensive healthcare services.`
            ];
            for (let disclaimer of disclaimers) {
                y += 5;
                doc.text('- ' + disclaimer, 18, y);
                if (y > 265) {
                    doc.addPage();
                    y = 18;
                    doc.setFontSize(9);
                }
            }

            // Footer/Signature
            y += 10;
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 139, 139);
            doc.text("FOR PROFESSIONAL MEDICAL CONSULTATION", 15, y);
            y += 6;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text(`${this.vedaHospital.name} - ${this.vedaHospital.doctor}`, 15, y);
            y += 6;
            doc.text(
                `Phone: ${this.vedaHospital.phone} | Email: ${this.vedaHospital.email} | Website: ${this.vedaHospital.website}`,
                15,
                y
            );
            y += 6;
            doc.text("Advanced Healthcare & Medical Technology Solutions", 15, y);
            y += 8;
            doc.text("Report Generated by:", 15, y);
            doc.text("VEDA Health Scanner - AI Technology Platform", 15, y + 6);
            doc.text("Under supervision of Dr. Navuluri Kranthi Kumar Reddy", 15, y + 12);
            doc.text("Digital Signature:", 15, y + 18);
            doc.text("This report is digitally generated and does not require physical signature.", 15, y + 24);
            doc.text("© 2025 VEDA Hospital - All Rights Reserved", 15, y + 30);
            doc.text("This document contains confidential medical information and is intended for authorized use only.", 15, y + 36);

            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const filename = `VEDA_Health_Report_${this.patientData.name.replace(/\s+/g, '_')}_${timestamp}.pdf`;
            doc.save(filename);
            alert("PDF health report generated successfully! Check your downloads folder.");
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF report. Please try again or contact VEDA Hospital support.');
        }
    }

    startNewScan() {
        this.patientData = {};
        this.healthMetrics = {};
        this.cardiacRiskScore = 0;
        this.bmiValue = 0;
        this.bmiCategory = '';
        this.capturedFaceImage = null;
        document.getElementById('patientForm').reset();
        document.getElementById('bmiDisplay').style.display = 'none';
        document.getElementById('patientFormSection').style.display = 'block';
        document.getElementById('scanningSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
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
        const phoneNumber = "+917901228989";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        const userChoice = confirm(`Contact VEDA Hospital:

OK - Send WhatsApp message to Dr. Navuluri Kranthi Kumar Reddy
Cancel - Make direct phone call (+91-790-122-8989)

Choose your preferred contact method:`);
        if (userChoice) {
            window.open(whatsappUrl, '_blank');
        } else {
            window.open(`tel:${phoneNumber}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.vedaScanner = new VEDAHealthScanner();
});
