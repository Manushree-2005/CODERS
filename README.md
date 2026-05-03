# Rural Medicine Network

## 🚀 Overview
A full-stack healthcare platform designed for rural areas to manage pharmacy services, patient records, and notifications. It integrates blockchain for secure medical records and SMS alerts for communication.

## 🔥 Features
- User registration & login
- Pharmacy inventory & prescription management
- Blockchain-based record storage (tamper-proof)
- SMS notifications using Twilio
- Distance-based service logic (for rural access)

## 🛠 Tech Stack
- Frontend: React
- Backend: Node.js, Express
- Database: MySQL
- Blockchain: Solidity / Web3
- SMS: Twilio API

## ⚙️ Setup Instructions

### Backend
cd backend  
npm install  
npm start  

### Frontend
cd frontend  
npm install  
npm start  

## 🔐 Environment Variables
Create a `.env` file in backend:

TWILIO_ACCOUNT_SID=your_sid  
TWILIO_AUTH_TOKEN=your_token  
DB_URL=your_db_url  

(Refer `.env.example`)

## 📌 Project Structure
backend/ → APIs, blockchain, SMS logic  
frontend/ → UI  
.env.example → required env variables  

## 👤 Author
Manushree L