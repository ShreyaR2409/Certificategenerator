import React, { useState } from 'react'
import axios from 'axios'

const AddCourse = () => {
    const [courseName, setCourseName] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [courseInstructorName, setCourseInstructorName] = useState('');

    const submitForm = async () => {
        try {
            const object = {
                courseName,
                courseInstructorName,
                completionDate
            }
            const response = await axios.post('http://localhost:5000/api/course', object);
            console.log(response.data);
            window.alert('Course Added Successfully!')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Add Course</h1>
            <form action='#'>
                <p>
                    Course Name: 
                    <input 
                        type='text' 
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)} 
                    />
                </p>
                <p>
                    Course Completion Date: 
                    <input 
                        type='date' 
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)} 
                    />
                </p>
                <p>
                    Course Instructor Name: 
                    <input 
                        type='text' 
                        value={courseInstructorName}
                        onChange={(e) => setCourseInstructorName(e.target.value)} 
                    />
                </p>
                <button onClick={submitForm}>Add Course</button>
            </form>
        </div>
    )
}

export default AddCourse