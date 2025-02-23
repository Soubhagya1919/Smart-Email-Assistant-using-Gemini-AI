# **Smart Email Assistant - Chrome Extension**

🚀 **A Chrome Extension for Drafting Professional Gmail Responses**  
Powered by **Spring Boot** (Backend) and **JavaScript** (Frontend), this Chrome extension leverages the **Gemini AI API** to help users draft professional, context-aware email responses directly within Gmail.

---

## **Features**
- **AI-Powered Drafting**: Uses Gemini AI to generate professional and contextually relevant email responses.
- **Seamless Integration**: Works directly within Gmail as a Chrome extension.
- **Customizable Responses**: Allows users to tweak AI-generated drafts before sending.
- **Secure & Scalable**: Built with **Spring Boot** for a robust backend and **JavaScript** for a smooth frontend experience.
- **User-Friendly**: Simple and intuitive interface for effortless email drafting.

---

## **Tech Stack**
- **Backend**: Spring Boot (Java)
- **Frontend**: JavaScript, HTML, CSS
- **AI Integration**: Gemini AI API
- **Browser Extension**: Chrome Extension API
- **Build Tools**: Maven (Backend), Vite (Frontend)

---

## **How It Works**
1. **Install the Extension**: Add the extension to your Chrome browser.
2. **Open Gmail**: Compose or reply to an email as usual.
3. **Generate Drafts**: Click the extension button to generate a professional draft using Gemini AI.
4. **Customize & Send**: Edit the draft if needed and send it directly.

---

## **Installation**

### **Prerequisites**
- Java Development Kit (JDK) 17 or later
- Node.js and npm (for frontend development)
- Chrome browser
- Gemini AI API key

### **Steps to Set Up**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Soubhagya1919/Smart-Email-Assistant-using-Gemini-AI.git
   cd Smart-Email-Assistant-using-Gemini-AI
   ```

2. **Set Up the Backend**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Add your Gemini API key to the `application.properties` file:
     ```properties
     gemini.api.key=your-api-key-here
     ```
   - Build and run the Spring Boot application:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

3. **Set Up the Frontend**:
   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Build the project:
     ```bash
     npm run build
     ```

4. **Load the Chrome Extension**:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable **Developer Mode**.
   - Click **Load Unpacked** and select the `frontend/dist` directory.

---

## **Configuration**
- **Gemini API Key**: Add your Gemini API key to the `backend/src/main/resources/application.properties` file.
- **Backend URL**: Update the frontend code to point to your backend server URL (if not running locally).

---

## **Usage**
1. Open Gmail in your Chrome browser.
2. Click the **Smart Email Assistant** extension icon in the toolbar.
3. Compose or reply to an email, and click the extension button to generate a draft.
4. Review and customize the draft, then send it.

---

## **Screenshots**
![Demo Screenshot](screenshots/demo.png)

---

## **Contributing**
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**
- **Gemini AI**: For providing the AI API.
- **Spring Boot**: For the robust backend framework.
- **Chrome Extension API**: For enabling seamless browser integration.

---
