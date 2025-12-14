# AI-Powered Automotive Intelligence Platform

## Prerequisites
- **Node.js**: v14+
- **MySQL**: Running on port 3306
- **Git**

## Setup & specific instructions

1.  **Database Connection**
    - Ensure your MySQL server is running.
    - Create a database named `automotive_ai_db` (or the app will try to create it).
    - Update `server/.env` with your MySQL credentials:
      ```
      DB_USER=root
      DB_PASSWORD=your_password
      ```
    - Run migrations manually if they failed:
      ```bash
      node server/scripts/setupDb.js
      ```

2.  **Server (Backend)**
    ```bash
    cd server
    npm install
    npm run dev
    ```
    Runs on `http://localhost:5000`.

3.  **Client (Frontend)**
    ```bash
    cd client
    npm install
    npm run dev
    ```
    Runs on `http://localhost:5173` (by default).

## Features
- **Manufacturer Dashboard**: Analytics, Predictions, User Targeting.
- **User Dashboard**: Car Recommendations, Maintenance Cost Prediction.
