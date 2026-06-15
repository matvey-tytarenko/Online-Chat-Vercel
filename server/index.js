require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Pusher = require('pusher')

const app = express()
app.use(express.json())
app.use(cors())

// Инициализация Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true,
})

// ── Отправить сообщение ──
app.post('/api/message', async (req, res) => {
  try {
    const { id, text, userId, name, avatar, color, ts } = req.body
    if (!text || !userId || !name) return res.status(400).json({ error: 'Missing fields' })

    await pusher.trigger('chat-room', 'new-message', {
      id: id || crypto.randomUUID(),
      text: text.slice(0, 2000),
      userId,
      name,
      avatar,
      color,
      ts: ts || Date.now()
    })

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Vercel
app.get('/', (req, res) => {
  res.json({ message: 'Chat server is running' })
})

// ── Пользователь вошёл ──
app.post('/api/join', async (req, res) => {
  try {
    const { userId, name, avatar } = req.body
    await pusher.trigger('chat-room', 'user-joined', { userId, name, avatar })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Пользователь вышел ──
app.post('/api/leave', async (req, res) => {
  try {
    const { userId, name } = req.body
    await pusher.trigger('chat-room', 'user-left', { userId, name })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Индикатор набора ──
app.post('/api/typing', async (req, res) => {
  try {
    const { userId, name, avatar, isTyping } = req.body
    await pusher.trigger('chat-room', 'typing', { userId, name, avatar, isTyping })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`)
})
