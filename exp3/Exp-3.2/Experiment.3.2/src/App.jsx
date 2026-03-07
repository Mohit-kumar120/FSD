import React, { useState } from "react";
import "./App.css";

/* =========================
   Base Class
========================= */
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Hello, my name is ${this.name}.`;
  }
}

/* =========================
   Student Class
========================= */
class Student extends Person {
  constructor(name, age, major) {
    super(name, age);
    this.major = major;
  }

  introduce() {
    return `Hello, my name is ${this.name} and I'm studying ${this.major}.`;
  }
}

/* =========================
   Teacher Class
========================= */
class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  introduce() {
    return `Hello, my name is ${this.name} and I teach ${this.subject}.`;
  }
}

function App() {
  const [people, setPeople] = useState([
    new Person("Alex Johnson", 30),
    new Student("Emma Watson", 20, "Computer Science"),
    new Teacher("Dr. James Wilson", 45, "Mathematics"),
  ]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    type: "Person",
    extra: "",
  });

  /* =========================
     Handle Input Change
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     Add New Person
  ========================= */
  const handleAdd = () => {
    let newPerson;

    if (formData.type === "Student") {
      newPerson = new Student(
        formData.name,
        Number(formData.age),
        formData.extra
      );
    } else if (formData.type === "Teacher") {
      newPerson = new Teacher(
        formData.name,
        Number(formData.age),
        formData.extra
      );
    } else {
      newPerson = new Person(
        formData.name,
        Number(formData.age)
      );
    }

    setPeople([...people, newPerson]);

    // Reset form
    setFormData({
      name: "",
      age: "",
      type: "Person",
      extra: "",
    });
  };

  /* =========================
     Remove Person
  ========================= */
  const handleRemove = (index) => {
    const updated = people.filter((_, i) => i !== index);
    setPeople(updated);
  };

  return (
    <div className="container">
      <h1>Person Class Hierarchy</h1>

      {/* ================= FORM ================= */}
      <div className="card">
        <h2>Add New Person</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="Person">Person</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
        </select>

        {(formData.type === "Student" ||
          formData.type === "Teacher") && (
          <input
            type="text"
            name="extra"
            placeholder={
              formData.type === "Student"
                ? "Major"
                : "Subject"
            }
            value={formData.extra}
            onChange={handleChange}
          />
        )}

        <button onClick={handleAdd}>Add</button>
      </div>

      {/* ================= DISPLAY ================= */}
      {people.map((person, index) => (
        <div className="card" key={index}>
          <h2>
            {person.name} (
            {person instanceof Student
              ? "Student"
              : person instanceof Teacher
              ? "Teacher"
              : "Person"}
            )
          </h2>

          <p>Age: {person.age}</p>
          <p className="intro">{person.introduce()}</p>

          {person instanceof Student && (
            <p>Major: {person.major}</p>
          )}

          {person instanceof Teacher && (
            <p>Teaching: {person.subject}</p>
          )}

          <button onClick={() => handleRemove(index)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
