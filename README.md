# Student Management System

A web-based student management system built with Flask and PostgreSQL, featuring full CRUD operations.

## Features

- **Create**: Add new students with name, email, age, and course
- **Read**: View all students in a table format and individual student details
- **Update**: Edit existing student information
- **Delete**: Remove students from the system
- **Responsive UI**: Bootstrap-based interface that works on all devices

## Local Development

### Prerequisites
- Python 3.8+
- PostgreSQL

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up PostgreSQL database:
   ```sql
   CREATE DATABASE student_db;
   ```

4. Set environment variables:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost/student_db"
   export SECRET_KEY="your-secret-key"
   ```

5. Run the application:
   ```bash
   python app.py
   ```

## Deployment on Render

### Method 1: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically detect the `render.yaml` file and create:
   - A PostgreSQL database
   - A web service with proper environment variables

### Method 2: Manual Setup
1. Create a new PostgreSQL database on Render
2. Create a new Web Service on Render
3. Set the following environment variables:
   - `DATABASE_URL`: (automatically provided by Render database)
   - `SECRET_KEY`: Generate a secure random string

### Build Settings
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn app:app`

## Database Schema

The application uses a single `Student` table with the following fields:
- `id`: Primary key (auto-increment)
- `name`: Student name (required)
- `email`: Student email (unique, required)
- `age`: Student age (required)
- `course`: Course name (required)
- `created_at`: Timestamp (auto-generated)

## API Endpoints

- `GET /` - List all students
- `GET /add` - Show add student form
- `POST /add` - Create new student
- `GET /edit/<id>` - Show edit student form
- `POST /edit/<id>` - Update student
- `GET /delete/<id>` - Delete student
- `GET /view/<id>` - View student details