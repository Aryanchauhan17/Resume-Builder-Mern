import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}` ;
    }
    return config;
});


//api.get("/resumes")

//authentication routes 

//register a new user
export const registerUser = (data) => api.post("/users/register", data);

//login user
export const loginUser = (data) => api.post("/users/login", data);

//get current logged in user profile 
export const getProfile = () => api.get("/auth/profile"); 



//resume routes 

//create a new resume
export const createResume = (data) => api.post("/resumes", data);

// get all resumes of logged-in user
export const getResumes = () => api.get("/resumes");

//get resume by id
export const getResumeById = (id) => api.get(`/resumes/${id}`);

//update resume by id
export const updateResume = (id, data) => api.put(`/resumes/${id}`, data);

//delete a resume by id
export const deleteResume = (id) => api.delete(`/resumes/${id}`);

export default api;