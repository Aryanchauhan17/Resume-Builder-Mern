const Resume = require("../models/Resume");

// Create a new resume
exports.createResume = async (req, res) => {
    try {
        const newResume = new Resume({
            ...req.body,
            user: req.user.id   
        });

        const savedResume = await newResume.save();
        res.status(201).json(savedResume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all resumes of the loggedin user
exports.getResumesByUser = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id });
        res.status(200).json(resumes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

// Get a single resume by id 
exports.getResumeById = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const resume = await Resume.findOne({
            _id: req.params.id,   
            user: userId,         
        }); 

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        res.status(200).json(resume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update resume by id 
exports.updateResume = async (req, res) => {
    try {
        const updatedResume = await Resume.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, // ownership check
            { ...req.body },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        res.status(200).json(updatedResume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete resume by id 
exports.deleteResume = async (req, res) => {
    try {
        const deletedResume = await Resume.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
