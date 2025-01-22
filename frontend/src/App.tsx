// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AddBlogPage from './pages/AddBlogsPage';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Layout from './layout/Layout';
import { Toaster } from 'react-hot-toast';
import EditBlogPage from './pages/EditBlogPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<BlogListPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/add-blog" element={<AddBlogPage />} />
            <Route path="/edit-blog/:id" element={<EditBlogPage />} /> {/* Add this route */}
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
