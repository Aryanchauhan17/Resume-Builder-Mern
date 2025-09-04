import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import html2pdf from "html2pdf.js";
import "../styles/ResumeForm.css";

const ResumeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    summary: "",
    skills: "",
    certifications: [""],
    education: [{ degree: "", institution: "", year: "" }],
    experience: [{ company: "", role: "", duration: "", description: "" }],
    projects: [{ title: "", description: "", link: "" }],
  });

  const previewRef = useRef();

  // Fetch resume if editing
  useEffect(() => {
    if (isEdit) {
      const fetchResume = async () => {
        try {
          const res = await api.get(`/resumes/${id}`);
          const {
            fullName,
            email,
            phone,
            linkedin,
            summary,
            skills,
            certifications: fetchedCerts,
            education: fetchedEducation,
            experience: fetchedExperience,
            projects: fetchedProjects,
          } = res.data;

          setFormData({
            fullName: fullName || "",
            email: email || "",
            phone: phone || "",
            linkedin: linkedin || "",
            summary: summary || "",
            skills: skills && skills.length ? skills.join(", ") : "",
            certifications: Array.isArray(fetchedCerts) && fetchedCerts.length ? fetchedCerts : [""],
            education:
              Array.isArray(fetchedEducation) && fetchedEducation.length
                ? fetchedEducation.map((e) => ({
                    degree: e.degree || "",
                    institution: e.institution || "",
                    year: e.year || "",
                  }))
                : [{ degree: "", institution: "", year: "" }],
            experience:
              Array.isArray(fetchedExperience) && fetchedExperience.length
                ? fetchedExperience.map((ex) => ({
                    role: ex.role || "",
                    company: ex.company || "",
                    duration: ex.duration || "",
                    description: ex.description || "",
                  }))
                : [{ role: "", company: "", duration: "", description: "" }],
            projects:
              Array.isArray(fetchedProjects) && fetchedProjects.length
                ? fetchedProjects.map((p) => ({
                    title: p.title || "",
                    description: p.description || "",
                    link: p.link || "",
                  }))
                : [{ title: "", description: "", link: "" }],
          });
        } catch (err) {
          console.error("Failed to fetch resume:", err);
        }
      };
      fetchResume();
    }
  }, [id, isEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (e, index, type) => {
    const updatedArray = [...formData[type]];
    updatedArray[index][e.target.name] = e.target.value;
    setFormData({ ...formData, [type]: updatedArray });
  };

  const addField = (type) => {
    let newField;
    if (type === "education") newField = { degree: "", institution: "", year: "" };
    else if (type === "experience") newField = { company: "", role: "", duration: "", description: "" };
    else if (type === "projects") newField = { title: "", description: "", link: "" };
    else if (type === "certifications") newField = "";
    setFormData({ ...formData, [type]: [...formData[type], newField] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
      certifications: formData.certifications || [],
      education: formData.education || [],
      experience: formData.experience || [],
      projects: formData.projects || [],
    };

    try {
      if (isEdit) await api.put(`/resumes/${id}`, dataToSend);
      else await api.post("/resumes", dataToSend);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleDownloadPDF = () => {
    if (!previewRef.current) return;
    const opt = {
      margin: 0.5,
      filename: `${formData.fullName}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(previewRef.current).save();
  };

  return (
    <div style={{ display: "flex", gap: "40px", maxWidth: "1200px", margin: "30px auto" }}>
      {/* Left: Form */}
      <div style={{ flex: 1 }}>
        <h1>{isEdit ? "Edit Resume" : "Create Resume"}</h1>
        <form onSubmit={handleSubmit}>
          {/* Name, Email, Phone, LinkedIn, Summary */}
          <div style={{ marginBottom: "10px" }}>
            <label>Full Name:</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>LinkedIn:</label>
            <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Summary:</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Write a short professional summary..." rows={4} style={{ width: "100%", padding: "8px" }} />
          </div>

          {/* Skills */}
          <div style={{ marginBottom: "10px" }}>
            <label>Skills (comma separated):</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
          </div>

          {/* Certifications */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Certifications</h3>
            {formData.certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <input type="text" value={cert} placeholder="Certification" onChange={(e) => handleArrayChange(e, idx, "certifications")} style={{ width: "100%", padding: "8px" }} />
              </div>
            ))}
            <button type="button" onClick={() => addField("certifications")}>+ Add Certification</button>
          </div>

          {/* Education */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Education</h3>
            {formData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <input type="text" name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange(e, index, "education")} style={{ marginRight: "10px" }} />
                <input type="text" name="institution" placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange(e, index, "education")} style={{ marginRight: "10px" }} />
                <input type="text" name="year" placeholder="Year" value={edu.year} onChange={(e) => handleArrayChange(e, index, "education")} />
              </div>
            ))}
            <button type="button" onClick={() => addField("education")}>+ Add Education</button>
          </div>

          {/* Experience */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Experience</h3>
            {formData.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <input type="text" name="company" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange(e, index, "experience")} style={{ marginRight: "10px" }} />
                <input type="text" name="role" placeholder="Role" value={exp.role} onChange={(e) => handleArrayChange(e, index, "experience")} style={{ marginRight: "10px" }} />
                <input type="text" name="duration" placeholder="Duration" value={exp.duration} onChange={(e) => handleArrayChange(e, index, "experience")} style={{ marginRight: "10px" }} />
                <input type="text" name="description" placeholder="Description" value={exp.description} onChange={(e) => handleArrayChange(e, index, "experience")} />
              </div>
            ))}
            <button type="button" onClick={() => addField("experience")}>+ Add Experience</button>
          </div>

          {/* Projects */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Projects</h3>
            {formData.projects.map((proj, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <input type="text" name="title" placeholder="Title" value={proj.title} onChange={(e) => handleArrayChange(e, index, "projects")} style={{ marginRight: "10px" }} />
                <input type="text" name="description" placeholder="Description" value={proj.description} onChange={(e) => handleArrayChange(e, index, "projects")} style={{ marginRight: "10px" }} />
                <input type="text" name="link" placeholder="Link" value={proj.link} onChange={(e) => handleArrayChange(e, index, "projects")} />
              </div>
            ))}
            <button type="button" onClick={() => addField("projects")}>+ Add Project</button>
          </div>

          <button type="submit" style={{ padding: "10px 20px", marginRight: "10px" }}>{isEdit ? "Update Resume" : "Create Resume"}</button>
          <button type="button" style={{ padding: "10px 20px" }} onClick={handleDownloadPDF}>Download PDF</button>
        </form>
      </div>

      {/* Right: Live Preview */}
      <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: "8px", padding: "20px", background: "#f9f9f9", maxHeight: "90vh", overflowY: "auto" }} ref={previewRef}>
        <h2 style={{ textAlign: "center" }}>Live Preview</h2>
        <h1>{formData.fullName || "Full Name"}</h1>
        <p>
          {formData.email || "Email"} | {formData.phone || "Phone"}{" "}
          {formData.linkedin && (
            <>| <a href={formData.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></>
          )}
        </p>

        {formData.summary && (
          <div>
            <h3>Summary</h3>
            <p>{formData.summary}</p>
          </div>
        )}

        {formData.skills && (
          <div>
            <h3>Skills</h3>
            <p>{formData.skills}</p>
          </div>
        )}

        {formData.certifications.length > 0 && (
          <div>
            <h3>Certifications</h3>
            <ul>
              {formData.certifications.map((c, i) => c && <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}

        {formData.education.length > 0 && (
          <div>
            <h3>Education</h3>
            <ul>
              {formData.education.map((edu, i) =>
                (edu.degree || edu.institution || edu.year) && (
                  <li key={i}>
                    <strong>{edu.degree}</strong> - {edu.institution} ({edu.year})
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {formData.experience.length > 0 && (
          <div>
            <h3>Experience</h3>
            <ul>
              {formData.experience.map((exp, i) =>
                (exp.role || exp.company || exp.duration || exp.description) && (
                  <li key={i}>
                    <strong>{exp.role}</strong> at {exp.company} <br />
                    <em>{exp.duration}</em> <br />
                    {exp.description}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {formData.projects.length > 0 && (
          <div>
            <h3>Projects</h3>
            <ul>
              {formData.projects.map((proj, i) =>
                (proj.title || proj.description || proj.link) && (
                  <li key={i}>
                    <strong>{proj.title}</strong> - {proj.description}{" "}
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer">[Link]</a>}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
