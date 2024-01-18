import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {

    recipientName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    courseInstructorName: {
      type: String,
      required: true,
    }
  }
)

export const Certificate = mongoose.model('Certificate', certificateSchema);