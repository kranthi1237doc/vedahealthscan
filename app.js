class VEDAHealthScanner {
  constructor() {
    this.video = document.getElementById("video");
    this.overlay = document.getElementById("overlay");
    this.overlayCtx = this.overlay.getContext("2d");
    this.stream = null;
    this.faceDetectInterval = null;
    this.bmi = null;
    this.bmiCategory = "";
    this.scanProgress = 0;
    this.isScanning = false;
    this.faceDetected = false;

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById("btnContinue").addEventListener("click", () => this.proceedToScan());
    document.getElementById("btnStartCamera").addEventListener("click", () => this.startCamera());
    document.getElementById("btnStopCamera").addEventListener("click", () => this.stopCamera());
    document.getElementById("btnBeginScan").addEventListener("click", () => this.beginHealthScan());
    document.getElementById("btnGeneratePDF").addEventListener("click", () => this.generatePDFReport());
    document.getElementById("btnRestart").addEventListener("click", () => this.restart());

    document.getElementById("patientHeight").addEventListener("input", () => this.calculateBMI());
    document.getElementById("patientWeight").addEventListener("input", () => this.calculateBMI());
  }

  validateForm() {
    const name = document.getElementById("patientName").value.trim();
    const age = Number(document.getElementById("patientAge").value);
    const height = Number(document.getElementById("patientHeight").value);
    const weight = Number(document.getElementById("patientWeight").value);
    const gender = document.getElementById("patientGender").value;

    if (!name) {
      alert("Please enter your full name.");
      return false;
    }
    if (!(age >= 18 && age <= 100)) {
      alert("Age must be between 18 and 100.");
      return false;
    }
    if (!(height >= 100 && height <= 250)) {
      alert("Height must be between 100cm and 250cm.");
      return false;
    }
    if (!(weight >= 30 && weight <= 200)) {
      alert("Weight must be between 30kg and 200kg.");
      return false;
    }
    if (!gender) {
      alert("Please select your gender.");
      return false;
    }
    return true;
  }

  proceedToScan() {
    if (!this.validateForm()) return;

    this.calculateBMI();

    document.getElementById("patientSection").style.display = "none";
    document.getElementById("scanningSection").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  calculateBMI() {
    const height = Number(document.getElementById("patientHeight").value);
    const weight = Number(document.getElementById("patientWeight").value);
    if (height && weight) {
      this.bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
      this.bmiCategory = this.getBMICategory(this.bmi);
      const bmiDisplay = document.getElementById("bmiDisplay");
      bmiDisplay.style.display = "block";
      bmiDisplay.textContent = `BMI: ${this.bmi} (${this.bmiCategory})`;
    }
  }

  getBMICategory(bmi) {
    const bmiNum = Number(bmi);
    if (bmiNum < 18.5) return "Underweight";
    if (bmiNum < 25) return "Normal weight";
    if (bmiNum < 30) return "Overweight";
    return "Obese";
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      this.video.srcObject = this.stream;
      this.video.play();

      this.setCanvasSize();
      this.startFaceDetection();

      document.getElementById("btnStartCamera").style.display = "none";
      document.getElementById("btnStopCamera").style.display = "inline-block";
      document.getElementById("btnBeginScan").style.display = "inline-block";

      this.updateScanStatus("Camera started. Position your face inside the box.");
    } catch (err) {
      this.updateScanStatus("Error accessing camera: " + err.message, true);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.faceDetectInterval) {
      clearInterval(this.faceDetectInterval);
      this.faceDetectInterval = null;
    }

    this.clearOverlay();

    document.getElementById("btnStartCamera").style.display = "inline-block";
    document.getElementById("btnStopCamera").style.display = "none";
    document.getElementById("btnBeginScan").style.display = "none";

    this.updateScanStatus("Camera stopped.");
  }

  setCanvasSize() {
    this.overlay.width = this.video.videoWidth || 640;
    this.overlay.height = this.video.videoHeight || 480;
  }

  startFaceDetection() {
    this.faceDetectInterval = setInterval(() => this.drawFaceBox(), 100);
  }

  drawFaceBox() {
    this.clearOverlay();
    const ctx = this.overlayCtx;
    const w = this.overlay.width;
    const h = this.overlay.height;
    const boxWidth = 200;
    const boxHeight = 250;
    const x = (w - boxWidth) / 2;
    const y = (h - boxHeight) / 2;

    ctx.strokeStyle = "#4caf50";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    this.faceDetected = true;
  }

  clearOverlay() {
    this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
  }

  beginHealthScan() {
    if (!this.stream) {
      alert("Please start the camera first.");
      return;
    }
    if (!this.faceDetected) {
      alert("Face not detected. Please position your face inside the box.");
      return;
    }

    this.updateScanStatus("Starting analysis...");
    this.isScanning = true;
    this.scanProgress = 0;
    document.getElementById("btnBeginScan").disabled = true;

    const scanInterval = setInterval(() => {
      this.scanProgress += 10;
      this.updateScanStatus(`Analyzing... ${this.scanProgress}%`);
      if (this.scanProgress >= 100) {
        clearInterval(scanInterval);
        this.completeScan();
      }
    }, 500);
  }

  updateScanStatus(message, isError = false) {
    const statusEl = document.getElementById("scan-status");
    statusEl.textContent = message;
    statusEl.style.color = isError ? "red" : "#00695c";
  }

  completeScan() {
    this.updateScanStatus("Scan complete!");
    this.stopCamera();

    document.getElementById("scanningSection").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("resultBMI").textContent = `${this.bmi} (${this.bmiCategory})`;

    // Simple risk level based on BMI for demo:
    const riskLevel = this.bmi >= 30 ? "High Risk" : "Low Risk";
    document.getElementById("resultRisk").textContent = riskLevel;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  generatePDFReport() {
    alert("PDF generation is not implemented in this demo.");
  }

  restart() {
    document.getElementById("results").style.display = "none";
    document.getElementById("patientSection").style.display = "block";

    document.getElementById("patientForm").reset();
    document.getElementById("bmiDisplay").style.display = "none";

    this.clearOverlay();
    this.faceDetected = false;
    this.isScanning = false;
    this.scanProgress = 0;
    this.stream = null;
    this.scanProgress = 0;

    document.getElementById("btnStartCamera").style.display = "inline-block";
    document.getElementById("btnStopCamera").style.display = "none";
    document.getElementById("btnBeginScan").style.display = "none";

    this.updateScanStatus("");
  }
}

window.onload = function () {
  window.vedaScanner = new VEDAHealthScanner();

  // Also bind global for HTML onclick shortcode if you are using inline HTML handlers
  window.proceedToScan = () => window.vedaScanner.proceedToScan();
};
