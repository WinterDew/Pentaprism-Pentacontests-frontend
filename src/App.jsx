import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginOAuth from "./components/LoginPage";
import HomePage from "./components/HomePage";
import pb from "./services/pocketbase";
import SubmissionsPage from "./components/SubmissionsPage";
import GalleryPage from './components/GalleryPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(pb.authStore.isValid);

  useEffect(() => {
    return pb.authStore.onChange(() => {
      setLoggedIn(pb.authStore.isValid);
    });
  }, []);

  // Protected Route Wrapper
  const PrivateRoute = ({ children }) => {
    return loggedIn ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    return loggedIn ? <Navigate to="/" replace /> : children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginOAuth />
          </PublicRoute>
        }
      />
      <Route path="/gallery" element={<PrivateRoute><GalleryPage /></PrivateRoute>} />
      <Route path="/submission" element={<PrivateRoute><SubmissionsPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
