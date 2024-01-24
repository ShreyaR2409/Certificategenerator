import express, { response } from 'express';
import { CertificateTemplate } from '../models/Certificate.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const templateData = req.body;
    const certificate = await CertificateTemplate.create(templateData);
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json('Unable to POST Template');
  }
})

router.get('/types', async (req, res) => {
  try {
    const certificate = await CertificateTemplate.distinct('type');
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (request, response) => {
  try {
      const { type } = request.query;

      const certificate = await CertificateTemplate.find({type:type});
      // console.log(type);
      // console.log(certificate);
      return response.status(200).json(certificate);
  } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
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
