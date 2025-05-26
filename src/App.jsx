import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/loginPage";
import HomePage from "./components/homePage";
import pb from "./services/pocketbase";

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
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
