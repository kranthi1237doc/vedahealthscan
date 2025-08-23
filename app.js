class VEDAHealthScanner {
  constructor() {
    this.video = document.getElementById("video");
    this.overlay = document.getElementById("overlay");
    this.ctx = this.overlay.getContext("2d");
    this.stream = null;
    this.faceDetectionInterval = null;
    this.isScanning = false;
    this.faceDetected = false;
    this.scanProgress = 0;
    this.bmi = null;
    this.bmiCategory = "";

    this.attachEvents();
  }

  attachEvents() {
    document.getElementById("btnContinue").addEventListener("click", () => this.proceedToScan());
    document.getElementById("btnStart").addEventListener("click", () => this.startCamera());
    document.getElementById("btnStop").addEventListener("click", () => this.stopCamera());
    document.getElementById("btnScan").addEventListener("click", () => this.beginScan());
    document.getElementById("btnGeneratePDF").addEventListener("click", () => this.generatePDF());
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
      alert("Height must be between 100 and 250 cm.");
      return false;
    }
    if (!(weight >= 30 && weight <= 200)) {
      alert("Weight must be between 30 and 200 kg.");
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

    document.getElementById("patient-section").style.display = "none";
    document.getElementById("scan-section").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.updateStatus("Please start the camera.");
  }

  calculateBMI() {
    const height = Number(document.getElementById("patientHeight").value);
    const weight = Number(document.getElementById("patientWeight").value);
    if (height && weight) {
      this.bmi = (weight / ((height / 100) ** 2)).toFixed(1);
      this.bmiCategory = this.getBMICategory(this.bmi);
      document.getElementById("bmi-display").style.display = "block";
      document.getElementById("bmi-display").textContent = `BMI: ${this.bmi} (${this.bmiCategory})`;
    }
  }

  getBMICategory(bmi) {
    const num = parseFloat(bmi);
    if (num < 18.5) return "Underweight";
    if (num < 25) return "Normal weight";
    if (num < 30) return "Overweight";
    return "Obese";
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      this.video.srcObject = this.stream;
      await this.video.play();

      this.overlay.width = this.video.videoWidth;
      this.overlay.height = this.video.videoHeight;

      this.startFaceDetection();

      document.getElementById("btnStart").style.display = "none";
      document.getElementById("btnStop").style.display = "inline-block";
      document.getElementById("btnScan").style.display = "inline-block";
      this.updateStatus("Camera started! Position your face inside the green box.");
    } catch (err) {
      this.updateStatus("Error accessing camera: " + err.message, true);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }
    this.clearOverlay();
    document.getElementById("btnStart").style.display = "inline-block";
    document.getElementById("btnStop").style.display = "none";
    document.getElementById("btnScan").style.display = "none";
    this.updateStatus("Camera stopped.");
  }

  startFaceDetection() {
    this.faceDetectionInterval = setInterval(() => this.drawFaceBox(), 100);
  }

  drawFaceBox() {
    this.clearOverlay();
    const ctx = this.overlay.getContext("2d");
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
    this.overlay.getContext("2d").clearRect(0, 0, this.overlay.width, this.overlay.height);
  }

  updateStatus(msg, isError) {
    const el = document.getElementById("scan-status");
    el.textContent = msg;
    el.style.color = isError ? "red" : "#00695c";
  }

  beginScan() {
    if (!this.stream) {
      alert("Please start the camera first.");
      return;
    }
    if (!this.faceDetected) {
      alert("Face not detected. Please position your face inside the green box.");
      return;
    }

    this.updateStatus("Starting health scan...");
    this.isScanning = true;
    this.scanProgress = 0;

    document.getElementById("btnScan").disabled = true;

    let progressInterval = setInterval(() => {
      this.scanProgress += 10;
      this.updateStatus(`Analyzing... ${this.scanProgress}%`);
      if (this.scanProgress >= 100) {
        clearInterval(progressInterval);
        this.finishScan();
      }
    }, 500);
  }

  finishScan() {
    this.updateStatus("Scan complete!");
    this.isScanning = false;
    document.getElementById("btnScan").disabled = false;

    // Stop camera
    this.stopCamera();

    // Show Results
    this.showResults();
  }

  showResults() {
    document.getElementById("scan-section").style.display = "none";
    document.getElementById("result-section").style.display = "block";

    document.getElementById("resultBMI").textContent = `${this.bmi} (${this.bmiCategory})`;
    let riskLevel = "Low Risk";
    if (this.bmi >= 30) riskLevel = "High Risk";
    else if (this.bmi >= 25) riskLevel = "Moderate Risk";
    document.getElementById("resultRisk").textContent = riskLevel;

    // Recommendations
    const recContainer = document.getElementById("recommendations");
    recContainer.innerHTML = "";

    let recommendations = [];
    switch (riskLevel) {
      case "Low Risk":
        recommendations = [
          "Maintain a healthy lifestyle and balanced diet",
          "Regular exercise recommended",
          "Annual health checkups"
        ];
        break;
      case "Moderate Risk":
        recommendations = [
          "Consult your doctor for detailed evaluation",
          "Consider lifestyle modifications to reduce risk",
          "Monitor health parameters regularly"
        ];
        break;
      case "High Risk":
        recommendations = [
          "Urgent consultation with a healthcare provider",
          "Possible medical intervention required",
          "Lifestyle changes and medication adherence"
        ];
        break;
    }

    recommendations.forEach(rec => {
      const div = document.createElement("div");
      div.className = "recommendation";
      div.textContent = rec;
      recContainer.appendChild(div);
    });
  }

  generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    // Hospital Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("VEDA HOSPITAL", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Dr. Navuluri Kranthi Kumar Reddy", 105, y, { align: "center" });
    y += 6;
    doc.text("Opp Sangam Dairy, Arundpet, Palandu Road", 105, y, { align: "center" });
    y += 6;
    doc.text("Narasaraopet - 522601, Andhra Pradesh, India", 105, y, { align: "center" });
    y += 12;

    // User Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Patient Information", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    const name = document.getElementById("patientName").value.trim();
    const age = document.getElementById("patientAge").value;
    const height = document.getElementById("patientHeight").value;
    const weight = document.getElementById("patientWeight").value;
    const gender = document.getElementById("patientGender").value;
    const contact = document.getElementById("patientContact").value;

    doc.text(`Name: ${name}`, 14, y); y += 6;
    doc.text(`Age: ${age}`, 14, y); y += 6;
    doc.text(`Gender: ${gender}`, 14, y); y += 6;
    doc.text(`Height: ${height} cm`, 14, y); y += 6;
    doc.text(`Weight: ${weight} kg`, 14, y); y += 6;
    doc.text(`Contact: ${contact || "N/A"}`, 14, y); y += 14;

    // BMI and Risk
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Health Assessment", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`BMI: ${this.bmi} (${this.bmiCategory})`, 14, y); y += 6;
    doc.text(`Cardiac Risk Level: ${document.getElementById("resultRisk").textContent}`, 14, y); y += 14;

    // Recommendations
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Recommendations", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    const recs = document.querySelectorAll("#recommendations .recommendation");
    recs.forEach(r => {
      doc.text("- " + r.textContent, 16, y);
      y += 6;
    });
    y += 10;

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(100);
    const disclaimer = "This evaluation is for informational purposes only. It is not a medical diagnosis. Please consult a healthcare professional for advice.";
    doc.text(disclaimer, 14, y, { maxWidth: 180 });
    y += 14;

    // Signature
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 102);
    doc.text("Dr. Navuluri Kranthi Kumar Reddy", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text("VEDA Hospital", 14, y + 6);

    // Save file
    doc.save(`VEDA_Health_Report_${name.replace(/\s+/g, "_") || "Patient"}.pdf`);
  }

}

window.onload = () => {
  window.vedaScanner = new VEDAHealthScanner();

  // Bind button events via inline handlers if needed
  window.proceedToScan = () => window.vedaScanner.proceedToScan();
};
