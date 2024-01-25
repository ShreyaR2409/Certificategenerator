import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema(
  {
    template: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    orientation: {
      type: String,
      required: true
    }
  }
)

export const CertificateTemplate = mongoose.model('certificatetemplate', certificateTemplateSchema);