const studentModel = require('../models/studentModel');

exports.showForm = (req, res) => {
    res.render('students');  // form page
};

exports.addStudent = (req, res) => {
    const { name, age } = req.body;
    studentModel.addStudent({ name, age });
    res.redirect('/students');   // go back to list
};

exports.getStudents = (req, res) => {
    const students = studentModel.getStudents();
    res.render('index', { students });  // list page
};

exports.showEditForm = (req, res) => {
    const student = studentModel.getStudentById(req.params.id);
    res.render('edit', { student });
};

exports.updateStudent = (req, res) => {
    const { name, age } = req.body;
    studentModel.updateStudent(req.params.id, { name, age });
    res.redirect('/students');
};

exports.deleteStudent = (req, res) => {
    studentModel.deleteStudent(req.params.id);
    res.redirect('/students');
};