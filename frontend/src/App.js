// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/users`, newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '' });
      setError('');
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Management System</h1>
      </header>

      <main className="container">
        {error && <div className="error">{error}</div>}

        <section className="user-form">
          <h2>Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </section>

        <section className="users-list">
          <h2>Users ({users.length})</h2>
          {loading && users.length === 0 ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user._id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p className="date">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          {users.length === 0 && !loading && (
            <p className="no-users">No users found. Add some users to get started!</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
