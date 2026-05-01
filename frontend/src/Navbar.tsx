import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="flex bg-blue-500">
      <Link to="/sale" className="flex-1 text-center py-2.5 text-white no-underline hover:bg-blue-800">
        Sale
      </Link>
      <Link to="/orders" className="flex-1 text-center py-2.5 text-white no-underline hover:bg-blue-800">
        Orders
      </Link>
      <Link to="/dashboard" className="flex-1 text-center py-2.5 text-white no-underline hover:bg-blue-800">
        Dashboard
      </Link>
      <Link to="/products" className="flex-1 text-center py-2.5 text-white no-underline hover:bg-blue-800">
        Products
      </Link>
    </nav>
  );
};

export default Navbar;
