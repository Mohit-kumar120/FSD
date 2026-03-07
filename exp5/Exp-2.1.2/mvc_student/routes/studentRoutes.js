const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// List page
router.get('/students', studentController.getStudents);

// Add form
router.get('/add', studentController.showForm);
router.post('/add', studentController.addStudent);

// 🔥 Edit routes
router.get('/edit/:id', studentController.showEditForm);
router.post('/edit/:id', studentController.updateStudent);
router.get('/delete/:id', studentController.deleteStudent);

module.exports = router;