const mongoose = require("mongoose");

//define resume schema
const resumeSchema = new mongoose.Schema( {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    linkedin: {
        type: String,
    },
    phone: {
        type: String,
    },
    summary: {
        type: String,
    },
    education: [
        {
            degree: { type: String, required: true },
            institution: {type: String, required: true },
            year: { type: String, required: true },
        },
    ],
    experience: [
        {
            company: { type: String},
            role: { type: String, required: true},
            duration: { type: String },
            description:  {type: String },
        },
    ], 

    projects: [
        {
            title: {type: String},
            description: { type: String },
            link: {type: String },
        },
    ],
    skills: [{ type: String }],

    certifications: [{ type: String }],
      
},
 { timestamps: true }
 
);
 
//export resume model
module.exports = mongoose.model("Resume", resumeSchema);