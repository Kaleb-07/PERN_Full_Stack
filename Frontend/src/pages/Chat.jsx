import React, { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Hash, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Search,
  MoreVertical,
  Smile,
  Image as ImageIcon,
  Paperclip,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Chat.css'

const Chat = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeRoom, setActiveRoom] = useState('general')
  const scrollRef = useRef()

  const rooms = [
    { id: 'general', name: 'General Lounge', icon: <MessageSquare size={18} />, color: '#6366f1' },
    { id: 'action', name: 'Action & Thriller', icon: <Sparkles size={18} />, color: '#f43f5e' },
    { id: 'scifi', name: 'Sci-Fi Universe', icon: <Hash size={18} />, color: '#8b5cf6' },
    { id: 'horror', name: 'Horror Nights', icon: <Hash size={18} />, color: '#1a1a1a' }
  ]

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000) // Polling for "real-time" feel
    return () => clearInterval(interval)
  }, [activeRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/chat/${activeRoom}`)
      setMessages(data.data || [])
    } catch (error) {
      // toast.error('Failed to sync messages')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const tempMsg = {
      id: Date.now(),
      content: newMessage,
      userId: user.id,
      user: user,
      createdAt: new Date().toISOString()
    }

    setMessages([...messages, tempMsg])
    setNewMessage('')

    try {
      await api.post('/chat', { content: newMessage, roomId: activeRoom })
      fetchMessages()
    } catch (error) {
      toast.error('Message failed to send')
    }
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="chat-page-container">
      {/* Sidebar Rooms */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Cinema <span>Circle</span></h2>
          <p>Movie communities active now</p>
        </div>

        <div className="rooms-list">
          {rooms.map(room => (
            <button 
              key={room.id}
              className={`room-pill ${activeRoom === room.id ? 'active' : ''}`}
              onClick={() => setActiveRoom(room.id)}
            >
              <div className="room-icon" style={{ background: room.color }}>
                {room.icon}
              </div>
              <div className="room-info">
                <span className="room-name">{room.name}</span>
                <span className="room-status">Online now</span>
              </div>
              {activeRoom === room.id && <div className="active-indicator" />}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="online-users">
            <Users size={16} />
            <span>124 Film Buffs Online</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <div className="active-room-title">
            <div className="room-icon-small">#</div>
            <div>
              <h3>{rooms.find(r => r.id === activeRoom)?.name}</h3>
              <p>Discussing latest releases & cinematic history</p>
            </div>
          </div>
          <div className="chat-actions">
            <button className="icon-btn"><Search size={20} /></button>
            <button className="icon-btn"><MoreVertical size={20} /></button>
          </div>
        </header>

        <div className="messages-viewport">
          {loading ? (
            <div className="chat-loader">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.userId === user?.id
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`message-wrapper ${isMe ? 'me' : 'other'}`}
                >
                  {!isMe && (
                    <div className="msg-avatar">
                      {msg.user?.name?.[0]}
                    </div>
                  )}
                  <div className="msg-content-group">
                    {!isMe && <span className="msg-author">{msg.user?.name}</span>}
                    <div className="msg-bubble">
                      <p>{msg.content}</p>
                      <span className="msg-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-area">
          <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
            <div className="input-actions">
              <button type="button" className="action-btn"><Smile size={20} /></button>
              <button type="button" className="action-btn"><Paperclip size={20} /></button>
            </div>
            <input 
              type="text" 
              placeholder={`Message # ${activeRoom}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Chat
