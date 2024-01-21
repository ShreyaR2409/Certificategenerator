import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import Image from '../../assets/logo.png';
import styled from 'styled-components';

const CertificateForm = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0;
  margin: auto;
`;

const CertificateInputForm = styled.div`
  width: max-content;
  border: 1px solid #666;  
  padding: 30px 50px;
  background-color: rgb(244, 244, 254);
`;

const CertificateHeading = styled.h2`
  font-size: 30px;
  margin-bottom: 35px;
`;

const LabelContent = styled.label`
  display: flex;
  justify-content: space-between;
`;

const ButtonStyle = styled.button`
  background-color: rgb(91, 91, 255);
  color: white;
  padding: 5px 10px;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  border: transparent;
`;

const CertificateTemplate = () => {
  const certificateId = '65aa707197ef135d84973abd';
  const [dropdownValues, setDropdownValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [template, setTemplate] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [courseInstructorName, setCourseInstructorName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  const certificateRef = useRef(null);

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
      setTemplate(response.data[0]);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching certificate template:', error);
    }
  };

  const generateCertificate = async () => {
    if (
      recipientName === '' ||
      courseInstructorName === '' ||
      courseName === '' ||
      completionDate === '' ||
      selectedValue === ''
    ) {
      window.alert('Please fill all the required fields and select a template!');
    } else {
      try {
        await getCertificateTemplate(selectedValue);
        setShowCertificate(true);
      } catch (error) {
        console.error('Error generating certificate:', error);
      }
    }
  };

  const downloadCertificate = () => {
    if (certificateRef.current) {
      const scale = 2;
      html2canvas(certificateRef.current, {
        scale: scale,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
      }).then((canvas) => {
        const link = document.createElement('a');
        document.body.appendChild(link);

        link.href = canvas.toDataURL('image/png');
        link.download = 'certificate.png';
        link.click();

        document.body.removeChild(link);
      });
    }
  };

  return (
    <CertificateForm>
      <CertificateInputForm>
        <CertificateHeading>Enter Certificate Details</CertificateHeading>
        <LabelContent>
          Name:
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </LabelContent>
        <br />
        <LabelContent>
          Course Name:
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </LabelContent>
        <br />
        <LabelContent>
          Completion Date:
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
          />
        </LabelContent>
        <br />
        <LabelContent>
          Course Instructor Name:
          <input
            type="text"
            value={courseInstructorName}
            onChange={(e) => setCourseInstructorName(e.target.value)}
          />
        </LabelContent>
        <br />
        <LabelContent>
          Template:
          <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
            <option value="">Select a Template</option>
            {dropdownValues.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </LabelContent>
      </CertificateInputForm>
      <br />
      <ButtonStyle onClick={generateCertificate}>Generate Certificate</ButtonStyle>
      {showCertificate && (
        <>
          <div className="certificateDiv" style={{ width: '860px', height: '695px', margin: 'auto' }}>
            <div
              ref={certificateRef}
              dangerouslySetInnerHTML={{
                __html: template.template
                        .replace('${recipientName}', recipientName)
                        .replace('https://leapottechnologies.graphy.com/logo.png', Image)
                        .replace('${courseName}', courseName)
                        .replace('${completionDate}', completionDate)
                        .replace('${serialNumber}', certificateId)
                        .replace('${issuedDate}', new Date().toLocaleDateString())
              }} 
            />
          </div>
          <ButtonStyle onClick={downloadCertificate}>Download Certificate</ButtonStyle>
        </>
      )}
    </CertificateForm>
  );
};

export default CertificateTemplate;
