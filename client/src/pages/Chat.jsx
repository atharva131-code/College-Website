import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import API from '../utils/axios.js'
import socket from '../utils/socket.js'

const ROOMS = [
  { id: 'general', name: 'General', emoji: '💬' },
  { id: 'computer-science', name: 'CS Department', emoji: '💻' },
  { id: 'commerce', name: 'Commerce', emoji: '📊' },
  { id: 'arts', name: 'Arts', emoji: '🎨' },
  { id: 'study-group', name: 'Study Group', emoji: '📚' },
  { id: 'notice-board', name: 'Notice Board', emoji: '📌' },
]

const EMOJIS = ['😊', '👍', '🙏', '😂', '❤️', '🔥', '👏', '😍']

export default function Chat() {
  const { user } = useAuth()
  const [activeRoom, setActiveRoom] = useState(ROOMS[0])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState('')
  const [typingUsers, setTypingUsers] = useState([])
  const [showEmojis, setShowEmojis] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!user) return

    socket.emit('leave_room', {
      room: activeRoom.id,
      userName: user.name,
    })

    loadMessages(activeRoom.id)

    socket.emit('join_room', {
      room: activeRoom.id,
      userName: user.name,
    })

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    socket.on('room_users', (count) => {
      setOnlineUsers(count)
    })

    socket.on('user_joined', ({ message }) => {
      setNotification(message)
      setTimeout(() => setNotification(''), 3000)
    })

    socket.on('user_left', ({ message }) => {
      setNotification(message)
      setTimeout(() => setNotification(''), 3000)
    })

    socket.on('typing', ({ userName }) => {
      setTypingUsers((prev) =>
        prev.includes(userName) ? prev : [...prev, userName]
      )
    })

    socket.on('stop_typing', ({ userName }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== userName))
    })

    return () => {
      socket.off('receive_message')
      socket.off('room_users')
      socket.off('user_joined')
      socket.off('user_left')
      socket.off('typing')
      socket.off('stop_typing')
    }
  }, [activeRoom, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async (room) => {
    try {
      setLoading(true)
      setMessages([])
      const res = await API.get(`/chat/${room}`)
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)

    // Emit typing event
    socket.emit('typing', {
      room: activeRoom.id,
      userName: user.name,
    })

    // Stop typing after 2 seconds of no input
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', {
        room: activeRoom.id,
        userName: user.name,
      })
    }, 2000)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageData = {
      room: activeRoom.id,
      content: newMessage,
      sender: user.name,
      senderId: user.id,
      role: user.role,
      createdAt: new Date().toISOString(),
    }

    socket.emit('send_message', messageData)
    socket.emit('stop_typing', {
      room: activeRoom.id,
      userName: user.name,
    })

    try {
      await API.post('/chat', {
        room: activeRoom.id,
        content: newMessage,
      })
    } catch (err) {
      console.error('Failed to save message:', err)
    }

    setNewMessage('')
    setShowEmojis(false)
  }

  const handleClearChat = async () => {
    if (!window.confirm('Clear all messages in this room?')) return
    try {
      await API.delete(`/chat/${activeRoom.id}`)
      setMessages([])
    } catch (err) {
      alert('Failed to clear chat')
    }
  }

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojis(false)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-yellow-600'
      case 'teacher': return 'text-green-600'
      default: return 'text-blue-600'
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return '⚙️'
      case 'teacher': return '👨‍🏫'
      default: return '👨‍🎓'
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isMyMessage = (message) => {
    return message.sender === user.name
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-bold text-lg">💬 College Chat</h1>
          <p className="text-blue-200 text-xs">
            {activeRoom.emoji} {activeRoom.name} · {onlineUsers} online
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={handleClearChat}
              className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition"
            >
              Clear Chat
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-sm text-blue-200">{user?.name}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Rooms
            </p>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className={`w-full text-left px-3 py-2.5 text-sm transition ${
                  activeRoom.id === room.id
                    ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {room.emoji} {room.name}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 px-3 py-3">
            <p className="text-xs text-gray-500 truncate">
              {getRoleBadge(user?.role)} {user?.name}
            </p>
            <p className={`text-xs font-medium capitalize ${getRoleColor(user?.role)}`}>
              {user?.role}
            </p>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Room header */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-gray-800 text-sm">
              {activeRoom.emoji} {activeRoom.name}
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-gray-500">{onlineUsers} online</span>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div className="bg-blue-50 text-blue-600 text-xs text-center py-1.5 border-b border-blue-100">
              {notification}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading && (
              <div className="text-center text-gray-400 text-sm py-8">
                Loading messages...
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                No messages yet. Be the first to say something! 👋
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md flex flex-col ${isMyMessage(message) ? 'items-end' : 'items-start'}`}>
                  {!isMyMessage(message) && (
                    <div className="flex items-center gap-1 mb-1 px-1">
                      <span className={`text-xs font-medium ${getRoleColor(message.role)}`}>
                        {getRoleBadge(message.role)} {message.sender}
                      </span>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMyMessage(message)
                      ? 'bg-blue-700 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                  }`}>
                    {message.content}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typingUsers.filter((u) => u !== user.name).length > 0 && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-xs text-gray-400 ml-1">
                      {typingUsers.filter((u) => u !== user.name).join(', ')} typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Emoji picker */}
          {showEmojis && (
            <div className="bg-white border-t border-gray-200 px-4 py-2 flex gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-xl hover:scale-125 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Message input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
                className="text-xl hover:scale-110 transition shrink-0"
              >
                😊
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder={`Message ${activeRoom.name}...`}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center transition disabled:opacity-50 shrink-0"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}