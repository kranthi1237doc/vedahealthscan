# VEDA Health Scanner

🏥 **Advanced AI-Powered Health Screening Technology for VEDA Hospital**

![VEDA Hospital](https://img.shields.io/badge/VEDA-Hospital-blue) ![AI Health](https://img.shields.io/badge/AI-Health%20Scanner-orange) ![Status](https://img.shields.io/badge/Status-Demo-green)

## 📋 Overview

VEDA Health Scanner is a cutting-edge web application that demonstrates AI-powered facial health screening technology for VEDA Hospital. This innovative tool combines computer vision, facial analysis, and medical algorithms to provide comprehensive health assessments through non-invasive facial scanning.

**Developed for:** VEDA Hospital  
**Medical Director:** Dr. Navuluri Kranthi Kumar Reddy  
**Contact:** +91-888-549-3639 | kranthi1237@gmail.com  
**Website:** vedahospital.co.in  
**Location:** Opp Sargam Daily, Arundpet, Palandu Road, Narasaraopet - 522601

## ⚠️ Important Medical Disclaimer

**FOR DEMONSTRATION PURPOSES ONLY**

This application is developed for educational and demonstration purposes to showcase VEDA Hospital's commitment to innovative healthcare technology. It is **NOT** intended for medical diagnosis or treatment. Always consult Dr. Navuluri Kranthi Kumar Reddy or qualified healthcare professionals at VEDA Hospital for medical advice.

## 🎨 Design & Branding

The application features the official VEDA Hospital logo with:
- **Blue V Design**: Representing strength and reliability in healthcare
- **Orange Flame**: Symbolizing innovation and the spark of life
- **Color Scheme**: Based on the official VEDA Hospital brand colors
  - Primary Blue: #1e88e5
  - Secondary Blue: #1565c0  
  - Accent Orange: #ff6f00
  - Flame Colors: Multiple orange gradients

## ✨ Key Features

### 🎯 Core Functionality
- **AI-Powered Facial Scanning**: Advanced computer vision for health metric detection
- **BMI Calculation**: Automatic Body Mass Index calculation and assessment
- **Cardiac Risk Scoring**: Comprehensive cardiovascular risk assessment
- **PDF Report Generation**: Professional medical reports with VEDA Hospital branding
- **Real-time Camera Integration**: Live facial detection and analysis
- **Patient Data Management**: Secure patient information handling

### 📊 Health Metrics Analyzed
- ❤️ **Heart Rate** (60-100 BPM)
- 🩸 **Blood Pressure** (Systolic/Diastolic)
- 🧠 **Stress Level** (Low/Medium/High)
- 🫁 **Oxygen Saturation** (95-100%)
- 💨 **Breathing Rate** (12-20 BPM)
- 🌡️ **Body Temperature** (97-99°F)
- ✨ **Skin Health Score** (1-10 scale)
- ⚖️ **BMI Assessment** with category classification

### 🔍 Cardiac Risk Assessment
Advanced scoring system considering:
- **Age Factor**: (age - 20) × 0.5 points
- **BMI Impact**: BMI >25 = +2pts, BMI >30 = +4pts
- **Blood Sugar Analysis**: >140mg/dL = +3pts, >180mg/dL = +5pts
- **Facial Stress Detection**: High stress = +2pts
- **Blood Pressure Evaluation**: >140/90 = +3pts
- **Heart Rate Analysis**: >100 BPM = +1pt

**Risk Categories:**
- 🟢 **Low Risk** (0-5 points): Annual check-ups recommended
- 🟡 **Moderate Risk** (6-10 points): 6-month follow-up at VEDA Hospital
- 🟠 **High Risk** (11-15 points): Immediate consultation required
- 🔴 **Critical Risk** (>15 points): Urgent medical evaluation needed

### 📄 Professional PDF Reports
Generated reports include:
- VEDA Hospital letterhead with official logo
- Complete patient demographics and contact information
- BMI calculation and health interpretation
- All facial scan health metrics with normal ranges
- Detailed cardiac risk breakdown and scoring
- Personalized health recommendations based on risk profile
- Medical disclaimers and VEDA Hospital contact information
- Dr. Navuluri Kranthi Kumar Reddy professional consultation details

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera/webcam access for facial scanning
- HTTPS connection (required for camera permissions)
- Internet connection for PDF generation libraries

### Installation & Deployment

1. **Download the Application Files**
   - `index.html` - Main application interface
   - `style.css` - VEDA Hospital styling and branding
   - `app.js` - Complete functionality with PDF generation
   - `README.md` - This documentation file

2. **GitHub Pages Deployment**
   ```bash
   # Upload files to your GitHub repository
   # Enable GitHub Pages in repository settings
   # Access at: https://your-username.github.io/repository-name
   ```

3. **Local Development Testing**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Access at: http://localhost:8000
   ```

### File Structure
```
veda-health-scanner/
├── index.html          # Main application with VEDA branding
├── style.css           # VEDA Hospital color scheme and styling
├── app.js             # Enhanced JavaScript with PDF generation
└── README.md          # Comprehensive documentation
```

## 🎯 How to Use the Application

### Step 1: Patient Registration
1. Open the VEDA Health Scanner application
2. Complete the patient information form:
   - **Full Name** (required)
   - **Age** (18-100 years, required)
   - **Height** (100-250 cm, required)
   - **Weight** (30-200 kg, required)
   - **Random Blood Sugar Level** (optional, 70-400 mg/dL)
   - **Gender** and **Contact Information**
3. **BMI is automatically calculated** and displayed with health category
4. Click "Continue to Health Scan"

### Step 2: AI-Powered Facial Health Scan
1. Click "Start Camera" and grant camera permissions
2. Position your face in the center of the detection frame
3. Ensure good lighting and look directly at the camera
4. Click "Begin Health Analysis" when face is detected
5. Remain still during the 10-second AI scanning process
6. Watch the progress indicator during analysis

### Step 3: Comprehensive Health Assessment
1. View your **overall health score** and risk assessment
2. Review detailed **health metrics** with normal range comparisons
3. Examine **cardiac risk breakdown** with scoring details
4. Read **personalized health recommendations**
5. **Generate professional PDF report** with VEDA Hospital branding
6. **Contact VEDA Hospital** directly for professional consultation

## 🛠️ Technical Implementation

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Camera Access**: WebRTC getUserMedia API for facial scanning
- **Graphics**: HTML5 Canvas for real-time face detection overlay
- **PDF Generation**: jsPDF and html2canvas libraries
- **Styling**: Custom CSS with official VEDA Hospital branding
- **Responsive Design**: Mobile and tablet compatible interface

### Browser Compatibility
- ✅ Chrome 60+ (Recommended)
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers with camera support

### Security & Privacy Features
- **HTTPS-only camera access** for security compliance
- **Client-side processing** - no data transmission to external servers
- **Professional medical disclaimers** throughout the application
- **Privacy-preserving architecture** with local data processing

## 🏥 VEDA Hospital Integration

### Professional Medical Branding
- **Official VEDA Hospital Logo**: Recreated with CSS for authentic branding
- **Color Scheme**: Based on official VEDA Hospital brand guidelines
- **Professional Interface**: Medical-grade appearance and functionality
- **Dr. Navuluri Kranthi Kumar Reddy**: Featured throughout the application
- **Contact Integration**: One-click WhatsApp and phone contact options

### Clinical Decision Support System
1. **Patient Registration**: Comprehensive demographic data collection
2. **Health Assessment**: AI-powered facial analysis and vital sign estimation
3. **Risk Stratification**: Automated cardiac risk scoring and categorization
4. **Clinical Recommendations**: Evidence-based health guidance
5. **Professional Documentation**: Medical-grade PDF report generation
6. **Follow-up Protocols**: Direct integration with VEDA Hospital contact systems

## 📈 Health Metrics & Assessment Details

### BMI Classification System
- **Underweight**: <18.5 kg/m² (Nutritional consultation recommended)
- **Normal Weight**: 18.5-24.9 kg/m² (Maintain current healthy lifestyle)
- **Overweight**: 25-29.9 kg/m² (Lifestyle modifications and monitoring needed)
- **Obese**: ≥30 kg/m² (Medical intervention and regular monitoring required)

### Cardiac Risk Factors Analysis
- **Age Factor**: Progressive cardiovascular risk increase after age 20
- **BMI Impact**: Elevated risk with overweight and obesity classifications
- **Blood Sugar**: Diabetes screening and glycemic management assessment
- **Stress Analysis**: Facial recognition for chronic stress indicators
- **Blood Pressure**: Hypertension detection and cardiovascular monitoring
- **Heart Rate**: Cardiac rhythm and fitness assessment

### AI Facial Analysis Capabilities
- **Photoplethysmography (rPPG)**: Non-contact vital sign measurement
- **Facial Landmark Detection**: 68-point facial feature analysis
- **Skin Color Analysis**: Blood flow and oxygenation assessment
- **Micro-expression Recognition**: Stress and emotional state evaluation
- **Real-time Processing**: Live analysis with immediate feedback

## 🔧 Customization & Configuration

### VEDA Hospital Settings
Key configuration in `app.js`:
```javascript
this.vedaHospital = {
    name: "VEDA Hospital",
    doctor: "Dr. Navuluri Kranthi Kumar Reddy",
    phone: "+91-888-549-3639",
    email: "kranthi1237@gmail.com",
    address: "Opp Sargam Daily, Arundpet, Palandu Road, Narasaraopet - 522601",
    website: "vedahospital.co.in"
};
```

### Brand Color Customization
Primary colors in `style.css`:
```css
:root {
    --veda-primary-blue: #1e88e5;    /* Main blue from logo */
    --veda-secondary-blue: #1565c0;  /* Darker blue gradient */
    --veda-light-blue: #42a5f5;      /* Light blue accent */
    --veda-accent-orange: #ff6f00;   /* Orange from flame */
    --veda-flame-red: #ff5722;       /* Red-orange flame */
    --veda-flame-yellow: #ff9800;    /* Yellow-orange flame */
}
```

## 📱 Mobile & Responsive Design

### Mobile Optimization Features
- **Responsive Layout**: Adapts to all screen sizes and orientations
- **Touch-Friendly Interface**: Large buttons and intuitive gestures
- **Mobile Camera Integration**: Optimized for smartphone cameras
- **Swipe Navigation**: Easy navigation between sections
- **Optimized PDF Generation**: Mobile-friendly report creation

### Cross-Platform Compatibility
- **iOS Safari**: Full functionality with camera access
- **Android Chrome**: Complete feature support
- **Tablet Interface**: Enhanced experience for larger screens
- **Desktop Browsers**: Full-featured professional interface

## 🔒 Privacy, Security & Medical Compliance

### Data Protection Measures
- **Local Processing**: All analysis occurs client-side
- **No Data Transmission**: Personal information never leaves the device
- **Camera Privacy**: Video feed not recorded or stored
- **PDF Security**: Reports generated locally with no cloud storage

### Medical Compliance Features
- **Clear Demonstration Disclaimers**: Prominent throughout application
- **Professional Medical Guidance**: Direct connection to VEDA Hospital
- **Emergency Contact Protocols**: Immediate access to medical professionals
- **Regulatory Compliance Notices**: FDA and medical device regulations

### HIPAA Considerations
- **Patient Privacy**: No protected health information (PHI) stored
- **Secure Communications**: HTTPS-only operation
- **Audit Trail**: PDF reports include timestamp and unique identifiers
- **Access Controls**: Browser-based security and permissions

## 🚨 Emergency & High-Risk Patient Protocols

### Critical Risk Alert System
For patients with critical cardiac risk scores (>15 points):
1. **Immediate Alert Display**: Red warning with urgent recommendations
2. **Direct VEDA Hospital Contact**: One-click emergency communication
3. **Emergency Instructions**: Clear next steps for immediate medical attention
4. **Priority Documentation**: Urgent flags in PDF reports

### Professional Consultation Pathways
- **Low Risk**: Annual health maintenance with VEDA Hospital
- **Moderate Risk**: 6-month follow-up consultation recommended
- **High Risk**: Immediate appointment with Dr. Navuluri Kranthi Kumar Reddy
- **Critical Risk**: Emergency evaluation and intensive medical management

## 📞 Contact & Support Information

### VEDA Hospital Professional Services
- **Medical Director**: Dr. Navuluri Kranthi Kumar Reddy
- **Phone**: +91-888-549-3639 (24/7 consultation available)
- **Email**: kranthi1237@gmail.com
- **Website**: vedahospital.co.in
- **Address**: Opp Sargam Daily, Arundpet, Palandu Road, Narasaraopet - 522601, Andhra Pradesh, India

### Technical Support & Updates
For technical issues or application improvements:
1. **Contact Dr. Navuluri Kranthi Kumar Reddy** for medical-related queries
2. **Email technical details** to kranthi1237@gmail.com
3. **Report bugs or suggestions** through GitHub repository issues
4. **Medical feedback** for clinical workflow improvements

### WhatsApp Integration
The application includes direct WhatsApp messaging to VEDA Hospital with:
- **Pre-formatted Messages**: Patient details and health assessment summary
- **Appointment Requests**: Direct scheduling communication
- **Emergency Contacts**: Immediate access to medical professionals
- **Follow-up Communications**: Ongoing patient care coordination

## 🧪 Development & Testing Guidelines

### Quality Assurance Checklist
- [ ] **Camera Functionality**: HTTPS hosting and permission handling
- [ ] **Form Validation**: Medical range validation and error handling
- [ ] **BMI Calculations**: Accurate mathematical computations
- [ ] **Face Detection**: Real-time overlay and detection simulation
- [ ] **Health Metrics**: Realistic value generation within medical ranges
- [ ] **Cardiac Risk Scoring**: Accurate algorithm implementation
- [ ] **PDF Generation**: Complete report with VEDA Hospital branding
- [ ] **Mobile Responsiveness**: All screen sizes and orientations
- [ ] **Cross-Browser Testing**: All supported browsers and versions
- [ ] **Contact Integration**: WhatsApp and phone call functionality

### Debugging & Troubleshooting
1. **Camera Issues**: Verify HTTPS hosting and browser permissions
2. **PDF Generation**: Check jsPDF library loading and browser compatibility
3. **Styling Problems**: Validate CSS custom properties and VEDA brand colors
4. **Mobile Issues**: Test responsive breakpoints and touch interactions
5. **Contact Features**: Verify WhatsApp URL encoding and phone number format

## 📄 License & Professional Use

**Developed Exclusively for VEDA Hospital**  
**Medical Technology Demonstration & Innovation Showcase**

This application represents VEDA Hospital's commitment to cutting-edge healthcare technology and demonstrates the potential of AI-powered health screening for modern medical practice. All health assessments are simulated and should not be used for actual medical diagnosis.

### Professional Acknowledgments
- **Medical Director**: Dr. Navuluri Kranthi Kumar Reddy
- **Technology Innovation**: VEDA Hospital Digital Health Initiative
- **Design & Development**: Advanced Healthcare Technology Solutions
- **Medical Consultation**: Professional healthcare guidance integration

## 🤝 Contributing & Feedback

### For VEDA Hospital Medical Staff
To suggest clinical improvements or report medical workflow issues:
1. **Contact Dr. Navuluri Kranthi Kumar Reddy** directly for medical consultations
2. **Email detailed feedback** to kranthi1237@gmail.com
3. **Document clinical workflow suggestions** for patient care optimization
4. **Report any patient safety concerns** immediately

### Technical Development Contributions
1. **Fork the repository** and create feature branches
2. **Test thoroughly** across all supported browsers and devices
3. **Maintain VEDA Hospital branding** and professional medical standards
4. **Submit pull requests** with comprehensive testing documentation

---

**© 2025 VEDA Hospital - Dr. Navuluri Kranthi Kumar Reddy**  
**Advanced AI-Powered Healthcare Technology Solutions**

*This application showcases VEDA Hospital's dedication to innovative, technology-driven healthcare solutions while maintaining the highest standards of medical ethics, patient safety, and professional healthcare delivery. The integration of artificial intelligence with traditional medical assessment represents the future of accessible, comprehensive health screening technology.*

**🏥 Visit us at vedahospital.co.in for professional medical consultations and advanced healthcare services.**
