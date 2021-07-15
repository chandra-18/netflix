import {ImGoogle} from 'react-icons/im'
import {FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="contact-section">
    <div className="contact-icons-container">
      <ImGoogle className="contact-icon" />
      <FaTwitter className="contact-icon" />
      <FaInstagram className="contact-icon" />
      <FaYoutube className="contact-icon" />
    </div>
    <h1 className="contact-heading">Contact Us</h1>
  </div>
)

export default Footer
