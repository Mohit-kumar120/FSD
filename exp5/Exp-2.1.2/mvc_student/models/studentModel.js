let students = [];

const getStudents = () => students;

const addStudent = (student) => {
    students.push({
        id: Date.now().toString(),
        ...student
    });
};

const getStudentById = (id) => {
    return students.find(student => student.id === id);
};

const updateStudent = (id, updatedData) => {
    const student = students.find(s => s.id === id);
    if (student) {
        student.name = updatedData.name;
        student.age = updatedData.age;
    }
};

const deleteStudent = (id) => {
    students = students.filter(student => student.id !== id);
};

module.exports = {
    getStudents,
    addStudent,
    getStudentById,
    updateStudent,
    deleteStudent
};