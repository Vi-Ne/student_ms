from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

# Use PostgreSQL database with asyncpg
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql+asyncpg://student_db_xkk1_user:6wRBSgMWVvreJDiye6uDaqWIae1WuSSd@dpg-d5dta0v5r7bs73c6btdg-a.oregon-postgres.render.com/student_db_xkk1')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    course = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create tables after model definition
@app.route('/')
def index():
    try:
        # Ensure tables exist
        db.create_all()
        students = Student.query.all()
        return render_template('index.html', students=students)
    except Exception as e:
        # If templates don't exist, return simple HTML
        return f'''
        <!DOCTYPE html>
        <html>
        <head><title>Student Management</title></head>
        <body>
            <h1>Student Management System</h1>
            <p>No students found. <a href="/add">Add a student</a></p>
        </body>
        </html>
        '''

@app.route('/add', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        student = Student(
            name=request.form['name'],
            email=request.form['email'],
            age=int(request.form['age']),
            course=request.form['course']
        )
        try:
            db.session.add(student)
            db.session.commit()
            flash('Student added successfully!', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            flash('Error adding student. Email might already exist.', 'error')
    return render_template('add_student.html')

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_student(id):
    student = Student.query.get_or_404(id)
    if request.method == 'POST':
        student.name = request.form['name']
        student.email = request.form['email']
        student.age = int(request.form['age'])
        student.course = request.form['course']
        try:
            db.session.commit()
            flash('Student updated successfully!', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            flash('Error updating student.', 'error')
    return render_template('edit_student.html', student=student)

@app.route('/delete/<int:id>')
def delete_student(id):
    student = Student.query.get_or_404(id)
    db.session.delete(student)
    db.session.commit()
    flash('Student deleted successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/view/<int:id>')
def view_student(id):
    student = Student.query.get_or_404(id)
    return render_template('view_student.html', student=student)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))