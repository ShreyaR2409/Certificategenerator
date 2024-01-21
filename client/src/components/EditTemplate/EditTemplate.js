import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/monokai-sublime.css';
import hljs from 'highlight.js';

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

const EditTemplate = () => {
  const [dropdownValues, setDropdownValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [template, setTemplate] = useState('');
  const quillRef = useRef(null);

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

  const getCertificateTemplate = async (selectedValue) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificates?type=${selectedValue}`);
      if (response.data.length > 0) {
        console.log(response.data[0]);
        setTemplate(response.data[0]);
        if (quillRef.current) {
          quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(response.data[0].template);
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
        template: quillRef.current.getEditor().root.innerHTML,
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

      <div>
        <h3>Edit Template</h3>
        <ReactQuill
          ref={quillRef}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'code'],
              [{ color: [] }, { background: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
            syntax: {
              highlight: (text) => hljs.highlightAuto(text).value,
            },
          }}
          formats={[
            'header',
            'bold', 'italic', 'underline', 'strike', 'code',
            'color', 'background',
            'list', 'bullet',
            'link', 'image',
          ]}
          style={{ height: '400px', marginBottom: '20px' }}
        />
        <br />
        <ButtonStyle onClick={() => getCertificateTemplate(selectedValue)}>Get</ButtonStyle>
        <ButtonStyle onClick={() => updateTemplate(selectedValue)}>Update</ButtonStyle>
      </div>
      <div>
        <h3>Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: template.template }} />
      </div>
    </div>
  );
};

export default EditTemplate;
