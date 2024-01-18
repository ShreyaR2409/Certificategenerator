import express, { response } from 'express';
import { CertificateTemplate } from '../models/Certificate.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const object = req.body;
    const certificate = await CertificateTemplate.create(object);
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json('Unable to POST Template');
  }
})

router.get('/', async (req, res) => {
  try {
    const certificate = await CertificateTemplate.find({});
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json('Unable to get Templates');
  }
})

router.get('/:id', async (req, res) => {
  try {
    const certificate = await CertificateTemplate.findById(req.params.id);
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await CertificateTemplate.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Template not found' });
    }

    return response.status(200).send({ message: 'Template updated successfully' });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;
