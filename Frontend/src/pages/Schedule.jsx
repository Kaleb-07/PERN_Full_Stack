import React, { useState, useEffect } from 'react'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Clock,
  Sparkles,
  Play,
  Loader2,
  Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import './Schedule.css'

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate()) 
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const { data } = await api.get('/schedule')
      setSchedules(data.data || [])
    } catch (error) {
      toast.error('Failed to load your schedule')
    } finally {
      setLoading(false)
    }
  }

  const toggleReminder = async (id) => {
    try {
      await api.delete(`/schedule/${id}`)
      setSchedules(prev => prev.filter(s => s.id !== id))
      toast.success('Event removed from schedule')
    } catch (error) {
      toast.error('Failed to remove event')
    }
  }

  // Generate current week days
  const getWeekDays = () => {
    const days = []
    const today = new Date()
    for (let i = -3; i <= 3; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      days.push({
        num: d.getDate(),
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0,
        fullDate: d.toDateString()
      })
    }
    return days
  }

  const days = getWeekDays()
  const filteredSchedules = schedules.filter(s => new Date(s.scheduledAt).getDate() === selectedDay)

  return (
    <div className="schedule-page animate-fade-in">
      {/* Header Section */}
      <header className="schedule-header">
        <div className="header-text-group">
          <div className="premium-badge">
            <Sparkles size={14} />
            <span>My Planned Sessions</span>
          </div>
          <h1>Watch <span>Schedule</span></h1>
          <p>Your upcoming movie nights, perfectly organized.</p>
        </div>

        <div className="month-picker">
          <button className="month-nav-btn"><ChevronLeft size={20} /></button>
          <span className="current-month">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button className="month-nav-btn"><ChevronRight size={20} /></button>
        </div>
      </header>

      {/* Calendar Strip */}
      <div className="calendar-strip">
        {days.map((day) => (
          <motion.button
            key={day.num}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`day-card ${selectedDay === day.num ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
            onClick={() => setSelectedDay(day.num)}
          >
            <span className="day-name">{day.name}</span>
            <span className="day-number">{day.num}</span>
            {day.isToday && <div className="today-dot" />}
          </motion.button>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="timeline-container">
        {loading ? (
          <div className="luxury-loader-container">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="timeline-track"
            >
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="timeline-item"
                  >
                    <div className="time-marker">
                      <Clock size={16} />
                      <span>{new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="release-luxury-card">
                      <div className="release-img-wrapper">
                        <img src={item.movie?.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80'} alt={item.movie?.title} />
                        <div className="play-hint"><Play size={24} fill="white" /></div>
                      </div>

                      <div className="release-details">
                        <div className="details-header">
                          <h3>{item.movie?.title}</h3>
                          <button 
                            onClick={() => toggleReminder(item.id)}
                            className="reminder-btn active"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="release-genre">{item.movie?.genres?.[0] || 'Drama'}</p>
                        
                        <div className="release-meta">
                          <div className="meta-item">
                            <Clock size={14} />
                            <span>Planned Session</span>
                          </div>
                          <div className="meta-avatars">
                            <img src={`https://i.pravatar.cc/100?u=${item.id}`} alt="" />
                            <div className="plus-count">+ You</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-releases-state">
                  <CalendarIcon size={48} className="opacity-10 mb-4" />
                  <p>Nothing scheduled for this day.</p>
                  <Link to="/browse" className="view-all-link mt-4" style={{ fontSize: '1rem' }}>Find movies to schedule</Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default Schedule
