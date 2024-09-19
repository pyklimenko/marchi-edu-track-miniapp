import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import PersonInfo from './components/PersonInfo';

function App() {
  return (
    <div className="App">
      <RegistrationForm />
      <PersonInfo userType="student" />
      <PersonInfo userType="teacher" />
    </div>
  );
}

export default App;
