class StudentManager {
    constructor() {
        this.apiUrl = '/api/students';
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStudents();
    }

    bindEvents() {
        document.getElementById('student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.resetForm();
        });
    }

    async loadStudents() {
        try {
            const response = await fetch(this.apiUrl);
            const students = await response.json();
            this.renderStudents(students);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    renderStudents(students) {
        const container = document.getElementById('students-list');
        
        if (students.length === 0) {
            container.innerHTML = '<div class="no-students">No students found</div>';
            return;
        }

        container.innerHTML = students.map(student => `
            <div class="student-card">
                <div class="student-info">
                    <div>Name: <span>${student.name}</span></div>
                    <div>Email: <span>${student.email}</span></div>
                    <div>Age: <span>${student.age}</span></div>
                    <div>Course: <span>${student.course}</span></div>
                </div>
                <div class="student-actions">
                    <button class="edit-btn" onclick="studentManager.editStudent(${student.id})">Edit</button>
                    <button class="delete-btn" onclick="studentManager.deleteStudent(${student.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async handleSubmit() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: parseInt(document.getElementById('age').value),
            course: document.getElementById('course').value
        };

        try {
            let response;
            if (this.currentEditId) {
                response = await fetch(`${this.apiUrl}/${this.currentEditId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (response.ok) {
                this.resetForm();
                this.loadStudents();
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }
    }

    async editStudent(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            const student = await response.json();
            
            document.getElementById('student-id').value = student.id;
            document.getElementById('name').value = student.name;
            document.getElementById('email').value = student.email;
            document.getElementById('age').value = student.age;
            document.getElementById('course').value = student.course;
            
            document.getElementById('form-title').textContent = 'Edit Student';
            document.getElementById('submit-btn').textContent = 'Update Student';
            document.getElementById('cancel-btn').style.display = 'block';
            
            this.currentEditId = id;
        } catch (error) {
            console.error('Error loading student:', error);
        }
    }

    async deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await fetch(`${this.apiUrl}/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.loadStudents();
                } else {
                    alert('Error deleting student');
                }
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    }

    resetForm() {
        document.getElementById('student-form').reset();
        document.getElementById('student-id').value = '';
        document.getElementById('form-title').textContent = 'Add New Student';
        document.getElementById('submit-btn').textContent = 'Add Student';
        document.getElementById('cancel-btn').style.display = 'none';
        this.currentEditId = null;
    }
}

// Initialize the application
const studentManager = new StudentManager();