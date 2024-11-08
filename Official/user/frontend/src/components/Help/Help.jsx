import React, { useState } from "react";
import Navbar from '../Navbar/Navbar';
import './help.css';  // Import the restricted CSS for the Help page

const Help = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Log the entered data to the console
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Message:", message);

        setSubmitted(true);
    };

    return (
        <div className="help-page">  {/* Unique wrapper to restrict styles */}
            <Navbar />
            <h1 className="help-header1">Help Center</h1>

            <section className="help-faq">
                <h3><strong>Frequently Asked Questions</strong></h3>
                <div className="help-faq-item">
                    <h4>What is this application about?</h4>
                    <p>This application serves as a bridge between local authorities and citizens to enhance disaster and risk management efforts.</p>
                </div>
                <div className="help-faq-item">
                    <h4>How can I submit a query?</h4>
                    <p>If you have any questions, please contact us</p>
                </div>
                <div className="help-faq-item">
                    <h4>How can I be added as a user?</h4>
                    <p>To be added as a user, please submit a request to the admin for approval.</p>
                </div>
                <div className="help-faq-item">
                    <h4>How can I access information about a specific event in a particular location?</h4>
                    <p>You can view detailed information about specific events by visiting the "Disaster Report" section in the main menu.</p>
                </div>
                {/* Additional FAQ items can be added here */}
            </section>

            <section className="help-contact-form">
                <h3><strong>Contact Us</strong></h3>
                <p>If you have any further questions or concerns, please don't hesitate to reach out to us at the following email addresses:</p>
                <ul className="email-list">
                    <li><a href="mailto:ajaysuseel673@gmail.com">ajaysuseel673@gmail.com</a></li>
                    <li><a href="mailto:advaithmanojpulparambil@gmail.com">advaithmanojpulparambil@gmail.com</a></li>
                    <li><a href="mailto:sabarijnv10@gmail.com">sabarijnv10@gmail.com</a></li>
                    <li><a href="mailto:kdevpv2003@gmail.com">kdevpv2003@gmail.com</a></li>
                </ul>
            </section>
        </div>
    );
}

export default Help;
