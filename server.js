const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

// Enable CORS for frontend-backend communication
app.use(cors({
    origin: '*' // Allow requests from any origin (replace with your frontend URL in production)
}));
app.use(express.json());

// Endpoint to compile C code to assembly
app.post('/compile', (req, res) => {
    const cCode = req.body.code;

    // Validate the input
    if (!cCode || typeof cCode !== 'string') {
        return res.status(400).json({ error: 'Invalid C code provided.' });
    }

    // Save the C code to a temporary file
    fs.writeFileSync('temp.c', cCode);

    // Compile the C code to assembly using GCC
    exec('gcc -S -o temp.s temp.c', (error, stdout, stderr) => {
        if (error) {
            // Clean up temporary files
            fs.unlinkSync('temp.c');
            return res.status(500).json({ error: stderr });
        }

        // Read the generated assembly file
        const assemblyCode = fs.readFileSync('temp.s', 'utf-8');

        // Clean up temporary files
        fs.unlinkSync('temp.c');
        fs.unlinkSync('temp.s');

        // Send the assembly code back to the frontend
        res.json({ assembly: assemblyCode });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
