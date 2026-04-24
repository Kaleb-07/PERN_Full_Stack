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
  Tag,
  ChevronLeft
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import './Admin.css'

const AddMovie = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    releaseYear: new Date().getFullYear(),
    genres: '',
    overview: '',
    runtime: '',
    posterUrl: '',
    backdropUrl: ''
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
      toast.success('Movie catalog updated successfully!')
      navigate('/admin')
    } catch (error) {
      console.error('Error adding movie:', error)
      const message = error.response?.data?.error || 'Failed to update catalog'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-movie-container">
      <div className="mb-8">
        <Link to="/admin" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
          <ChevronLeft size={16} /> Back to Command Center
        </Link>
      </div>

      <div className="dashboard-welcome mb-10">
        <h1 className="h1">Catalog <span>Expansion</span></h1>
        <p className="text-gray-500 font-medium">Add high-fidelity movie data to the Cinema Circle library.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label"><Type size={16} /> Official Title</label>
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
              <label className="form-label"><Clock size={16} /> Runtime (min)</label>
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
              <label className="form-label"><Tag size={16} /> Genre Classification (Comma separated)</label>
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
              <label className="form-label"><ImageIcon size={16} /> Poster Asset URL</label>
              <input 
                type="url" 
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..." 
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label"><ImageIcon size={16} /> Backdrop Asset URL</label>
              <input 
                type="url" 
                name="backdropUrl"
                value={formData.backdropUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..." 
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label"><AlignLeft size={16} /> Cinematic Overview</label>
              <textarea 
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Write a compelling description..." 
                className="form-textarea"
              ></textarea>
            </div>
          </div>

          <div className="submit-btn-wrapper">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                <>
                  <Plus size={20} /> Deploy to Library
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
