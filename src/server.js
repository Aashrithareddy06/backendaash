import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mysql from 'mysql2/promise'

dotenv.config()

const app = express()
app.use(express.json())

// Configure CORS to support requests with credentials from your frontend.
// Set FRONTEND_ORIGIN in Render to your Vercel origin (e.g. https://ashrithafronend.vercel.app)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    if (FRONTEND_ORIGIN && origin === FRONTEND_ORIGIN) {
      return callback(null, true)
    }
    return callback(new Error('CORS policy: Origin not allowed'))
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

// MySQL connection pool (uses environment variables)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/', (req, res) => {
  res.send('Backend is running')
})

// Example route that pings the database (safe, simple)
app.get('/db-ping', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    res.json({ db: 'ok', result: rows[0].result })
  } catch (err) {
    console.error('DB ping failed', err)
    res.status(500).json({ db: 'error', message: err.message })
  }
})

// --- Placeholder API routes expected by the frontend ---
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {}
  res.json({ success: true, message: 'Login placeholder', user: { id: 1, email: email || 'user@example.com' } })
})

app.post('/api/auth/signup', (req, res) => {
  const { email } = req.body || {}
  res.json({ success: true, message: 'Signup placeholder', user: { id: 2, email: email || 'newuser@example.com' } })
})

app.post('/api/buses/search', (req, res) => {
  const { from, to, date } = req.body || {}
  res.json({
    success: true,
    query: { from, to, date },
    buses: [
      { id: 101, operator: 'FastLines', from: from || 'A', to: to || 'B', date: date || '2025-12-10', price: 499 },
    ],
  })
})

app.post('/api/hotels/search', (req, res) => {
  const { city } = req.body || {}
  res.json({
    success: true,
    query: { city },
    hotels: [
      { id: 301, name: 'Hotel Placeholder', city: city || 'Unknown', pricePerNight: 299 },
    ],
  })
})

app.get('/api/bookings/:id', (req, res) => {
  const { id } = req.params
  res.json({ success: true, booking: { id, userId: 1, status: 'confirmed', details: 'Placeholder booking' } })
})

// 404 handler for unknown routes (must be after all routes)
app.use((req, res) => {
  console.warn('Unhandled request:', req.method, req.path)
  res.status(404).json({ success: false, error: 'Not found', path: req.path })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

export default app
