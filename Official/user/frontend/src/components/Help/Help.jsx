import React, { useState } from "react";
import Navbar from '../Navbar/Navbar';
import './help.css';

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
        <div className="help-page">
            <Navbar />
            <h1 className="header1">Help Center</h1>

            <section className="faq">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-item">
                    <h4>What is this application about?</h4>
                    <p>This application integrates local authorities in India with citizens to improve disaster/risk management.</p>
                </div>
                {/* Other FAQ items here */}
            </section>

            <section className="contact-form">
                <h3>Contact Us</h3>
                {submitted ? (
                    <p>Thank you for your message! We will get back to you soon.</p>
                
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-row">
                            <div className="input-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label>Message:</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Send</button>
                    </form>
                )}
            </section>
        </div>
    );
}

export default Help;
