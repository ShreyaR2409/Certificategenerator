import express, { response } from 'express';
import { Course } from './../models/Course.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const object = req.body;
    const course = await Course.create(object);
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json('Unable to POST Course');
  }
})

router.get('/', async (req, res) => {
  try {
    const course = await Course.find({});
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json('Unable to get Courses');
  }
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Course.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Course not found' });
    }

    return response.status(200).send({ message: 'Course Details updated successfully' });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const topic = await Course.findByIdAndDelete(id);

    if (!topic) {
      return response.status(404).json({ message: 'Course not found' });
    }
    return response.status(200).send({ message: 'Course deleted successfully' });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;
