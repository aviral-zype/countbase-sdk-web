import React from 'react';
import Countbase from 'countbase-sdk-web';
import countbaseImage from './countbase.jpg';

function Contact() {
    const emailUsClick = () => {
        Countbase.q.push(['add_event', {
            "key": "email-us-clicked",
            "count": 1
        }]);
        alert("Email us event triggered");
    }

    return (
        <div className="contact">
            <div>
                <img src={countbaseImage} alt="Home"></img>
            </div>
            <div>
                <h1>support@countbase</h1>
            </div>
            <div>
                <button className="email-us" onClick={emailUsClick}>Email us</button>
            </div>
        </div>
    );
}

export default Contact;