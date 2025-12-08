# HMCTS Task Management System

A full-stack task management application with a React TypeScript frontend and FastAPI Python backend. This project was created as part of an application to HMCTS (Her Majesty's Courts and Tribunals Service).

## Project Structure

```
HMCTS/
├── Backend/          # FastAPI backend application
│   ├── src/
│   │   ├── main.py           # FastAPI application entry point
│   │   └── tasks/            # Task-related modules
│   │       ├── api.py        # API endpoints
│   │       ├── database.py   # Database configuration
│   │       ├── models.py     # SQLAlchemy models
│   │       ├── schemas.py    # Pydantic schemas
│   │       └── service.py    # Business logic
│   ├── mysql_schemas/
│   │   └── dbcreate.sql      # Database schema
│   └── pyproject.toml        # Python dependencies
│
└── Frontend/         # React TypeScript frontend application
    ├── src/
    │   ├── App.tsx       # Main application component
    │   ├── App.css       # Application styles (UK Government Design System)
    │   ├── main.tsx      # Application entry point
    │   ├── index.css     # Global styles
    │   └── assets/       # Static assets
    │       └── logo.png  # Application logo
    ├── public/           # Public static files
    ├── index.html        # HTML template
    ├── package.json      # Node.js dependencies
    ├── tsconfig.json     # TypeScript configuration
    ├── vite.config.ts    # Vite configuration
    └── eslint.config.js  # ESLint configuration
```

## Technologies

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PyMySQL** - MySQL database connector
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **MySQL** - Database

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling

## Prerequisites

- **Python 3.12+** with `uv` package manager
- **Node.js** (v18 or higher recommended)
- **MySQL** server running locally
- **npm** or **yarn** package manager

## Backend Setup

### 1. Install Dependencies

Navigate to the Backend directory and install dependencies using `uv`:

```bash
cd Backend
uv sync
```

This will install all required packages including:
- FastAPI
- SQLAlchemy
- PyMySQL
- Cryptography (required for MySQL authentication)
- Uvicorn

### 2. Database Setup

1. Ensure MySQL is running on your local machine
2. Create the database:
   ```sql
   CREATE DATABASE hmcts;
   ```
3. Run the schema file (if needed):
   ```bash
   mysql -u root -p hmcts < mysql_schemas/dbcreate.sql
   ```

### 3. Database Configuration

Update the database connection string in `Backend/src/tasks/database.py` if needed:
```python
DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/hmcts"
```

### 4. Running the Backend Server

**Important:** Always run the server using `uv run` to ensure it uses the correct virtual environment:

```bash
cd Backend
uv run python src/main.py
```

Or alternatively:

```bash
cd Backend
uv run uvicorn src.main:app --host 127.0.0.1 --port 8000
```

The server will start on `http://127.0.0.1:8000`

## Frontend Setup

### 1. Install Dependencies

Navigate to the Frontend directory and install dependencies:

```bash
cd Frontend
npm install
```

### 2. Running the Frontend Development Server

```bash
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is occupied)

### 3. Building for Production

```bash
cd Frontend
npm run build
```

The production build will be in the `dist/` directory.

## API Endpoints

### Create Task
- **Endpoint:** `POST /`
- **Status Code:** `201 Created`
- **Request Body:**
  ```json
  {
    "title": "Task title",
    "description": "Task description (optional)",
    "status": "pending" | "in_progress" | "completed",
    "deadline": "2024-12-31T18:30:00"
  }
  ```
  Note: `deadline` must be in ISO datetime format (YYYY-MM-DDTHH:mm:ss)
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "status": "pending",
    "deadline": "2024-12-31T18:30:00",
    "created_at": "2024-01-01T12:00:00"
  }
  ```

## Features

### Frontend Features
- **Task Creation Form** - Create new tasks with title, description, status, and deadline
- **Calendar Date Picker** - Visual calendar popup for selecting dates
- **Time Picker** - Visual time picker with hour and minute selection
- **Modal Pop-up** - Displays task details in a pop-up after successful creation
- **Status Badges** - Color-coded status indicators (pending, in_progress, completed)
- **UK Government Design System** - Styled according to UK Government design standards
- **Responsive Design** - Modern UI with black header strip and logo
- **Form Validation** - Client-side validation for task inputs

### Backend Features
- **RESTful API** - Clean API design following REST principles
- **Database Integration** - MySQL database with SQLAlchemy ORM
- **CORS Support** - Configured for frontend communication
- **Type Safety** - Pydantic schemas for request/response validation
- **Error Handling** - Proper error responses

## Development

### Backend Development
- The backend uses FastAPI's automatic API documentation
- Visit `http://127.0.0.1:8000/docs` for Swagger UI
- Visit `http://127.0.0.1:8000/redoc` for ReDoc documentation

### Frontend Development
- Hot Module Replacement (HMR) is enabled in development mode
- TypeScript provides type checking during development
- ESLint is configured for code quality

## Troubleshooting

### Backend Issues

**Cryptography Error:**
If you see `RuntimeError: 'cryptography' package is required`, make sure you're running the server with `uv run`:
```bash
uv run python src/main.py
```

**Database Connection Error:**
- Verify MySQL is running
- Check database credentials in `Backend/src/tasks/database.py`
- Ensure the `hmcts` database exists

### Frontend Issues

**CORS Errors:**
- Ensure the backend server is running
- Verify the API URL in `Frontend/src/App.tsx` matches your backend URL

**Port Already in Use:**
- Vite will automatically use the next available port
- Or specify a different port: `npm run dev -- --port 3000`

## About

This project was created as part of an application to HMCTS (Her Majesty's Courts and Tribunals Service). It is not an official HMCTS system, but rather a demonstration project showcasing a task management application.

