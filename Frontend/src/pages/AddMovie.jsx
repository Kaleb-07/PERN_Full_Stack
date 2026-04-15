import React, { useState } from 'react'
import { 
  Plus, 
  Loader2, 
  Film,
  Calendar,
  Clock,
  Type,
  AlignLeft,
  Image as ImageIcon,
  Tag
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AddMovie = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    releaseYear: new Date().getFullYear(),
    genres: '',
    overview: '',
    runtime: '',
    posterUrl: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.releaseYear) {
      toast.error('Title and Release Year are required')
      return
    }

    setLoading(true)
    try {
      // Process genres from comma-separated string to array
      const genresArray = formData.genres 
        ? formData.genres.split(',').map(g => g.trim()).filter(g => g !== '')
        : []

      const payload = {
        ...formData,
        genres: genresArray,
        releaseYear: parseInt(formData.releaseYear),
        runtime: formData.runtime ? parseInt(formData.runtime) : null
      }

      await api.post('/movies', payload)
      toast.success('Movie added successfully!')
      navigate('/browse')
    } catch (error) {
      console.error('Error adding movie:', error)
      const message = error.response?.data?.error || 'Failed to add movie'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-movie-container animate-slide-up">
      <div className="dashboard-welcome">
        <h1 className="h1">Add New <span>Movie</span></h1>
        <p className="text-secondary">Contribute to the collective database and share your favorite films.</p>
      </div>

      <div className="form-card glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label"><Type size={16} /> Movie Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Interstellar" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Calendar size={16} /> Release Year</label>
              <input 
                type="number" 
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                placeholder="2024" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={16} /> Runtime (minutes)</label>
              <input 
                type="number" 
                name="runtime"
                value={formData.runtime}
                onChange={handleChange}
                placeholder="120" 
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label"><Tag size={16} /> Genres (comma separated)</label>
              <input 
                type="text" 
                name="genres"
                value={formData.genres}
                onChange={handleChange}
                placeholder="Sci-Fi, Drama, Adventure" 
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label"><ImageIcon size={16} /> Poster URL (Optional)</label>
              <input 
                type="url" 
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg" 
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label"><AlignLeft size={16} /> Movie Overview</label>
              <textarea 
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Write a brief description of the movie..." 
                className="form-textarea"
              ></textarea>
            </div>
          </div>

          <div className="submit-btn-wrapper">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ padding: '1rem 3rem' }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Adding...
                </>
              ) : (
                <>
                  <Plus size={20} /> Add Movie
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMovie
