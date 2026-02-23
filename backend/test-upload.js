const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
    try {
        const form = new FormData();
        form.append('jdText', 'Senior Frontend Developer');
        // Create a dummy text file
        fs.writeFileSync('dummy.txt', 'Rashmi Varma\nSenior Frontend Developer with 6 years experience in React, AWS, GCP.');
        form.append('resumes', fs.createReadStream('dummy.txt'), { filename: 'dummy.txt' });

        console.log("Sending request...");
        const res = await axios.post('http://localhost:3001/api/upload-batch', form, {
            headers: form.getHeaders()
        });
        console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        if (err.response) {
            console.error("ERROR REPONSE:", err.response.data);
        } else {
            console.error("ERROR:", err.message);
        }
    }
}
test();
