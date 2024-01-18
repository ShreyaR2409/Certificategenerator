import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import Image from '../../assets/logo.png';

const CertificateTemplate = () => {
  const certificateId = '65a9628e2b7bca0be4f8fbbd';

  const [template, setTemplate] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [courseInstructorName, setCourseInstructorName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  const certificateRef = useRef(null);

  useEffect(() => {
    const getCertificateTemplate = async () => {
      const response = await axios.get(`http://localhost:5000/api/certificates/${certificateId}`);
      console.log(response.data);
      setTemplate(response.data);
    };

    getCertificateTemplate();
  }, [])

  const generateCertificate = async () => {
    if (
      recipientName === '' ||
      courseInstructorName === '' ||
      courseName === '' ||
      completionDate === ''
    ) {
      window.alert('Please fill all the required fields!');
    } else {
      try {
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
    <div className="certificate-form">
      <div className="certificate-input-form">
        <h2>Enter Certificate Details</h2>
        <label>
          Name:
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Course Name:
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Completion Date:
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Course Instructor Name:
          <input
            type="text"
            value={courseInstructorName}
            onChange={(e) => setCourseInstructorName(e.target.value)}
          />
        </label>
      </div>
      <br />
      <button onClick={generateCertificate}>Generate Certificate</button>
      {showCertificate && (
        <>
          <div className="certificateDiv" style={{ width: '860px', height: '695px', margin: 'auto' }}>
            <div ref={certificateRef} dangerouslySetInnerHTML={{ __html: template.template.replace('${recipientName}', recipientName).replace('https://leapottechnologies.graphy.com/logo.png', Image).replace('${courseName}', courseName).replace('${completionDate}', completionDate).replace('{{SERIALNUMBER}}', certificateId).replace('{{DATEISSUED}}', new Date().toLocaleDateString()) }} />
          </div>
          <button onClick={downloadCertificate}>Download Certificate</button>
        </>
      )}
    </div>
  );
};

export default CertificateTemplate;
