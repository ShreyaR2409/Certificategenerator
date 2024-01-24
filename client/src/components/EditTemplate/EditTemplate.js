import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import JoditEditor from 'jodit-react';

const ButtonStyle = styled.button`
  background-color: rgb(91, 91, 255);
  color: white;
  padding: 5px 10px;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  border: transparent;
  margin-right: 20px;
`;

const CertificatePreview = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  margin-top: 20px;
  width: ${(props) => (props.orientation === 'landscape' ? '100%' : '50%')};
  margin: 0 auto;
`;

const EditTemplate = () => {
  const [dropdownValues, setDropdownValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [template, setTemplate] = useState('');
  const [content, setContent] = useState('');
  const [orientation, setOrientation] = useState('landscape'); 
  const quillRef = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    const fetchDropdownValues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/certificates/types');
        setDropdownValues(response.data);
      } catch (error) {
        console.error('Error fetching dropdown values:', error);
      }
    };

    fetchDropdownValues();
  }, []);

  const handleEditorInit = (newEditor) => {
    editor.current = newEditor;
  };

  const getCertificateTemplate = async (selectedValue) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificates?type=${selectedValue}`);
      if (response.data.length > 0) {
        console.log(response.data[0]);
        setTemplate(response.data[0]);

        if (editor.current) {
          console.log('Before setting value:', editor.current);
          setContent(response.data[0].template);
          console.log('After setting value:', editor.current);
        }

      } else {
        console.error('No template found for the selected value.');
      }
    } catch (error) {
      console.error('Error fetching certificate template:', error);
    }
  };

  const updateTemplate = async () => {
    try {
      console.log('Selected Value:', selectedValue);
      const object = {
        template: editor.current.value,
      };
      const response = await axios.put(`http://localhost:5000/api/certificates/${template._id}`, object);
      console.log(response.data[0]);
      window.alert('Updated certificate template successfully!');
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ width: '800px', margin: 'auto', textAlign: 'center', fontFamily: 'Roboto' }}>
      <h1>Edit Template</h1>
      <label>
        Template:
        <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
          <option value="">Select a Template</option>
          {dropdownValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label>
        Certificate Orientation:
        <select value={orientation} onChange={(e) => setOrientation(e.target.value)}>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
        </select>
      </label>

      <div style={{ width: '800px', margin: 'auto' }}>
        <h3>Edit Template</h3>

          <JoditEditor
			ref={editor}
      value={content}
      onChange={(newContent) => setContent(newContent)}
		/>

        <br />
        <ButtonStyle onClick={() => getCertificateTemplate(selectedValue)}>Get</ButtonStyle>
        <ButtonStyle onClick={() => updateTemplate(selectedValue)}>Update</ButtonStyle>
      </div>
    </div>
  );
};

export default EditTemplate;
