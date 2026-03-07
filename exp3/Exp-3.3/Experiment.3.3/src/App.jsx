import React from "react";
import "./App.css";
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Hello, my name is ${this.name}.`;
  }
}

class Student extends Person {
  constructor(name, age, major) {
    super(name, age);
    this.major = major;
  }

  
  introduce() {
    return `Hello, my name is ${this.name} and I'm studying ${this.major}.`;
  }
}


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
 
  const people = [
    new Person("Alex Johnson", 30),
    new Student("Emma Watson", 20, "Computer Science"),
    new Teacher("Dr. James Wilson", 45, "Mathematics"),
  ];

  return (
    <div className="container">
      <h1>Person Class Hierarchy</h1>

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
        </div>
      ))}
    </div>
  );
}

export default App;
