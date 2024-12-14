import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Login from './component/login/Login';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './component/protected-route/ProtectedRoute';

const clientId = "997107527380-dq429gf5fnqu14negu0bk4ubrk1ja0o4.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          {/* Main route for login */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin route with nested child routes */}
          <Route path="/admin/*" element={<ProtectedRoute> <AdminPage /></ProtectedRoute>} />
          
          {/* Default route or fallback */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
