import { useState } from 'react'
import Login from './components/Login.jsx'
import Chat from './components/Chat.jsx'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <Chat user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  )
}
