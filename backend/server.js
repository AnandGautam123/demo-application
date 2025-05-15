const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/submit', async (req, res) => {
  try {
    console.log('Request received at Node A:', req.body)
    
    // Add timestamp
    const payload = {
      ...req.body,
      timestamp: new Date().toISOString()
    }

    const response = await axios.post('http://node-b:3002/process', payload, {
      timeout: 5000
    })

    res.json({
      message: 'Data processed successfully',
      path: 'Frontend → Node A → Node B → Database',
      data: response.data
    })
    
  } catch (error) {
    console.error('Error in Node A:', error.message)
    
    let errorMessage = 'Failed at Node A'
    let errorDetails = error.message

    if (error.response) {
      errorMessage = `Failed at Node B: ${error.response.data.message || error.message}`
      errorDetails = error.response?.data || error.message
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Node B request timeout'
    }

    res.status(500).json({ 
      message: errorMessage,
      details: errorDetails // Add detailed error message to the response
    })
  }
})

app.post('/error-nodeA', (req, res) => {
  console.log('Simulating failure at Node A')
  res.status(500).json({ message: 'Simulated failure at Node A' })
})

app.post('/error-nodeB', async (req, res) => {
  try {
    console.log('Request received at Node A, forwarding to Node B (will fail)')
    await axios.post('http://node-b:3002/fail-process', req.body)
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed at Node B',
      details: error.response?.data || error.message // More detailed error handling
    })
  }
})

app.post('/error-db', async (req, res) => {
  try {
    console.log('Request received at Node A, forwarding to Node B (will fail at DB)')
    await axios.post('http://node-b:3002/fail-db', req.body)
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed at Database',
      details: error.response?.data || error.message // Include detailed error message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Node A server running on http://localhost:${PORT}`)
})
