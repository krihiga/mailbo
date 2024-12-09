document.getElementById('emailForm').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Form submission triggered');

    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;

    // Basic field validation
    if (!email || !subject) {
        alert('Email and Subject are required fields.');
        return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);

    console.log('Sending FormData:', formData);

    fetch('https://mailbo.vercel.app/api/sendMail', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            console.log('API Response Status:', response.status);
            if (!response.ok) {
                return response.json().then(data => {
                    console.error('Backend Error:', data);
                    throw new Error(data.error || 'Failed to send email');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response Data:', data);
            alert(data.message || 'Email sent successfully!');
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert('Error: ' + error.message);
        });
});
