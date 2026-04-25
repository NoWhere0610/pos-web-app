import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "1rem",
        background: "#2c3e50",
        color: "white",
      }}
    >
      <Link to="/pos" style={{ color: "white", textDecoration: "none" }}>
        PoS
      </Link>
      <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
        Dashboard
      </Link>
      <Link to="/products" style={{ color: "white", textDecoration: "none" }}>
        Products
      </Link>
      <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
        Orders
      </Link>

      <h2 style={{ margin: 0, marginLeft: "auto" }}>POS System</h2>
    </nav>
  );
};

export default Navbar;
