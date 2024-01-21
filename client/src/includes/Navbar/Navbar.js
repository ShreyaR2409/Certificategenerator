import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  background-color: #EEE7DA;
`;

const ButtonStyle = styled.button`
  display: flex;
  background-color: #EEE7DA;
  padding: 5px 10px;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
`;

const Navbar = () => {
  return (
    <div>
      <ButtonContainer>
        <ButtonStyle> <Link to='/'>Generate Certificates</Link></ButtonStyle>
        <ButtonStyle><Link to='/editCertificateTemplate'>Edit Certificates Template</Link></ButtonStyle>
        <ButtonStyle><Link to='/editTemplateForm'>Edit form</Link></ButtonStyle>
        {/* <Link to='/addCourse'>Add Course</Link> */}
        </ButtonContainer>
    </div>
  )
}

export default Navbar