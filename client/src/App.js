import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './Router/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyReservations from './pages/MyReservations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/reservations" 
            element={
              <PrivateRoute>
                <MyReservations />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Home />} />
          <Route path="/mes-reservations" element={<MyReservations />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;