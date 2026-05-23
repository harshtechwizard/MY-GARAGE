import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GarageLogin from './pages/GarageLogin';
import GarageRegister from './pages/GarageRegister';
import BookService from './pages/BookService';
import GarageDashboard from './pages/GarageDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/garage-login" element={<GarageLogin />} />
          <Route path="/garage-register" element={<GarageRegister />} />
          <Route path="/book" element={<BookService />} />
          <Route path="/dashboard" element={<GarageDashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
