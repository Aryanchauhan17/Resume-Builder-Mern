const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");

const protect  = require("../middleware/authMiddleware");


//POST request -> "/"(endpoint) -> create a new resume 
router.post("/", protect, resumeController.createResume);

//GET resumes/:userId(endpoint) -> (get all resumes of a user) 
router.get("/", protect, resumeController.getResumesByUser); 

//get ressume by id 
router.get("/:id", protect, resumeController.getResumeById);

//PUT request -> api/resumes/:id(endpoint) -> update a resume by id 
router.put("/:id", protect, resumeController.updateResume); 

//DELETE request -> /:id(endpoint) -> delete a resume by id
router.delete("/:id", protect, resumeController.deleteResume);

//export router to use it in server.js
module.exports = router;