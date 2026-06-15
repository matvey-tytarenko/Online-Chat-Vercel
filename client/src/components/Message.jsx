import './Message.css'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default function Message({ msg, isOwn, prevMsg }) {
  if (msg.type === 'system') {
    return (
      <div className="system-msg">
        <span>{msg.text}</span>
      </div>
    )
  }

  const isSameAuthor = prevMsg && prevMsg.userId === msg.userId && prevMsg.type !== 'system'
  const showHeader = !isSameAuthor

  return (
    <div className={`message-wrapper ${isOwn ? 'own' : ''} ${isSameAuthor ? 'grouped' : ''}`}>
      <div className="message-row">
        {!isOwn && (
          <div className="avatar-slot">
            {showHeader ? (
              <div
                className="msg-avatar"
                style={{ background: msg.color + '22', border: `1.5px solid ${msg.color}` }}
                title={msg.name}
              >
                {msg.avatar}
              </div>
            ) : (
              <div className="avatar-spacer" />
            )}
          </div>
        )}

        <div className="message-content">
          {showHeader && !isOwn && (
            <div className="message-header">
              <span className="msg-name" style={{ color: msg.color }}>{msg.name}</span>
              <span className="msg-time">{formatTime(msg.ts)}</span>
            </div>
          )}
          <div className="bubble-row">
            <div className={`bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
              {msg.text}
            </div>
            {isOwn && showHeader && (
              <span className="msg-time own-time">{formatTime(msg.ts)}</span>
            )}
          </div>
          {isOwn && !showHeader && (
            <div className="grouped-time">{/* hidden, shown on hover via CSS */}</div>
          )}
        </div>
      </div>
    </div>
  )
}
