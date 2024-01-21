import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTemplate = () => {
  const certificateId = '65a9628e2b7bca0be4f8fbbd';

  const [template, setTemplate] = useState('');
  const [editedTemplate, setEditedTemplate] = useState('');
  const [styleFormData, setStyleFormData] = useState({
    borderColor: '#787878',
    fontFamily: 'Roboto',
  });

  useEffect(() => {
    const getCertificateTemplate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/certificates/${certificateId}`);
        setTemplate(response.data.template);
        setEditedTemplate(response.data.template);
        setStyleFormData(response.data.styleFormData || {}); // Ensure styleFormData is initialized even if not present in the response
      } catch (error) {
        console.error('Error fetching certificate template:', error);
      }
    };

    getCertificateTemplate();
  }, [certificateId]);

  const updateTemplate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/certificates/${certificateId}`, {
        template: editedTemplate,
        styleFormData,
      });
      console.log(response.data);
      window.alert('Updated certificate template successfully!');
      setTemplate(editedTemplate);
    } catch (e) {
      console.error('Error updating certificate template:', e);
    }
  };

  return (
    <div>
      <h1>Edit Template</h1>
      <div>
        <h3>Edit Template Styles</h3>
        <form onSubmit={(e) => { e.preventDefault(); updateTemplate(); }}>
          {/* Form fields for CSS styles */}
          <label htmlFor="borderColor">Border Color:</label>
          <input
            type="color"
            id="borderColor"
            value={styleFormData.borderColor}
            onChange={(e) => setStyleFormData({ ...styleFormData, borderColor: e.target.value })}
          />
          <br />
          <label htmlFor="fontFamily">Font Family:</label>
          <input
            type="text"
            id="fontFamily"
            value={styleFormData.fontFamily}
            onChange={(e) => setStyleFormData({ ...styleFormData, fontFamily: e.target.value })}
          />

          <button type="submit">Update</button>
        </form>
      </div>
      <div>
        <h3>Preview</h3>
        <div
          style={{
            border: `${styleFormData.borderColor}`,
            fontFamily: styleFormData.fontFamily,
          }}
          dangerouslySetInnerHTML={{ __html: template }}
        />
      </div>
    </div>
  );
};

export default EditTemplate;
