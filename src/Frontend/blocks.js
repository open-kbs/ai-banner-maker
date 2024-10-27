export const addBlocks = ({editor, KB}) => {
    const bm = editor.BlockManager;
    const category = {
        id: 'Top Picks',
        label: 'Top Picks',
        order: 1,
        open: true,
    }
    // Image Top Picks Block
    bm.add('image-top-picks', {
        ...bm?.get('image')?.attributes,
        category,
        media: `
        <svg viewBox="0 0 64 64" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="48" height="48" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="4"/>
        <circle cx="20" cy="20" r="4" fill="currentColor"/>
        <path d="M8 56 L24 40 L34 50 L56 28 L56 56 Z" fill="currentColor"/>
        </svg>
    `
    });

    // Promotion Banner Block
    bm.add('promo-banner', {
        label: 'Promo Banner',
        category,
        media: `
        <svg viewBox="0 0 64 64" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="16" width="56" height="32" fill="currentColor" rx="4" ry="4"/>   
            <circle cx="22" cy="26" r="8" fill="#fff"/>
            <circle cx="42" cy="38" r="8" fill="#fff"/>
            <line x1="16" y1="44" x2="48" y2="20" stroke="#fff" stroke-width="4"/>
        </svg>
    `,
        content: `
        ${commonStyles}
        <div class="kb-block promo-banner">
            <h2>Special Offer!</h2>
            <p>Get 50% off on all items</p>
        </div>
    `,
    });

    // Call-To-Action Block
    bm.add('action-button', {
        label: 'Action Button',
        category,
        media: `
        <svg viewBox="0 0 64 64" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="16" width="56" height="32" fill="currentColor" rx="16" ry="16"/>
            <path d="M26 26 L38 32 L26 38 Z" fill="#fff"/>
            <line x1="20" y1="32" x2="12" y2="32" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <line x1="52" y1="32" x2="44" y2="32" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
        content: `
        ${commonStyles}
        <button class="kb-block action-button">Act Now</button>
    `,
    });

    // Quote Block (using existing quote block)
    bm.add('quote-top-picks', {
        ...bm?.get('quote')?.attributes,
        category,
        label: 'Quote',
        media: `
        <svg viewBox="0 0 24 24" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M6,17h3l2-4V7H5v6h3L6,17z M14,17h3l2-4V7h-6v6h3L14,17z"/>
        </svg>
    `
    });

    // Text Block (using existing text block)
    bm.add('text-box-top-picks', {
        ...bm?.get('text-basic')?.attributes,
        category,
        label: 'Text Box',
    });

    // Bullet List Block (custom)
    bm.add('bullet-list', {
        label: 'Bullet List',
        category,
        media: `
        <svg viewBox="0 0 24 24" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
        </svg>
    `,
        content: `
        ${commonStyles}
        <ul class="kb-block bullet-list">
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
        </ul>
    `,
    });

    // Columns Block (using existing column block)
    bm.add('columns3-top-picks', {
        ...bm?.get('column3')?.attributes,
        category,
        label: 'Columns3',
    });

    // Columns Block (using existing column block)
    bm.add('columns1-top-picks', {
        ...bm?.get('column1')?.attributes,
        category,
        label: 'Columns1',
    });

    // Subscribe Form Block
    bm.add('subscribe-form', {
        label: 'Subscribe Form',
        category,
        media: `
            <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="currentColor" d="M21 8v11.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V8l9 6 9-6zm-9 4L3 6h18l-9 6z"/>
            </svg>
        `,
        content: `
            ${commonStyles}
            <div class="kb-block subscribe-form">
                <h2>Subscribe for Updates</h2>
                <form id="subscribe-form">
                    <input type="text" id="name" name="name" placeholder="Your Name" required>
                    <input type="email" id="email" name="email" placeholder="Your Email" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.getElementById('subscribe-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const data = {
                        action: "createItem",
                        kbId: "${KB.kbId}",
                        itemType: "subscribeForm",
                        attributes: [
                            { attrType: "keyword1", attrName: "name", encrypted: true },
                            { attrType: "keyword2", attrName: "email", encrypted: true }
                        ],
                        item: {
                            name: formData.get('name'),
                            email: formData.get('email')
                        }
                    };
                    ${loadingJS}
                    axios.post('https://chat.openkbs.com/publicAPIRequest', data)
                        .then(response => {
                            Swal.fire('Success', 'Subscription successful!', 'success');
                        })
                        .catch(error => {
                            Swal.fire('Error', 'Subscription failed. Please try again.', 'error');
                        });
                });
            </script>
        `,
    });

    // Contact Us Form Block
    bm.add('contact-us-form', {
        label: 'Contact Us Form',
        category,
        media: `
            <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="currentColor" d="M21 6.5a1 1 0 0 1 .993.883L22 7.5v9a1 1 0 0 1-.883.993L21 17.5h-2a1 1 0 0 1-.993-.883L18 16.5v-9a1 1 0 0 1 .883-.993L19 6.5h2zm-6 1v2H5v-2h10zm0 4v2H5v-2h10zm0 4v2H5v-2H5z"/>
            </svg>
        `,
        content: `
            ${commonStyles}
            <div class="kb-block contact-us-form">
                <h2>Contact Us</h2>
                <form id="contact-us-form">
                    <input type="text" id="name" name="name" placeholder="Your Name" required>
                    <input type="email" id="email" name="email" placeholder="Your Email" required>
                    <textarea id="message" name="message" placeholder="Your Message" rows="4" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.getElementById('contact-us-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const data = {
                        action: "createItem",
                        kbId: "${KB.kbId}",
                        itemType: "contactForm",
                        attributes: [
                            { attrType: "keyword1", attrName: "name", encrypted: true },
                            { attrType: "keyword2", attrName: "email", encrypted: true },
                            { attrType: "text1", attrName: "message", encrypted: true }
                        ],
                        item: {
                            name: formData.get('name'),
                            email: formData.get('email'),
                            message: formData.get('message')
                        }
                    };
                    ${loadingJS}
                    axios.post('https://chat.openkbs.com/publicAPIRequest', data)
                        .then(response => {
                            Swal.fire('Success', 'Message sent successfully!', 'success');
                        })
                        .catch(error => {
                            Swal.fire('Error', 'Failed to send message. Please try again.', 'error');
                        });
                });
            </script>
        `,
    });

    // Feedback Form Block
    bm.add('feedback-form', {
        label: 'Feedback Form',
        category,
        media: `
            <svg viewBox="0 0 24 24" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M2 2v16h4v4l4-4h12V2H2zm14 9H6V9h10v2zm0-3H6V6h10v2z"/>
            </svg>
        `,
        content: `
            ${commonStyles}
            <div class="kb-block feedback-form">
                <h2>Feedback</h2>
                <form id="feedback-form">
                    <input type="text" id="name" name="name" placeholder="Your Name" required>
                    <textarea id="feedback" name="feedback" placeholder="Your Feedback" rows="4" required></textarea>
                    <button type="submit">Submit Feedback</button>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.getElementById('feedback-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const data = {
                        action: "createItem",
                        kbId: "${KB.kbId}",
                                                itemType: "feedbackForm",
                        attributes: [
                            { attrType: "keyword1", attrName: "name", encrypted: true },
                            { attrType: "text1", attrName: "feedback", encrypted: true }
                        ],
                        item: {
                            name: formData.get('name'),
                            feedback: formData.get('feedback')
                        }
                    };
                    ${loadingJS}
                    axios.post('https://chat.openkbs.com/publicAPIRequest', data)
                        .then(response => {
                            Swal.fire('Thank you!', 'Your feedback has been submitted.', 'success');
                        })
                        .catch(error => {
                            Swal.fire('Error', 'Failed to submit feedback. Please try again.', 'error');
                        });
                });
            </script>
        `,
    });

    // Appointment Booking Form Block
    bm.add('appointment-form', {
        label: 'Appointment Booking Form',
        category,
        media: `
            <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5a2.006 2.006 0 0 0-2 2v14a2.006 2.006 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2V5a2.006 2.006 0 0 0-2-2zm0 16H5V8h14z"/>
            </svg>
        `,
        content: `
            ${commonStyles}
            <div class="kb-block appointment-form">
                <h2>Book an Appointment</h2>
                <form id="appointment-form">
                    <input type="text" id="name" name="name" placeholder="Your Name" required>
                    <input type="email" id="email" name="email" placeholder="Your Email" required>
                    <input type="datetime-local" id="datetime" name="datetime" required>
                    <button type="submit">Book Now</button>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.getElementById('appointment-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const data = {
                        action: "createItem",
                        kbId: "${KB.kbId}",
                        itemType: "appointmentForm",
                        attributes: [
                            { attrType: "keyword1", attrName: "name", encrypted: true },
                            { attrType: "keyword2", attrName: "email", encrypted: true },
                            { attrType: "date1", attrName: "datetime", encrypted: false }
                        ],
                        item: {
                            name: formData.get('name'),
                            email: formData.get('email'),
                            datetime: formData.get('datetime')
                        }
                    };
                    ${loadingJS}
                    axios.post('https://chat.openkbs.com/publicAPIRequest', data)
                        .then(response => {
                            Swal.fire('Success', 'Your appointment has been booked!', 'success');
                        })
                        .catch(error => {
                            Swal.fire('Error', 'Failed to book appointment. Please try again.', 'error');
                        });
                });
            </script>
        `,
    });

    // Survey Form Block
    bm.add('survey-form', {
        label: 'Survey Form',
        category,
        media: `
            <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="currentColor" d="M17 2H7a2.002 2.002 0 0 0-2 2v16l7-3 7 3V4a2.002 2.002 0 0 0-2-2z"/>
            </svg>
        `,
        content: `
            ${commonStyles}
            <div class="kb-block survey-form">
                <h2>Customer Satisfaction Survey</h2>
                <form id="survey-form">
                    <input type="text" id="name" name="name" placeholder="Your Name" required>
                    <select id="satisfaction" name="satisfaction" required>
                        <option value="">How satisfied are you with our service?</option>
                        <option value="Very Satisfied">Very Satisfied</option>
                        <option value="Satisfied">Satisfied</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Dissatisfied">Dissatisfied</option>
                        <option value="Very Dissatisfied">Very Dissatisfied</option>
                    </select>
                    <textarea id="comments" name="comments" placeholder="Additional Comments" rows="4"></textarea>
                    <button type="submit">Submit Survey</button>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.getElementById('survey-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const data = {
                        action: "createItem",
                        kbId: "${KB.kbId}",
                        itemType: "surveyForm",
                        attributes: [
                            { attrType: "keyword1", attrName: "name", encrypted: true },
                            { attrType: "keyword2", attrName: "satisfaction", encrypted: false },
                            { attrType: "text1", attrName: "comments", encrypted: true }
                        ],
                        item: {
                            name: formData.get('name'),
                            satisfaction: formData.get('satisfaction'),
                            comments: formData.get('comments')
                        }
                    };
                    ${loadingJS}
                    axios.post('https://chat.openkbs.com/publicAPIRequest', data)
                        .then(response => {
                            Swal.fire('Thank you!', 'Your feedback has been recorded.', 'success');
                        })
                        .catch(error => {
                            Swal.fire('Error', 'Failed to submit survey. Please try again.', 'error');
                        });
                });
            </script>
        `,
    });

    // Registration Form Block
    bm.add('registration-form', {
        label: 'Registration Form',
        category,
        media: `
            <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="currentColor" d="M12 12c2.206 0 4-1.794 4-4s-1.794-4-4-4S8 5.794 8 8s1.794 4 4 4zm0 2c-2.674 0-8 1.336-8 4v2h16v-2c0-2.664-5.326-4-8-4z"/>
            </svg>
        `,
        content: `
            ${commonStyles}
            <div class="kb-block registration-form">
                <h2>Register</h2>
                <form id="registration-form">
                    <input type="text" id="username" name="username" placeholder="Username" required>
                    <input type="email" id="email" name="email" placeholder="Email" required>
                    <input type="password" id="password" name="password" placeholder="Password" required>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                document.getElementById('registration-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const data = {
                        action: "createItem",
                        kbId: "${KB.kbId}",
                        itemType: "registrationForm",
                        attributes: [
                            { attrType: "keyword1", attrName: "username", encrypted: true },
                            { attrType: "keyword2", attrName: "email", encrypted: true },
                            { attrType: "text1", attrName: "password", encrypted: true }
                        ],
                        item: {
                            username: formData.get('username'),
                            email: formData.get('email'),
                            password: formData.get('password')
                        }
                    };
                    ${loadingJS}
                    axios.post('https://chat.openkbs.com/publicAPIRequest', data)
                        .then(response => {
                            Swal.fire('Welcome!', 'You have registered successfully.', 'success');
                        })
                        .catch(error => {
                            Swal.fire('Error', 'Registration failed. Please try again.', 'error');
                        });
                });
            </script>
        `,
    });
}

const commonStyles = `
        <style>
            .kb-block {
                background-color: #f8f9fa;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                padding: 30px;
                max-width: 500px;
                margin: 20px auto;
                font-family: 'Arial', sans-serif;
            }
            .kb-block h2 {
                color: #2c3e50;
                font-size: 24px;
                margin-bottom: 20px;
                text-align: center;
            }
            .kb-block input[type="text"],
            .kb-block input[type="email"],
            .kb-block input[type="password"],
            .kb-block input[type="datetime-local"],
            .kb-block textarea,
            .kb-block select {
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                border: 1px solid #bdc3c7;
                border-radius: 5px;
                font-size: 16px;
                transition: border-color 0.3s ease;
            }
            .kb-block input:focus,
            .kb-block textarea:focus,
            .kb-block select:focus {
                border-color: #3498db;
                outline: none;
            }
            .kb-block button {
                width: 100%;
                padding: 12px;
                background-color: #3498db;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                font-size: 18px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            .kb-block button:hover {
                background-color: #2980b9;
            }
            .kb-block .bullet-list {
                list-style-type: disc;
                padding-left: 20px;
            }
            .kb-block .bullet-list li {
                margin-bottom: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

const loadingJS = `Swal.fire({ title: 'Loading...', didOpen: () => Swal.showLoading(), allowOutsideClick: false, showConfirmButton: false });`;