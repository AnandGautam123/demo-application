import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const API_BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3009'
      : 'http://localhost:3009';  // Use localhost and exposed port 3009 for production too


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const callApi = async (endpoint) => {
    setLoading(true);
    setApiError(null);

    try {
      const timestamp = new Date().toISOString();
      const payload = { ...formData, timestamp };

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText);
      }

      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
    } catch (err) {
      setApiError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    callApi('submit')
      .then(() => alert('Submitted successfully!'))
      .catch(() => {});
  };

  return (
    <div className="app">
      <h1>API Test Form</h1>
      {apiError && <div className="error-message">{apiError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required />
        </div>
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit (Success)'}
          </button>
          <button type="button" onClick={() => callApi('error-nodeA')} disabled={loading}>
            Fail at Node A
          </button>
          <button type="button" onClick={() => callApi('error-nodeB')} disabled={loading}>
            Fail at Node B
          </button>
          <button type="button" onClick={() => callApi('error-db')} disabled={loading}>
            Fail at DB
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
