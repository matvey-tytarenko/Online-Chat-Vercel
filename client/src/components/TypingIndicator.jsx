import './TypingIndicator.css'

export default function TypingIndicator({ users }) {
  if (!users.length) return null

  const names = users.map(u => u.name)
  let label = ''
  if (names.length === 1) label = `${names[0]} печатает`
  else if (names.length === 2) label = `${names[0]} и ${names[1]} печатают`
  else label = `Несколько человек печатают`

  return (
    <div className="typing-row">
      <div className="typing-avatars">
        {users.slice(0, 3).map(u => (
          <span key={u.userId} className="typing-avatar">{u.avatar}</span>
        ))}
      </div>
      <div className="typing-bubble">
        <span className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span className="typing-label">{label}</span>
      </div>
    </div>
  )
}
