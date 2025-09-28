const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

const studentsPath = path.join(__dirname, '../data/students.json');

const readStudents = () => JSON.parse(fs.readFileSync(studentsPath, 'utf8'));
const writeStudents = (students) => fs.writeFileSync(studentsPath, JSON.stringify(students, null, 2));

// Get all students (admin/mentor/recruiter only)
router.get('/', authenticate, authorize('admin', 'mentor', 'recruiter'), (req, res) => {
  try {
    const students = readStudents();
    const { department, semester, skills, cgpa } = req.query;
    
    let filteredStudents = students.filter(student => {
      if (department && student.department !== department) return false;
      if (semester && student.semester !== parseInt(semester)) return false;
      if (cgpa && student.cgpa < parseFloat(cgpa)) return false;
      if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim());
        const hasSkill = skillsArray.some(skill => 
          student.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasSkill) return false;
      }
      return true;
    });
    
    // Remove sensitive data
    filteredStudents = filteredStudents.map(({ password, ...student }) => student);
    
    res.json({ students: filteredStudents, total: filteredStudents.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student profile
router.get('/profile', authenticate, authorize('student'), (req, res) => {
  try {
    const { password, ...studentData } = req.user;
    res.json(studentData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update student profile
router.put('/profile', authenticate, authorize('student'), (req, res) => {
  try {
    const students = readStudents();
    const studentIndex = students.findIndex(s => s.id === req.user.id);
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const updatedStudent = {
      ...students[studentIndex],
      ...req.body,
      id: req.user.id, // Ensure ID doesn't change
      email: req.user.email, // Ensure email doesn't change
      role: req.user.role, // Ensure role doesn't change
      updatedAt: new Date().toISOString()
    };
    
    students[studentIndex] = updatedStudent;
    writeStudents(students);
    
    const { password, ...studentData } = updatedStudent;
    res.json({ message: 'Profile updated successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;