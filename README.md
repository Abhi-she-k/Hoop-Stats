# 🏀 HoopStats

**HoopStats** is a simple and powerful **basketball stats API** built with **Node.js** and **Express**. It scrapes live NBA stats directly from [Basketball-Reference](https://www.basketball-reference.com/) and serves them through a clean API. Whether you're building an app, crunching numbers, or just love hoops — HoopStats gives you easy access to the data you need.

---

## 🚀 Features

- 🔄 Live stat scraping from Basketball-Reference  
- 🧑‍💻 Player and Game stat endpoints  
- 📆 Game stats by year  
- 🌐 Simple and responsive web interface  
- ⚙️ Built with Node.js, Express, and MySQL

---

## 📦 Getting Started

### Prerequisites

- Node.js v14 or later
- npm
- MySQL database

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/hoopstats.git
    cd hoopstats
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

4. Start the server:

    ```bash
    npm start
    ```

5. Open your browser and navigate to:

    ```
    http://localhost:3004
    ```

---

## 🌐 API Endpoints

Base URL: `http://localhost:3004`

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/players/:year`       | Get stats for all players in a specific year |
| GET    | `/player/:player/:year`| Get stats for a specific player in a specific year |
| GET    | `/games/:year`         | Get game stats for a specific year |

### Example Requests

1. **Get all players for a specific year:**

    ```bash
    curl http://localhost:3004/players/2023
    ```

2. **Get stats for a specific player:**

    ```bash
    curl http://localhost:3004/player/stephen%20curry/2023
    ```

3. **Get game stats for a specific year:**

    ```bash
    curl http://localhost:3004/games/2023
    ```

---

## 📚 Tech Stack

- **Node.js + Express** – Backend server and routing  
- **MySQL** – Database for storing player and game stats  
- **HTML/CSS** – For rendering the frontend (static files)
- **Azure MySQL DB, Azure Webapp** – For cloud side

---

## 📎 Use Cases

- Fantasy sports tools  
- Custom dashboards or bots  
- Analytics & reporting  
- Sports content creation (e.g., social media stat drops)

---
