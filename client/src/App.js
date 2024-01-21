import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CertificateTemplate from './components/CertificateTemplate/CertificateTemplate';
import EditTemplate from './components/EditTemplate/EditTemplate';
import EditTemplateForm from './components/EditTemplateForm/EditTemplateForm';
// import AddCourse from './components/AddCourse/AddCourse';
import Navbar from './includes/Navbar/Navbar';

function App() {
  return (
    // <div className="App">
    //   {/* <CertificateTemplate /> */}
    // </div>

    <Router>
      <Navbar />
      <Routes>
        <Route index path='/' element={<CertificateTemplate />} />
        <Route path='/editCertificateTemplate' element={<EditTemplate />} />
        <Route path='/editTemplateForm' element={<EditTemplateForm />} />
        {/* <Route path='/addCourse' element={<AddCourse />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
