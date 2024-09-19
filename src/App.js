import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import StudentInfo from './components/StudentInfo';
import TeacherInfo from './components/TeacherInfo';

function App() {
  return (
    <div className="App">
      <RegistrationForm />
      <StudentInfo />
      <TeacherInfo />
    </div>
  );
}

export default App;