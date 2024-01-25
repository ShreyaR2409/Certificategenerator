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
  width: ${(props) => (props.orientation === 'Landscape' ? '100%' : '50%')};
  margin: 0 auto;
`;

const EditTemplate = () => {
  const [dropdownValues, setDropdownValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [template, setTemplate] = useState(null);
  const [content, setContent] = useState('');
  const [orientation, setOrientation] = useState('Landscape');
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

  const getCertificateTemplate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificates?type=${selectedValue}&orientation=${orientation}`);
      console.log('Request URL:', `http://localhost:5000/api/certificates?type=${selectedValue}&orientation=${orientation}`);

      if (response.data.length > 0) {
        setTemplate(response.data[0]);
        setContent(response.data[0].template);
      } else {
        console.error('No template found for the selected value and orientation.');
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
    <div>
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
          <option value="Landscape">Landscape</option>
          <option value="Portrait">Portrait</option>
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
        <ButtonStyle onClick={getCertificateTemplate}>Get</ButtonStyle>
        <ButtonStyle onClick={updateTemplate}>Update</ButtonStyle>
      </div>
    </div>
  );
};

export default EditTemplate;
