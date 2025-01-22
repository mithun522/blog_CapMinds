/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setBlogs } from "../redux/blogSlice";
import axios from "axios";
import { API_URL } from "../constants/ApiConstants";

interface DeleteModalProps {
  isModalOpen: boolean;
  blogToDelete: number | null;
  blogs: any[];
  closeModal: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isModalOpen, blogToDelete, blogs, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}?id=${id}`);
      dispatch(setBlogs(blogs.filter((blog: any) => blog.id !== id)));
      toast.success('Blog deleted successfully');
      closeModal();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-xl font-bold mb-4">Are you sure you want to delete this blog?</h3>
        <div className="flex justify-between">
          <button
            onClick={() => {
              if (blogToDelete) {
                handleDelete(blogToDelete);
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
