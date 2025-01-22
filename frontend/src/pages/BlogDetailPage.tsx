/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentBlog } from '../redux/blogSlice';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import defaultImage from '../assets/default_image.png';

const BlogDetailPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentBlog = useSelector((state: any) => state.blogs.currentBlog);

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await fetch(`http://localhost/backend/api.php?id=${id}`);
      const data = await response.json();
      dispatch(setCurrentBlog(data));
    };

    if (id) {
      fetchBlog();
    }
  }, [id, dispatch]);

  if (!currentBlog) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{currentBlog.title}</h1>
        <p className="text-lg text-gray-600">
          By <span className="font-semibold">{currentBlog.author}</span> •{' '}
          <span>{formatDate(currentBlog.created_at)}</span>
        </p>
      </div>

      {/* Blog Image */}
      <div className="h-48 w-full overflow-hidden">
          <img
            src={`http://localhost/backend/${currentBlog.image_url}`}
            alt={currentBlog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultImage;  // If the image fails to load, fall back to the default image
            }}
          />
        </div>

      {/* Blog Content */}
      <div className="prose max-w-none prose-lg prose-indigo">
        <ReactMarkdown children={currentBlog.content} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  );
};

export default BlogDetailPage;
