# Talent Directory App

A full-stack application for managing a talent directory with filtering capabilities. Built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## Features

- View all talents in a beautiful card layout
- Add new talents with validation
- Filter talents by skill (case-insensitive)
- Real-time state management with Redux Toolkit
- Responsive design for all devices
- Error handling and loading states
- Input validation on both frontend and backend

## Tech Stack

### Frontend
- React 18+
- Redux Toolkit
- Axios
- TailwindCSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Express Validator
- CORS

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd talent-directory-app
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# Add the following variables:
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTTION_STRING
NODE_ENV=development

# Start MongoDB (if running locally)
# For Mac/Linux:
mongod

# For Windows:
# Start MongoDB service from Services

# Run the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:
```bash
# Navigate to the root directory (talent-directory-app)
cd talent-directory-app

# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file in root
# Add the following:
REACT_APP_API_URL=http://localhost:5000/api

# Start the React app
npm start
```

The frontend will start on `http://localhost:3000`

## Project Structure
```
talent-directory-app/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TalentList.js        # Displays all talents
│   │   │   ├── TalentForm.js        # Form to add new talent
│   │   │   └── SkillFilter.js       # Filter talents by skill
│   │   ├── redux/
│   │   │   ├── store.js             # Redux store configuration
│   │   │   ├── talentSlice.js       # Talent slice with reducers
│   │   │   └── talentThunks.js      # Async actions
│   │   ├── services/
│   │   │   └── api.js               # API service with Axios
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   └── Talent.js                # Talent mongoose model
│   ├── routes/
│   │   └── talents.js               # Talent routes
│   ├── middleware/
│   │   └── errorHandler.js          # Error handling middleware
│   ├── .env
│   ├── server.js                    # Express app entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

#### 1. Get All Talents
```
GET /talents
Response: { success: true, count: number, data: [...] }
```

#### 2. Filter Talents by Skill
```
GET /talents?skill=React
Response: { success: true, count: number, data: [...] }
```

#### 3. Add New Talent
```
POST /talents
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "skills": ["React", "Node.js"],
  "experience": 5
}
Response: { success: true, message: "Talent added successfully", data: {...} }
```

## Database Schema

### Talent Model
```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, valid email),
  skills: Array of Strings (required, min 1 skill),
  experience: Number (required, 0-50 years),
  createdAt: Date (auto-generated)
}
```

## Features in Detail

### Frontend (React + Redux)

1. **State Management**: Redux Toolkit with slices and thunks
2. **Components**:
   - `TalentList`: Displays talents in a responsive grid
   - `TalentForm`: Add new talents with validation
   - `SkillFilter`: Filter talents by skill
3. **Error Handling**: User-friendly error messages
4. **Loading States**: Loading indicators during API calls

### Backend (Node.js + Express)

1. **RESTful API**: Clean and organized endpoints
2. **Validation**: Express-validator for input validation
3. **Error Handling**: Centralized error handler middleware
4. **Database**: MongoDB with Mongoose ODM
5. **Security**: CORS enabled, input sanitization

## Testing the Application

### 1. Add a Talent

- Fill in the form with:
  - Name: "Jane Doe"
  - Email: "jane@example.com"
  - Skills: "React, Redux, JavaScript"
  - Experience: 3
- Click "Add Talent"
- The talent should appear immediately in the list

### 2. Filter by Skill

- Enter "React" in the filter input
- Click "Filter"
- Only talents with React skill should appear
- Click "Clear Filter" to see all talents again

### 3. Test Validation

- Try adding a talent without a name
- Try adding a talent with invalid email
- Try adding a talent with negative experience
- Error messages should appear

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if MONGODB_URI in .env is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Error
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env

### Port Already in Use
```bash
# Kill process on port 5000
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Update MONGODB_URI to production database
3. Deploy using Git

### Frontend Deployment (Vercel/Netlify)
1. Update REACT_APP_API_URL to production backend URL
2. Build: `npm run build`
3. Deploy the build folder

## Future Enhancements that can be done

- [ ] Edit and delete talent functionality
- [ ] Pagination for large datasets
- [ ] Advanced filtering (multiple skills, experience range)
- [ ] User authentication
- [ ] Talent profile pictures
- [ ] Export data to CSV
- [ ] Dark mode theme
