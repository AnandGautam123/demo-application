const express = require('express')
const app = express()
const PORT = 3002

// Initialize the mock database
let database = []

app.use(express.json())

// Node B - Processing endpoint
app.post('/process', (req, res) => {
  try {
    console.log('Request received at Node B:', req.body)
    
    // Validate input
    if (!req.body.name || !req.body.email) {
      throw new Error('Missing required fields')
    }

    // Save to mock database
    database.push(req.body)
    console.log('Data saved to database:', req.body)

    res.json({ 
      message: 'Data processed successfully through Node B',
      data: req.body
    })
  } catch (error) {
    console.error('Error in Node B:', error.message)
    res.status(400).json({ 
      message: 'Processing failed at Node B',
      error: error.message // Return the error message
    })
  }
})

// Failure endpoints
app.post('/fail-process', (req, res) => {
  console.log('Simulating failure at Node B')
  res.status(500).json({ message: 'Simulated failure at Node B' })
})

app.post('/fail-db', (req, res) => {
  console.log('Simulating database failure')
  res.status(500).json({ message: 'Simulated database failure' })
})

app.listen(PORT, () => {
  console.log(`Node B server running on http://localhost:${PORT}`)
  console.log('Mock database initialized')
})
