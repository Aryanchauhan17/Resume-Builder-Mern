import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/ResumeView.css";
import html2pdf from "html2pdf.js";

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reference to the resume content only
  const resumeContentRef = useRef();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/resumes/${id}`);
        setResume(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load resume");
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleDownloadPDF = () => {
    if (!resumeContentRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `${resume.fullName}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf().set(opt).from(resumeContentRef.current).save();
  };

  if (loading) return <p className="loading-text">Loading resume.....</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!resume) return <p className="no-resume">No resume found</p>;

  return (
    <div className="resume-view-container">
      {/* Only this content will be in the PDF */}
      <div ref={resumeContentRef}>
        {/* Header */}
        <div className="resume-header">
          <h1>{resume.fullName}</h1>
          <p>
            {resume.email} | {resume.phone || "N/A"}
            {resume.linkedin && (
              <> | <a href={resume.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></>
            )}
          </p>
        </div>
        <hr />

        {/* Summary / Objective */}
        {resume.summary && (
          <section className="resume-section">
            <h2 className="section-title">Summary</h2>
            <p>{resume.summary}</p>
          </section>
        )}

        {/* Education */}
        <section className="resume-section">
          <h2 className="section-title">Education</h2>
          <div className="section-content">
            {resume.education && resume.education.length > 0 ? (
              <ul>
                {resume.education.map((edu, idx) => (
                  <li key={idx}>
                    <strong>{edu.degree}</strong> - {edu.institution} ({edu.year})
                  </li>
                ))}
              </ul>
            ) : <p>No education details added yet.</p>}
          </div>
        </section>

        {/* Skills */}
        <section className="resume-section">
          <h2 className="section-title">Skills</h2>
          <div className="section-content skills-list">
            {resume.skills && resume.skills.length > 0 ? (
              resume.skills.map((skill, idx) => (
                <span key={idx} className="skill-item">{skill}</span>
              ))
            ) : <p>No skills listed</p>}
          </div>
        </section>

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Certifications</h2>
            <ul>
              {resume.certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </section>
        )}

        

        {/* Experience */}
        <section className="resume-section">
          <h2 className="section-title">Experience</h2>
          <div className="section-content">
            {resume.experience && resume.experience.length > 0 ? (
              <ul>
                {resume.experience.map((exp, idx) => (
                  <li key={idx}>
                    <strong>{exp.role}</strong> at {exp.company} <br />
                    <em>{exp.duration}</em> <br />
                    {exp.description}
                  </li>
                ))}
              </ul>
            ) : <p>No experience details added yet.</p>}
          </div>
        </section>

        {/* Projects */}
        <section className="resume-section">
          <h2 className="section-title">Projects</h2>
          <div className="section-content">
            {resume.projects && resume.projects.length > 0 ? (
              <ul>
                {resume.projects.map((proj, idx) => (
                  <li key={idx}>
                    <strong>{proj.title}</strong> - {proj.description}{" "}
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer">[Link]</a>}
                  </li>
                ))}
              </ul>
            ) : <p>No projects added yet.</p>}
          </div>
        </section>
      </div>

      {/* Buttons are outside PDF content */}
      <div className="resume-buttons">
        <button className="btn back-btn" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
        <button className="btn download-btn" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ResumeView;
