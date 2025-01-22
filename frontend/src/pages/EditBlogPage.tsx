import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../constants/ApiConstants";

const EditBlogPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: "",
    image_url: "",
  });

  const [imageBase64, setImageBase64] = useState<string | null>(null); // To hold the Base64 string

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_URL}?id=${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data");
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

  const convertToBase64 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result?.toString() || "";
        // Remove the prefix (e.g., "data:image/png;base64,")
        const base64String = result.replace(/^data:image\/\w+;base64,/, "");
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file); // Converts the file to Base64
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blog.title || !blog.content || !blog.author || !id) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      title: blog.title,
      content: blog.content,
      author: blog.author,
      image: imageBase64 || blog.image_url, // Send Base64 image or retain the existing URL
    };

    try {
      const response = await axios.put(`${API_URL}?id=${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.message) {
        toast.success("Blog updated successfully");
        navigate(`/blog/${id}`);
      } else {
        toast.error("Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
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
            {blog.image_url && !imageBase64 && (
              <img
                src={`http://localhost/backend/${blog.image_url}`}
                alt="Current Blog"
                className="w-32 h-32 object-cover mb-4"
              />
            )}
            <input
              type="file"
              onChange={convertToBase64}
              accept=".jpg,.jpeg,.png"
              className="w-full p-3 border border-gray-300 rounded-md file:bg-blue-100 file:border-none file:px-4 file:py-2 file:rounded-md file:text-blue-700 file:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imageBase64 && (
              <div className="mt-2">
                <img
                  src={`data:image/jpeg;base64,${imageBase64}`}
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
