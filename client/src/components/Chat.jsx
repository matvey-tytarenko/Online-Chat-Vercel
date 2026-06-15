import { useState, useEffect, useRef, useCallback } from 'react'
import Pusher from 'pusher-js'
import Message from './Message.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import './Chat.css'

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || 'YOUR_PUSHER_KEY'
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'eu'
const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typingUsers, setTypingUsers] = useState([])
  const [onlineCount, setOnlineCount] = useState(1)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)
  const pusherRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingUsers])

  useEffect(() => {
    // Init Pusher
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    })
    pusherRef.current = pusher

    pusher.connection.bind('connected', () => setConnected(true))
    pusher.connection.bind('disconnected', () => setConnected(false))
    pusher.connection.bind('error', () => setError('Ошибка подключения'))

    const channel = pusher.subscribe('chat-room')

    channel.bind('new-message', (data) => {
      setMessages(prev => [...prev, data])
    })

    channel.bind('typing', (data) => {
      if (data.userId === user.id) return
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.userId !== data.userId)
        if (data.isTyping) return [...filtered, { userId: data.userId, name: data.name, avatar: data.avatar }]
        return filtered
      })
    })

    channel.bind('user-joined', (data) => {
      if (data.userId !== user.id) {
        setOnlineCount(c => c + 1)
        setMessages(prev => [...prev, { type: 'system', text: `${data.name} вошёл в чат`, id: crypto.randomUUID(), ts: Date.now() }])
      }
    })

    channel.bind('user-left', (data) => {
      setOnlineCount(c => Math.max(1, c - 1))
      setMessages(prev => [...prev, { type: 'system', text: `${data.name} покинул чат`, id: crypto.randomUUID(), ts: Date.now() }])
      setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
    })

    // Announce join
    fetch(`${API_URL}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, name: user.name, avatar: user.avatar })
    }).catch(() => {})

    // Announce leave on unload
    const handleUnload = () => {
      navigator.sendBeacon(`${API_URL}/leave`, JSON.stringify({ userId: user.id, name: user.name }))
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      handleUnload()
      channel.unbind_all()
      pusher.unsubscribe('chat-room')
      pusher.disconnect()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [user.id, user.name, user.avatar])

  const sendTyping = useCallback((isTyping) => {
    fetch(`${API_URL}/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, name: user.name, avatar: user.avatar, isTyping })
    }).catch(() => {})
  }, [user.id, user.name, user.avatar])

  const handleInputChange = (e) => {
    setInput(e.target.value)

    if (!isTypingRef.current) {
      isTypingRef.current = true
      sendTyping(true)
    }

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
      sendTyping(false)
    }, 1500)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    setInput('')
    clearTimeout(typingTimeoutRef.current)
    isTypingRef.current = false
    sendTyping(false)

    try {
      await fetch(`${API_URL}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          text,
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
          color: user.color,
          ts: Date.now()
        })
      })
    } catch {
      setError('Не удалось отправить сообщение')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="app-brand">
            <span className="brand-icon">💬</span>
            <span className="brand-name">Чат</span>
          </div>
        </div>

        <div className="room-info">
          <div className="room-name"># общий</div>
          <div className="room-meta">
            <span className={`status-dot ${connected ? 'online' : 'offline'}`}></span>
            <span>{connected ? `${onlineCount} онлайн` : 'Подключение...'}</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="current-user">
            <div className="user-avatar" style={{ background: user.color + '22', border: `1.5px solid ${user.color}` }}>
              {user.avatar}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-status">
                <span className="status-dot online"></span> В сети
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Выйти">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main chat */}
      <main className="chat-main">
        <div className="chat-header">
          <div className="chat-title">
            <span className="channel-hash">#</span> общий
          </div>
          <div className="header-meta">
            {error && <span className="error-badge">{error}</span>}
          </div>
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👋</div>
              <p>Начните разговор!</p>
              <span>Вы первый в этом чате</span>
            </div>
          )}
          {messages.map((msg, i) => (
            <Message
              key={msg.id || i}
              msg={msg}
              isOwn={msg.userId === user.id}
              prevMsg={messages[i - 1]}
            />
          ))}
          {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form onSubmit={handleSend} className="input-form">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение... (Enter — отправить)"
              rows={1}
              className="message-input"
              maxLength={2000}
            />
            <button type="submit" disabled={!input.trim()} className="send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
