import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogs } from '../redux/blogSlice';
import axios from 'axios';
import { BiPencil, BiTrash } from 'react-icons/bi';
import defaultImage from '../assets/default_image.png';
import DeleteModal from '../components/DeleteModal';
import { API_URL } from '../constants/ApiConstants';

const BlogListPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector((state: any) => state.blogs.blogs);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      axios
        .get(API_URL)
        .then((response) => {
          dispatch(setBlogs(response.data));
        })
        .catch((error) => {
          console.error('Error fetching blogs:', error);
        });
    };

    fetchBlogs();
  }, [dispatch]);

  const openModal = (id: number) => {
    setBlogToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBlogToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination logic
  const totalPages = Math.ceil((Array.isArray(blogs) ? blogs.length : 0) / itemsPerPage);
  const currentBlogs = Array.isArray(blogs)
    ? blogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Insights and Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog: any) => (
            <div
              key={blog.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={`http://localhost/backend/${blog.image_url}`}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultImage;  // If the image fails to load, fall back to the default image
                  }}
                />
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    By <span className="font-semibold">{blog.author}</span> • {formatDate(blog.created_at)}
                  </p>
                  <p className="text-gray-700 text-base mb-4">
                    {blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-blue-500 font-semibold hover:text-blue-700 transition-colors duration-200"
                  >
                    Read More →
                  </Link>
                  <div className="space-x-2 flex items-center">
                    <button
                      onClick={() => navigate(`/edit-blog/${blog.id}`)}
                      className="px-1 py-1 rounded"
                    >
                      <BiPencil size={20} />
                    </button>
                    <button
                      onClick={() => openModal(blog.id)}
                      className="px-1 py-1 rounded"
                    >
                      <BiTrash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No articles available at the moment</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md ${currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteModal
        blogs={blogs}
        isModalOpen={isModalOpen}
        blogToDelete={blogToDelete}
        closeModal={closeModal}
      />
    </div>
  );
};

export default BlogListPage;
