// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ResumeForm from "./pages/ResumeForm";
import ResumeView from "./pages/ResumeView";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {/* Navigation */}
      {!token && (
        <nav style={{ padding: "10px", background: "#f4f4f4" }}>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to="/login">Login</Link>
        </nav>
      )}

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/resume/new"
          element={
            <PrivateRoute>
              <ResumeForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/resume/edit/:id"
          element={
            <PrivateRoute>
              <ResumeForm />
            </PrivateRoute>
          }
        />

        <Route 
          path="/resume/view/:id"
          element={
            <PrivateRoute>
              <ResumeView />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
