const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = 3000;

// Enable CORS for frontend-backend communication
app.use(cors());
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

// Start the server
app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});