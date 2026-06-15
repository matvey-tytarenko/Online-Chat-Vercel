import { useState } from 'react'
import './Login.css'

const AVATARS = ['🦊', '🐺', '🦁', '🐸', '🦋', '🐙', '🦄', '🐧', '🦅', '🐻']
const COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#06b6d4']

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [avatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)])
  const [color] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onLogin({ name: trimmed, avatar, color, id: crypto.randomUUID() })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">💬</div>
          <h1>Чат</h1>
          <p>Войдите, чтобы начать общаться</p>
        </div>

        <div className="avatar-preview" style={{ background: color + '22', border: `2px solid ${color}` }}>
          <span>{avatar}</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="name">Ваше имя</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Введите имя..."
              maxLength={24}
              autoFocus
              autoComplete="off"
            />
          </div>
          <button type="submit" disabled={!name.trim()} className="btn-primary">
            Войти в чат →
          </button>
        </form>
      </div>
    </div>
  )
}
