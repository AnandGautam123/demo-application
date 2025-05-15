import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  // Use same origin for API calls (NGINX will proxy to backend)
  const API_BASE_URL = window.location.origin

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const callApi = async (endpoint) => {
    setLoading(true)
    try {
      const timestamp = new Date().toISOString()
      const payload = { ...formData, timestamp }

      const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      await res.json() // Response is ignored intentionally
    } catch (error) {
      console.error('API call failed:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    callApi('submit')
  }

  return (
    <div className="app">
      <h1>API Test Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit (Success Path)'}
          </button>
          <button
            type="button"
            onClick={() => callApi('error-nodeA')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Fail at Node A'}
          </button>
          <button
            type="button"
            onClick={() => callApi('error-nodeB')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Fail at Node B'}
          </button>
          <button
            type="button"
            onClick={() => callApi('error-db')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Fail at Database'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
