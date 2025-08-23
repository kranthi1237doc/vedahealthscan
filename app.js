class VEDAHealthScanner {
  constructor() {
    console.log("Initializing VEDAHealthScanner...");
    this.videoElement = document.getElementById("videoElement");
    this.overlayCanvas = document.getElementById("overlayCanvas");
    this.overlayContext = this.overlayCanvas ? this.overlayCanvas.getContext("2d") : null;
    this.mediaStream = null;
    this.faceDetectionInterval = null;
    this.isScanning = false;
    this.faceDetected = false;
    this.patientData = {};
    this.healthMetrics = {};
    this.cardiacRiskScore = 0;
    this.bmiValue = 0;
    this.bmiCategory = "";
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
    console.log("Setting up event listeners and validations...");
    this.setupEventListeners();
    this.setupFormValidation();
  }

  setupEventListeners() {
    console.log("Attaching event listeners...");
    const heightInput = document.getElementById("patientHeight");
    const weightInput = document.get
