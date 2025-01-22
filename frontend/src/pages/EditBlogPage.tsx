import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../constants/ApiConstants';

const EditBlogPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
  });

  const [newImage, setNewImage] = useState<File | null>(null); // To hold the new image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // To store the image preview URL

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_URL}?id=${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog data');
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlog((prevBlog) => ({ ...prevBlog, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blog.title || !blog.content || !blog.author || !id) {
        toast.error('Please fill in all required fields');
        return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('author', blog.author);

    // Append image if it's selected
    if (newImage) {
        formData.append('image', newImage);
    } else {
        formData.append('existing_image', blog.image); // Keep the existing image if no new image
    }

    try {
        const response = await axios.put(`http://localhost/backend/api.php?id=${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.message) {
            toast.success('Blog updated successfully');
            navigate(`/blog/${id}`);
        } else {
            toast.error('Failed to update blog');
        }
    } catch (error) {
        console.error('Error updating blog:', error);
        toast.error('Failed to update blog');
    }
};

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-semibold">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blog.title}
            onChange={handleChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-lg font-semibold">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={blog.author}
            onChange={handleChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-lg font-semibold">Content</label>
          <textarea
            id="content"
            name="content"
            value={blog.content}
            onChange={handleChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md"
            rows={6}
            required
          />
        </div>

        {/* Image Preview and Change Image */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-semibold">Image</label>
          <div className="flex flex-col items-center">
            {blog.image && !newImage && (
              <img
                src={`http://localhost/backend/${blog.image}`}
                alt="Current Blog"
                className="w-32 h-32 object-cover mb-4"
              />
            )}
            <input
              type="file"
              onChange={handleImageChange}
              accept=".jpg,.jpeg,.png"
              className="w-full p-3 border border-gray-300 rounded-md file:bg-blue-100 file:border-none file:px-4 file:py-2 file:rounded-md file:text-blue-700 file:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <p>Selected Image: {newImage?.name}</p>
                <img
                  src={imagePreview}
                  alt="New Preview"
                  className="w-32 h-32 object-cover mt-2"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
