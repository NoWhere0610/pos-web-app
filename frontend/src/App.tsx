import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Products from "./product";
import Orders from "./order";
import Dashboard from './dashboard'
import PoS from "./pos";
import "./App.css";


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/pos" element={<PoS />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
