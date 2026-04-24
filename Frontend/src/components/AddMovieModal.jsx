import React, { useState, useEffect } from 'react'
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
  X,
  Sparkles,
  Save
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'
import '../pages/Admin.css'

const AddMovieModal = ({ isOpen, onClose, onSuccess, movieToEdit = null }) => {
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

  useEffect(() => {
    if (movieToEdit) {
      setFormData({
        title: movieToEdit.title || '',
        releaseYear: movieToEdit.releaseYear || new Date().getFullYear(),
        genres: movieToEdit.genres ? movieToEdit.genres.join(', ') : '',
        overview: movieToEdit.overview || '',
        runtime: movieToEdit.runtime || '',
        posterUrl: movieToEdit.posterUrl || '',
        backdropUrl: movieToEdit.backdropUrl || ''
      })
    } else {
      setFormData({
        title: '',
        releaseYear: new Date().getFullYear(),
        genres: '',
        overview: '',
        runtime: '',
        posterUrl: '',
        backdropUrl: ''
      })
    }
  }, [movieToEdit, isOpen])

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

      if (movieToEdit) {
        await api.put(`/movies/${movieToEdit.id}`, payload)
        toast.success('Cinematic asset synchronized successfully!')
      } else {
        await api.post('/movies', payload)
        toast.success('New cinematic asset deployed successfully!')
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving movie:', error)
      const message = error.response?.data?.error || 'Failed to sync asset'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, scale: 0.95, y: -30 }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="modal-content"
          >
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>

            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-white">
                  {movieToEdit ? 'Asset' : 'Catalog'} <span className="text-indigo-500">{movieToEdit ? 'Modification' : 'Expansion'}</span>
                </h2>
              </div>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-1">
                {movieToEdit ? `Refining metadata for: ${movieToEdit.title}` : 'Deploy high-fidelity cinematic assets to the library.'}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <motion.div variants={itemVariants} className="form-group" style={{ gridColumn: 'span 2' }}>
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
                </motion.div>

                <motion.div variants={itemVariants} className="form-group">
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
                </motion.div>

                <motion.div variants={itemVariants} className="form-group">
                  <label className="form-label"><Clock size={16} /> Runtime (min)</label>
                  <input 
                    type="number" 
                    name="runtime"
                    value={formData.runtime}
                    onChange={handleChange}
                    placeholder="120" 
                    className="form-input"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label"><Tag size={16} /> Genre Classification (Comma separated)</label>
                  <input 
                    type="text" 
                    name="genres"
                    value={formData.genres}
                    onChange={handleChange}
                    placeholder="Sci-Fi, Drama, Adventure" 
                    className="form-input"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label"><ImageIcon size={16} /> Poster Asset URL</label>
                  <input 
                    type="url" 
                    name="posterUrl"
                    value={formData.posterUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..." 
                    className="form-input"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label"><ImageIcon size={16} /> Backdrop Asset URL</label>
                  <input 
                    type="url" 
                    name="backdropUrl"
                    value={formData.backdropUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..." 
                    className="form-input"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label"><AlignLeft size={16} /> Cinematic Overview</label>
                  <textarea 
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    placeholder="Write a compelling description..." 
                    className="form-textarea"
                  ></textarea>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="submit-btn-wrapper">
                <button 
                  type="submit" 
                  className="deploy-btn" 
                  disabled={loading}
                  style={{ background: movieToEdit ? 'var(--admin-accent)' : '#fff', color: movieToEdit ? '#fff' : '#000' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Synchronizing...
                    </>
                  ) : (
                    <>
                      {movieToEdit ? <Save size={20} /> : <Plus size={20} />} 
                      {movieToEdit ? 'Commit Changes' : 'Deploy to Library'}
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddMovieModal
