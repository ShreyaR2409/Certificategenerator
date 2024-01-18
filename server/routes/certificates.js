import express from 'express';
import { Certificate } from '../models/Certificate.js';

const router = express.Router();

// Route: POST /api/certificates
router.post('/', async (req, res) => {
  const {
    recipientName,
    courseName,
    completionDate,
    courseInstructorName,
  } = req.body;

  try {
    const newCertificate = await Certificate.create({
      recipientName,
      courseName,
      completionDate,
      courseInstructorName,
    });

    res.status(201).json(newCertificate);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: GET /api/certificates/:id
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
