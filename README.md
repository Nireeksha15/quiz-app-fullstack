 Frontend: React  
Backend: Node.js + Express  
Database: MySQL  

This application allows users to:
- Enter their name
- Attempt a quiz
- Submit answers
- View their score
- Store attempt data in the database
  
How to Run the Project
 1️.Start Backend

cd backend  
npm install  
node server.js  

Backend runs on:  
http://localhost:5000  

2. Start Frontend

cd frontend  
npm install  
npm start  

Frontend runs on:  
http://localhost:3000  


API Endpoints

GET /questions → Fetch quiz questions  

POST /submit → Submit quiz and get score  

POST /attempt → Store user attempt  

 Sample Output

User: Niru  
Score: 1  
Attempt ID: 3  

 Future Improvements

- Timer for quiz  
- Multiple quiz categories  
- Leaderboard  
- Authentication (login/signup)  

 Author
Nireeksha J  
