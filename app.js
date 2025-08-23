class VEDAHealthScanner {
    constructor() {
        console.log("Initializing VEDAHealthScanner...");
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
            { name: "Heart Rate", unit: "BPM", key: "heartRate" },
            { name: "Blood Pressure", unit: "mmHg", key: "bloodPressure" },
            { name: "Stress Level", unit: "", key: "stressLevel" },
            { name: "Oxygen Saturation", unit: "%", key: "oxygenSat" },
            { name: "Breathing Rate", unit: "BPM", key: "breathingRate" },
            { name: "Body Temperature", unit: "°F", key: "bodyTemp" },
            { name: "Skin Health Score", unit: "/10", key: "skinHealth" }
        ];

        this.init();
    }

    init() {
        console.log("Setting up event listeners and form validation...");
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        console.log("Attaching event listeners...");
        const heightInput = document.getElementById('patientHeight');
        const weightInput = document.getElementById('patientWeight');

        if (heightInput && weightInput) {
            heightInput.addEventListener('input', () => {
                console.log("Height input changed.");
                this.calculateBMI();
            });
            weightInput.addEventListener('input', () => {
                console.log("Weight input changed.");
                this.calculateBMI();
            });
        }

        const startCameraBtn = document.getElementById('startCameraBtn');
        const stopCameraBtn = document.getElementById('stopCameraBtn');
        const beginScanBtn = document.getElementById('beginScanBtn');

        if (startCameraBtn) startCameraBtn.addEventListener('click', () => {
            console.log("Start Camera button clicked.");
            this.startCamera();
        });
        if (stopCameraBtn) stopCameraBtn.addEventListener('click', () => {
            console.log("Stop Camera button clicked.");
            this.stopCamera();
        });
        if (beginScanBtn) beginScanBtn.addEventListener('click', () => {
            console.log("Begin Scan button clicked.");
            this.beginHealthScan();
        });

        // Global function bindings for HTML
        window.proceedToScan = () => { console.log("Global proceedToScan called."); return window.vedaScanner.proceedToScan(); };
        window.generatePDFReport = () => { console.log("Global generatePDFReport called."); return window.vedaScanner.generatePDFReport(); };
        window.startNewScan = () => { console.log("Global startNewScan called."); return window.vedaScanner.startNewScan(); };
        window.contactVEDA = () => { console.log("Global contactVEDA called."); return window.vedaScanner.contactVEDA(); };
    }

    setupFormValidation() {
        console.log("Setting up input validation...");
        const form = document.getElementById('patientForm');
        if (!form) {
            console.warn("Patient form not found.");
            return;
        }
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                console.log(`Validating input: ${input.name}`);
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const name = input.name;
        let isValid = true;
        let errorMessage = '';

        switch (name) {
            case 'patientAge': {
                const age = parseInt(value, 10);
                if (age < 18 || age > 100) {
                    isValid = false;
                    errorMessage = 'Age must be between 18 and 100 years';
                }
                break;
            }
            case 'patientHeight': {
                const height = parseInt(value, 10);
                if (height < 100 || height > 250) {
                    isValid = false;
                    errorMessage = 'Height must be between 100 and 250 cm';
                }
                break;
            }
            case 'patientWeight': {
                const weight = parseInt(value, 10);
                if (weight < 30 || weight > 200) {
                    isValid = false;
                    errorMessage = 'Weight must be between 30 and 200 kg';
                }
                break;
            }
        }

        if (isValid) {
            input.style.borderColor = '';
            this.removeErrorMessage(input);
            console.log(`Input valid: ${name} = ${value}`);
        } else {
            input.style.borderColor = '#F44336';
            this.showErrorMessage(input, errorMessage);
            console.warn(`Input invalid: ${name} = ${value} (${errorMessage})`);
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
            console.log(`BMI calculated: ${this.bmiValue} (${this.bmiCategory})`);
            this.updateBMIDisplay();
        } else {
            console.log("BMI calculation skipped due to invalid inputs.");
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
        console.log("proceedToScan() called");
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
            console.warn("Form validation failed");
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
        console.log("Patient data stored:", this.patientData);
        document.getElementById('patientFormSection').style.display = 'none';
        document.getElementById('scanningSection').style.display = 'block';
        document.getElementById('scanningSection').scrollIntoView({ behavior: 'smooth' });
    }

    async startCamera() {
        console.log("startCamera() called");
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            if (this.videoElement) {
                this.videoElement.srcObject = this.mediaStream;
                console.log("Camera stream set");
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
        console.log("stopCamera() called");
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
            console.log("Camera stream stopped");
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
        console.log("Starting face detection interval");
        this.faceDetectionInterval = setInterval(() => {
            this.simulateFaceDetection();
        }, 100);
    }

    simulateFaceDetection() {
        if (!this.overlayContext) {
            console.warn("Overlay context not available");
            return;
        }
        this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

        const faceWidth = 200, faceHeight = 250;
        const centerX = this.overlayCanvas.width / 2;
        const centerY = this.overlayCanvas.height / 2;
        const x = centerX - faceWidth / 2;
        const y = centerY - faceHeight / 2;

        this.overlayContext.strokeStyle = '#4CAF50'; // Green color
        this.overlayContext.lineWidth = 3;
        this.overlayContext.strokeRect(x, y, faceWidth, faceHeight);

        this.faceDetected = true; 
        console.log("Face detection overlay drawn");
    }

    captureFaceImage() {
        console.log("Capturing face image");
        if (!this.videoElement || this.videoElement.videoWidth === 0) {
            console.warn("Video element not ready for capture");
            return null;
        }
        try {
            const captureCanvas = document.createElement('canvas');
            const captureContext = captureCanvas.getContext('2d');
            captureCanvas.width = this.videoElement.videoWidth;
            captureCanvas.height = this.videoElement.videoHeight;
            captureContext.drawImage(this.videoElement, 0, 0, captureCanvas.width, captureCanvas.height);
            console.log("Face image successfully captured");
            return captureCanvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
            console.error('Error capturing face image:', error);
            return null;
        }
    }

    beginHealthScan() {
        console.log("beginHealthScan() called");
        if (!this.faceDetected) {
            alert('Please ensure your face is detected before beginning the scan.');
            console.warn("Scan blocked: face not detected");
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
            console.log(`Scanning progress: ${progress}%`);
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
                console.log("Scan complete, finalizing report...");
                this.completeScan();
            }
        }, 500);
    }

    completeScan() {
        console.log("Completing scan and showing results");
        this.isScanning = false;
        this.generateHealthMetrics();
        this.calculateCardiacRisk();
        this.stopCamera();
        document.getElementById('scanningSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        this.displayResults();
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    // Remaining methods (generateHealthMetrics, calculateCardiacRisk, displayResults, generatePDFReport, etc.) 
    // remain the same as previous version, you can add console logs similarly if needed.
    // For brevity, they are omitted here, but can be added based on the previous full code example.

    // You can add console.log statements in these methods similarly for detailed tracing.
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing VEDAHealthScanner");
    window.vedaScanner = new VEDAHealthScanner();
});
