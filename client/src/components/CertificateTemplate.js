import React, { useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

const CertificateTemplate = () => {
  const [recipientName, setRecipientName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [courseInstructorName, setCourseInstructorName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState(null);

  const certificateRef = useRef(null);

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
        const response = await axios.post('http://localhost:5000/api/certificates', {
          recipientName,
          courseName,
          completionDate,
          courseInstructorName,
        });

        const newCertificateId = response.data._id;
        setCertificateId(newCertificateId);
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

  const fetchCertificate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificates/${certificateId}`);
      const certificateData = response.data;
      setRecipientName(certificateData.recipientName);
      setCourseName(certificateData.courseName);
      setCompletionDate(certificateData.completionDate);
      setCourseInstructorName(certificateData.courseInstructorName);
    } catch (error) {
      console.error('Error fetching certificate:', error);
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
          <div className="certificateDiv">
            <div
              ref={certificateRef}
              dangerouslySetInnerHTML={{
                __html: `
                  <div class="certificate">
                    <center>
                      <div style="padding:20px; text-align:center; border: 10px solid #787878;font-family: Roboto">
                        <img src="https://leapottechnologies.graphy.com/logo.png" alt="LeaPot Technologies" title="Logo" style="height: 3.8rem;">
                        <span style="font-size:50px; font-weight:bold">Certificate of Completion</span>
                        <br><br>
                        <span style="font-size:25px"><i>This is to certify that</i></span>
                        <br><br>
                        <span style="font-size:30px"><b>${recipientName}</b></span><br /><br />
                        <span style="font-size:25px"><i>has completed the course</i></span> <br /><br />
                        <span style="font-size:30px">${courseName}</span> <br /><br />
                        <span style="font-size:25px"><i>Completed Date</i></span><br>
                        <span style="font-size:25px"><i>${new Date(completionDate).toLocaleDateString()}</i></span><br>
                        <br>
                        <br>
                        <br>
                        <table style="width: 100%;">
                          <tr>
                            <td><b>LeaPot Technologies</b></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td style="border:0;border-bottom:1px solid #000;"></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td style="text-align:center"><b>Signature</b></td>
                            <td style="text-align: right;">{{SERIALNUMBER}}<br>Issued On: <b>${new Date(completionDate).toLocaleDateString()}</b></td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </center>
                </div>
                `,
              }}
            />
          </div>
          <button onClick={downloadCertificate}>Download Certificate</button>
          <button onClick={fetchCertificate}>Fetch Certificate</button>
        </>
      )}
    </div>
  );
};

export default CertificateTemplate;
