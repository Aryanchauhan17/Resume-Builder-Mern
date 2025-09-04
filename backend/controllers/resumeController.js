const Resume = require("../models/Resume");

// Create a new resume
exports.createResume = async (req, res) => {
    try {
        const newResume = new Resume({
            ...req.body,
            user: req.user.id   // attach logged-in user
        });

        const savedResume = await newResume.save();
        res.status(201).json(savedResume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all resumes of the logged-in user
exports.getResumesByUser = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id });
        res.status(200).json(resumes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

// Get a single resume by id (only if it belongs to the user)
exports.getResumeById = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const resume = await Resume.findOne({
            _id: req.params.id,   // ✅ fixed field name
            user: userId,         // ownership check
        }); 

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        res.status(200).json(resume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update resume by id (only if it belongs to the user)
exports.updateResume = async (req, res) => {
    try {
        const updatedResume = await Resume.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, // ownership check
            { ...req.body }, // ✅ spread req.body so linkedin & new fields are included
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

// Delete resume by id (only if it belongs to the user)
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
