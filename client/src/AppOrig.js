import React, { useState } from 'react';
import './App.css';

function AppOrig() {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    const response = await fetch('/api/users/');
    // const response = await fetch('http://localhost:8000/users');
    const data = await response.json();
    setUsers(data['users']);
  };

  return (
    <div className="App">
      <button onClick={fetchData}>Fetch User Data</button>
      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppOrig;
