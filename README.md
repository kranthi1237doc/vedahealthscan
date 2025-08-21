# VEDA Health Scanner

🏥 **Advanced AI-Powered Health Screening Technology for VEDA Hospital**

![VEDA Hospital](https://img.shields.io/badge/VEDA-Hospital-blue) ![AI Health](https://img.shields.io/badge/AI-Health%20Scanner-green) ![Status](https://img.shields.io/badge/Status-Demo-orange)

## 📋 Overview

VEDA Health Scanner is a cutting-edge web application that demonstrates AI-powered facial health screening technology for VEDA Hospital. This innovative tool combines computer vision, facial analysis, and medical algorithms to provide comprehensive health assessments through non-invasive facial scanning.

**Developed for:** VEDA Hospital  
**Medical Director:** Dr. Navil Kumar  
**Contact:** +91-888-549-3639 | krantu237@gmail.com  
**Location:** Opp Sargam Daily, Arundpet, Palandu Road, Narasaraopet - 522601

## ⚠️ Important Medical Disclaimer

**FOR DEMONSTRATION PURPOSES ONLY**

This application is developed for educational and demonstration purposes to showcase VEDA Hospital's commitment to innovative healthcare technology. It is **NOT** intended for medical diagnosis or treatment. Always consult Dr. Navil Kumar or qualified healthcare professionals at VEDA Hospital for medical advice.

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
- Age factor calculation
- BMI impact assessment
- Blood sugar level analysis
- Facial stress detection
- Blood pressure evaluation
- Heart rate analysis

**Risk Categories:**
- 🟢 **Low Risk** (0-5 points): Annual check-ups
- 🟡 **Moderate Risk** (6-10 points): 6-month follow-up
- 🟠 **High Risk** (11-15 points): Immediate consultation
- 🔴 **Critical Risk** (>15 points): Urgent medical evaluation

### 📄 Professional PDF Reports
Generated reports include:
- VEDA Hospital letterhead and branding
- Complete patient demographics
- BMI calculation and interpretation
- All facial scan health metrics
- Detailed cardiac risk breakdown
- Personalized health recommendations
- Medical disclaimers and contact information

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera/webcam access
- HTTPS connection (required for camera access)
- Internet connection for PDF generation libraries

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/your-username/veda-health-scanner.git
   cd veda-health-scanner
   ```

2. **File Structure**
   ```
   veda-health-scanner/
   ├── index.html          # Main application file
   ├── style.css           # VEDA Hospital styling
   ├── app.js             # JavaScript functionality
   └── README.md          # This documentation
   ```

3. **Deploy to GitHub Pages**
   - Upload files to your GitHub repository
   - Go to repository Settings → Pages
   - Select "Deploy from a branch" → "main"
   - Access at: `https://your-username.github.io/repository-name`

### Local Development
For local testing, use a local server due to camera permissions:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Access at: http://localhost:8000
```

## 🎯 How to Use

### Step 1: Patient Information
1. Open the VEDA Health Scanner application
2. Fill in required patient details:
   - Full Name
   - Age (18-100 years)
   - Height (100-250 cm)
   - Weight (30-200 kg)
   - Blood Sugar Level (optional)
   - Gender and Contact Information
3. BMI is automatically calculated and displayed
4. Click "Continue to Health Scan"

### Step 2: Facial Health Scan
1. Click "Start Camera" and grant permission
2. Position your face in the center of the frame
3. Ensure good lighting and look directly at camera
4. Click "Begin Health Analysis"
5. Remain still during the 10-second scanning process

### Step 3: Review Results
1. View overall health score and cardiac risk assessment
2. Review detailed health metrics and interpretations
3. Read personalized recommendations
4. Generate PDF report for records
5. Contact VEDA Hospital if needed

## 🛠️ Technical Implementation

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Camera Access**: WebRTC getUserMedia API
- **Graphics**: HTML5 Canvas for face detection overlay
- **PDF Generation**: jsPDF and html2canvas libraries
- **Styling**: Custom CSS with VEDA Hospital branding
- **Responsive Design**: Mobile and tablet compatible

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers with camera support

### Security Features
- HTTPS-only camera access
- Client-side processing (no data transmission)
- Professional medical disclaimers
- Privacy-preserving architecture

## 🏥 Medical Integration

### VEDA Hospital Branding
- Professional medical interface design
- Hospital logo and color scheme integration
- Dr. Navil Kumar contact information
- Emergency consultation protocols

### Clinical Workflow
1. **Patient Registration**: Collect basic demographics
2. **Health Assessment**: AI-powered facial analysis
3. **Risk Stratification**: Automated cardiac risk scoring
4. **Clinical Decision Support**: Risk-based recommendations
5. **Documentation**: Professional PDF report generation
6. **Follow-up**: Direct contact with VEDA Hospital

## 📈 Health Metrics Details

### BMI Classification
- **Underweight**: <18.5 kg/m² (Nutritional consultation recommended)
- **Normal**: 18.5-24.9 kg/m² (Maintain current lifestyle)
- **Overweight**: 25-29.9 kg/m² (Lifestyle modifications needed)
- **Obese**: ≥30 kg/m² (Medical intervention recommended)

### Cardiac Risk Factors
- **Age**: Progressive risk increase after 20 years
- **BMI**: Elevated risk with overweight/obesity
- **Blood Sugar**: Diabetes screening and management
- **Stress**: Facial analysis for chronic stress indicators
- **Blood Pressure**: Hypertension detection and monitoring
- **Heart Rate**: Cardiac rhythm assessment

## 🔧 Customization

### VEDA Hospital Configuration
Key configuration in `app.js`:
```javascript
this.vedaHospital = {
    name: "VEDA Hospital",
    doctor: "Dr. Navuluri Kranthi Kumar Reddy", 
    phone: "+91-888-549-3639",
    email: "kranthi1237@gmail.com",
    address: "Opp Sargam Daily, Arundpet, Palandu Road, Narasaraopet - 522601"
};
```

### Styling Customization
Primary colors in `style.css`:
```css
:root {
    --veda-primary: #2563eb;    /* VEDA Blue */
    --veda-secondary: #1e40af;  /* Dark Blue */
    --veda-accent: #dc2626;     /* Red Accent */
    --veda-success: #10b981;    /* Success Green */
}
```

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface elements
- Mobile camera optimization
- Swipe gestures for navigation
- Optimized PDF generation for mobile

## 🔒 Privacy & Security

### Data Protection
- All processing occurs client-side
- No personal data transmitted to external servers
- Camera feed not recorded or stored
- PDF reports generated locally

### Medical Compliance
- Clear demonstration disclaimers
- Professional medical guidance
- Emergency contact protocols
- Regulatory compliance notices

## 🚨 Emergency Protocols

### High-Risk Patients
For patients with critical risk scores:
1. **Immediate Display**: Red alert with urgent message
2. **Direct Contact**: One-click VEDA Hospital contact
3. **Emergency Instructions**: Clear next steps
4. **Documentation**: PDF report with urgent recommendations

### Contact VEDA Hospital
- **Phone**: +91-888-549-3639
- **WhatsApp**: Integrated messaging
- **Email**: kranthi237@gmail.com
- **Emergency**: 24/7 consultation available

## 🧪 Development & Testing

### Testing Checklist
- [ ] Camera permissions and functionality
- [ ] Form validation and BMI calculation
- [ ] Face detection and scanning simulation
- [ ] Health metrics generation
- [ ] Cardiac risk scoring accuracy
- [ ] PDF report generation
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Debugging Tips
1. **Camera Issues**: Check HTTPS and permissions
2. **PDF Generation**: Verify jsPDF library loading
3. **Styling Problems**: Check CSS custom properties
4. **Mobile Issues**: Test responsive breakpoints

## 📄 License & Attribution

**Developed for VEDA Hospital**  
**Medical Technology Demonstration**

This application showcases innovative healthcare technology for educational purposes. All medical assessments are simulated and should not be used for actual medical diagnosis.

## 🤝 Contributing

### For VEDA Hospital Staff
To suggest improvements or report issues:
1. Contact Dr. Navuluri Kranthi KUmar Reddy directly
2. Email technical details to kranthi237@gmail.com
3. Document any clinical workflow suggestions

### Technical Contributions
1. Fork the repository
2. Create feature branch
3. Test thoroughly
4. Submit pull request with medical review

## 📞 Support & Contact

### VEDA Hospital
- **Medical Director**: Dr. Navuluri Kranthi Kumar Reddy
- **Phone**: +91-888-549-3639
- **Email**: kranthi237@gmail.com
- **Address**: Opp Sargam Daily, Arundpet, Palandu Road, Narasaraopet - 522601

### Technical Support
For technical issues with the application:
1. Check browser compatibility
2. Verify HTTPS hosting
3. Test camera permissions
4. Contact VEDA Hospital IT support

---

**© 2025 VEDA Hospital - Advanced Healthcare Technology**

*This application represents VEDA Hospital's commitment to innovative, technology-driven healthcare solutions while maintaining the highest standards of medical ethics and patient safety.*
