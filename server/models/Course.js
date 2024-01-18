import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true
        },
        completionDate: {
            type: String,
            required: true
        },
        courseInstructorName: {
            type: String,
            required: true
        }
    }
)

export const Course = mongoose.model('course', courseSchema);