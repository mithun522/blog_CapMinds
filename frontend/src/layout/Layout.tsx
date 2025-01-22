import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/blogs" className="font-bold text-xl">
          Blog App
        </Link>
        <div className="space-x-4">
          <Link to="/blogs" className="hover:underline">
            Blogs
          </Link>
          <Link to="/add-blog" className="hover:underline">
            Add Blog
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
