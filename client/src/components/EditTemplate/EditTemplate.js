import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTemplate = () => {
  const certificateId = '65a9628e2b7bca0be4f8fbbd';

  const [template, setTemplate] = useState('');
  const [newTemplate, setNewTemplate] = useState('');

  useEffect(() => {
    const getCertificateTemplate = async () => {
      const response = await axios.get(`http://localhost:5000/api/certificates/${certificateId}`);
      console.log(response.data);
      setTemplate(response.data);
      setNewTemplate(response.data.template.replace('><', '>\n<'));
    };

    getCertificateTemplate();
  }, [])

  const updateTemplate = async () => {
    try {
      console.log(newTemplate)
      const object = {
        template: newTemplate
      }
      const response = await axios.put(`http://localhost:5000/api/certificates/${certificateId}`, object);
      console.log(response.data);
      window.alert('Updated certificate template successfully!');
      window.location.reload()
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <h1>Edit Template</h1>
      <div>
        <h3>Edit Template</h3>
        <textarea 
          value={newTemplate}
          onChange={(e) => {setNewTemplate(e.target.value)}}
          rows='20'
          cols='100'
        ></textarea>
        <button onClick={updateTemplate}>Update</button>
      </div>
      <div>
        <h3>Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: template.template}} />
      </div>
    </div>
  )
}

export default EditTemplate