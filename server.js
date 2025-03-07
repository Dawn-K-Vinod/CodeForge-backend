const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Railway or default to 3000

// Allow requests from the frontend domain
const allowedOrigins = [
    'https://dawn-k-vinod.github.io/CodeForge-frontend/', // Allow requests from GitHub Pages
    'http://localhost:3000' // Allow requests from local development
];

app.use(cors({ 
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow cookies and credentials (if needed)
}));

// Parse JSON request bodies
app.use(express.json());

// Endpoint to compile C code to assembly
app.post('/compile', (req, res) => {
    const cCode = req.body.code;

    // Save the C code to a temporary file
    fs.writeFileSync('temp.c', cCode);

    // Compile the C code to assembly using GCC
    exec('gcc -S -o temp.s temp.c', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }

        // Read the generated assembly file
        const assemblyCode = fs.readFileSync('temp.s', 'utf-8');

        // Send the assembly code back to the frontend
        res.json({ assembly: assemblyCode });
    });
});

// Optional: Test endpoint to verify GCC installation
app.get('/test-gcc', (req, res) => {
    exec('gcc --version', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'GCC not installed' });
        }
        res.json({ gccVersion: stdout });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
