import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resumes");
        setResumes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch resumes");
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await api.delete(`/resumes/${id}`);
        setResumes(resumes.filter((resume) => resume._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete resume");
      }
    }
  };

  const handleView = (id) => navigate(`/resume/view/${id}`);
  const handleEdit = (id) => navigate(`/resume/edit/${id}`);
  const handleCreateResume = () => navigate("/resume/new");

  if (!user) return <p className="loading-text">Loading user info...</p>;

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-header">
        <div className="left-header">
          <h2 className="logo">BuildResume</h2>
          <div className="user-info">
          <h1>👋 Welcome, {user.name}</h1>
          <p>{user.email}</p>
        </div>
        </div>
        
        <div>
          <button className="btn create-btn" onClick={handleCreateResume}>
            + Create Resume
          </button>
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Resume Section */}
      <section className="resume-section">
        <h2 className="section-title">Your Resumes</h2>

        {loading && <p className="loading-text">Loading resumes...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="resume-grid">
          {resumes.length === 0 && !loading ? (
            <p className="no-resumes">No resumes found. Create one!</p>
          ) : (
            resumes.map((resume) => (
              <div key={resume._id} className="resume-card">
                <div className="resume-card-header">
                  <h3>{resume.fullName}</h3>
                  <p className="resume-email">{resume.email}</p>
                  <p className="resume-phone">{resume.phone || "N/A"}</p>
                </div>

                <div className="resume-card-body">
                  <p className="resume-skills">
                    <strong>Skills:</strong>{" "}
                    {resume.skills.length > 0
                      ? resume.skills.join(", ")
                      : "N/A"}
                  </p>
                </div>

                <div className="resume-actions">
                  <button
                    className="btn view-btn"
                    onClick={() => handleView(resume._id)}
                  >
                    View
                  </button>
                  <button
                    className="btn edit-btn"
                    onClick={() => handleEdit(resume._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(resume._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
