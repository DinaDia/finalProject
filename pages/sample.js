import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:3001/api/users');
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}