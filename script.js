document.getElementById('emailForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page

    // Gather form inputs
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const businessName = document.getElementById('businessName').value;
    const style = document.getElementById('style').value;
    const colors = document.getElementById('colors').value;
    const message = document.getElementById('message').value;
    const fileInput = document.getElementById('file');
    const files = fileInput.files;

    // Validate required fields
    if (!email || !subject || !name || !message) {
        alert('Please fill in all required fields: Email, Subject, Name, and Message.');
        return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('businessName', businessName);
    formData.append('style', style);
    formData.append('colors', colors);
    formData.append('message', message);
    formData.append('userEmail', userEmail); 

    // Append each selected file
    for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i]);
    }

    // Send the form data to the backend API
    fetch('https://mailbo.vercel.app/api/sendMail', { // Replace with your deployed Vercel URL
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || 'Email sent successfully!');
    })
    .catch(error => {
        console.error('Error sending email:', error);
        alert('Error sending email: ' + error.message);
    });
});
