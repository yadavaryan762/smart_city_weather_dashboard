# 🌤️ Smart City Weather Dashboard

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A modern, responsive weather application that provides real-time atmospheric data, dynamic clothing suggestions, and intelligent search history management. Designed with a sleek glassmorphism UI, this project demonstrates proficiency in asynchronous JavaScript, DOM manipulation, and functional programming paradigms.

## 🚀 Live Demo
[View Live Project Here](https://smart-city-weather-dashboard-5kq99v508.vercel.app/)

## ✨ Key Features

- **Real-Time Weather Data:** Integrated with the **OpenWeatherMap API** to fetch instant, accurate global city temperature and condition updates.
- **Smart Clothing Suggestions:** Provides dynamic, actionable advice (e.g., "Bring an umbrella", "Wear a jacket") based on parsed weather conditions.
- **Intelligent Search History & Caching:** Automatically saves past searches using `localStorage`. Features advanced data manipulation including:
  - **Live Search & Filtering:** Filter history by city name or temperature ranges (Cold, Moderate, Hot).
  - **Dynamic Sorting:** Sort saved locations alphabetically or by temperature (Ascending/Descending).
  - **Statistical Insights:** Calculates and displays the average temperature of saved cities using array `reduce()`.
- **Debounced Search:** Implemented custom debounce logic to optimize API calls while typing, reducing unnecessary network requests and improving performance.
- **Dark/Light Mode:** Seamless theme toggling with user preference persistence across sessions.
- **Modern UI/UX:** Built a visually appealing interface using CSS Flexbox, custom properties (variables), and glassmorphism design principles.

## 🛠️ Technical Implementation

This project is built using vanilla web technologies, focusing on writing clean, efficient, and dependency-free code:

- **Frontend:** HTML5, CSS3 (Glassmorphism, Flexbox, CSS Variables)
- **Logic:** Vanilla JavaScript (ES6+)
- **Data Fetching:** Async/Await, Fetch API
- **State Management:** LocalStorage API
- **Algorithms:** Custom debounce functions, Array Higher-Order Functions (`map`, `filter`, `reduce`, `sort`) to manage history data without traditional loops.

## 💻 Getting Started

### Prerequisites
To run this project locally, you just need a web browser. No package managers or build tools are required.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-city-weather-dashboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd smart-city-weather-dashboard
   ```
3. Open `index.html` in your preferred web browser.

---
**Author:** Rishabh Yadav  
**Project Start:** March 23, 2026
# smart_city_weather_dashboard
