import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBlog } from '../redux/blogSlice'
import InputField from '../components/Input'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../constants/ApiConstants'

const AddBlogPage = () => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null) // To store the image preview URL

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
  const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png']

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file type
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        toast.error('Only JPG and PNG formats are allowed')
        setImage(null)
        setImagePreview(null)
        return
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 5MB')
        setImage(null)
        setImagePreview(null)
        return
      }

      // If valid, set image and preview
      setImage(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !author || !content || !image) {
      toast.error('All fields are required')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('author', author)
    formData.append('content', content)
    formData.append('image', image)

    axios.post(API_URL, formData)
      .then((response) => {
        dispatch(addBlog(response.data))
        setTitle('')
        setAuthor('')
        setContent('')
        setImage(null)
        setImagePreview(null)
        const textarea = document.getElementById('content') as HTMLTextAreaElement;
        if (textarea) textarea.style.height = '150px';
        toast.success('Blog added successfully')
      }).catch(() => {
        toast.error('Error adding blog')
      })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Blog</h1>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <InputField
            id="title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
          />

          <InputField
            id="author"
            label="Author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author's name"
            required
          />

          <InputField
            id="content"
            label="Content"
            type="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter blog content"
            required
          />

          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="image">
              Blog Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              accept=".jpg,.jpeg,.png" // Restrict file selection in the input dialog
              className="w-full p-3 border border-gray-300 rounded-md file:bg-blue-100 file:border-none file:px-4 file:py-2 file:rounded-md file:text-blue-700 file:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {imagePreview && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Image Preview:</h3>
              <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded-md shadow-lg" />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Blog
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBlogPage
