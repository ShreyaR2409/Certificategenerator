import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <Link to='/'>Generate Certificates</Link>
        <Link to='/editCertificateTemplate'>Edit Certificates Template</Link>
        <Link to='/addCourse'>Add Course</Link>
    </div>
  )
}

export default Navbar