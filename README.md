# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
# Daily-readings-app
Daily-readings is a professional full-stack React application designed to bring the daily Catholic liturgy and historical saint hagiography to your fingertips. By integrating multiple global APIs, the app provides real-time scripture readings and automatically "generates" historical portraits of the Saint of the Day.
## 🚀 Features
### 📂 Daily Liturgical Dashboard
Automatically fetches today’s Mass readings (First Reading, Psalm, and Gospel) based on your specific timezone.
### 🖼️ Smart Saint Iconography
Uses the Wikipedia API to dynamically find and display high-quality historical art and biographies for the specific saint being celebrated each day.
### 🎨 Liturgical Color Sync
The UI accent colors and badges automatically update to match the current liturgical season (White for Easter/Feasts, Green for Ordinary Time, Red for Martyrs, etc.).
### 💾 Smart Caching
Includes LocalStorage integration to save data locally, ensuring fast load times and reduced API calls for repeat visits.
### 📱 Responsive Experience
A split-pane "Sticky" layout that works seamlessly across mobile, tablet, and desktop devices.
### 🌍 Timezone Awareness
Uses advanced date formatting to ensure users in different parts of the world always see the correct readings for their local sunrise.

## 🧱 Tech Stack
### Frontend
- React (Vite)
- Tailwind CSS / Custom Modern UI
- React Hot Toast (for elegant notifications)
- Wikipedia API (for imagery and biographies)
### Backend
- Node.js & Express
- Evangelizo API Wrapper (Core liturgical data source)
- CORS-enabled Proxy
- 
## 📂 Project Structure
```
Daily-readings-app/
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx        # Main Dashboard Logic
│   │   ├── main.jsx
│   │   └── index.css      # Custom Inter Typography & Modern Styles
│   └── package.json
│
├── Backend/
│   ├── server.js          # Node.js API Bridge
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup
1. Fork & Clone the Repository
```bash
git clone https://github.com
cd Daily-readings-app
```
2. Setup Backend
```bash
cd Backend
npm install
node server.js
```
### Backend runs on: http://localhost:5000
3. Setup Frontend
```bash
# Open a new terminal
cd Frontend
npm install
npm run dev
```
### Frontend runs on: http://localhost:5173
## 🎯 How to Use the App
- Daily Reflections: Open the app to immediately see the liturgical title and scripture for the day.
- Meet the Saints: View the portrait of today's celebrated figure and read their historical summary.
- Deep Dive: Click the "Learn More on Catholic Online" link to read full hagiographies and theological reflections.
- Readings: Scroll through the First Reading, Psalm, and Gospel in a clean, distraction-free environment.
  
## 🔮 Future Improvements
- 🎙️ Audio Integration: Built-in Text-to-Speech to listen to the daily readings.
- 📅 Calendar Picker: Select any date in the liturgical year to view past or future readings.
- ⛪ Parish Finder: Integration with Google Maps to find the nearest Mass times.
- 🔔 Daily Reminders: Push notifications for the morning Gospel.
  
## 🧠 Learning Outcomes
This project demonstrates proficiency in:
- Full-Stack Architecture: Managing data flow between a Node.js proxy and a React client.
- Asynchronous Programming: Orchestrating multiple parallel API fetches (Promise.all).
- Complex UI Logic: Handling "Loading" and "Error" states gracefully to prevent application crashes.
- Data Sanitization: Cleaning raw HTML/String data from legacy APIs for modern React rendering.
## 👨‍💻 Author
Deogracious Moriasi
### Passionate about building tools that bridge faith and technology.
