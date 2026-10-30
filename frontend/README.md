# 📝 NoteSpace – Full Stack Notes Application

A modern, responsive full-stack Notes Application built as part of the **CodeNova Full Stack Development Internship – Batch 01**.

NoteSpace provides a simple and organized workspace to create, manage, edit, search, and delete personal notes. It features a clean SaaS-inspired dashboard with real-time database persistence.

## ✨ Features

- **Create Notes** – Create notes with a title and description.
- **Edit Notes** – Update existing notes whenever needed.
- **Delete Notes** – Remove unwanted notes with confirmation.
- **Search Notes** – Search notes by title or content.
- **Grid & List View** – Switch between different note layouts.
- **Sort Notes** – Sort notes by newest or oldest.
- **Recently Updated** – Filter notes updated within the last 7 days.
- **Dashboard Statistics** – View total notes, recently updated notes, and latest activity.
- **Responsive UI** – Optimized for desktop, tablet, and mobile devices.
- **Toast Notifications** – Get feedback for successful and failed operations.
- **MongoDB Persistence** – Store notes securely in a MongoDB database.
- **REST API** – Perform CRUD operations through Express.js API endpoints.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Frontend development server |
| CSS3 | Styling and responsive design |
| Lucide React | Icons |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
CodeNova-Notes-App/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   │   └── Note.js
│   ├── routes/
│   │   └── noteRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CodeNova-Notes-App.git
```

```bash
cd CodeNova-Notes-App
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use NoteSpace.

## 🔗 API Endpoints

Base URL: `http://localhost:5000/api/notes`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Fetch all notes |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

### Example Note Object

```json
{
  "title": "My First Note",
  "content": "This is my first note using NoteSpace."
}
```

## 🖥️ Application Preview

The application includes:

- Modern SaaS-inspired dashboard
- Sidebar navigation
- Dashboard statistics
- Search and sorting controls
- Responsive notes cards
- Create and edit note modal
- Grid and list layouts

## 🔒 Security

- Environment variables are used for database configuration.
- MongoDB connection strings are not included in the repository.
- The `.env` file is excluded using `.gitignore`.

**Important:** Never upload your MongoDB connection string or other private credentials to GitHub.

## 🎯 Internship Project

**Program:** CodeNova Full Stack Development Internship  
**Batch:** 01  
**Task:** Task 1 – Notes Application  
**Project Type:** Full Stack Web Development

## 👨‍💻 Author

**Suresh Chavan**

GitHub: [@sureshchavn](https://github.com/sureshchavn)

LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/in/suresh-chavan/)

---

⭐ If you find this project useful, consider giving it a star!