const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Ensure blog directory exists
const BLOG_DIR = path.join(__dirname, 'blog');
fs.ensureDirSync(BLOG_DIR);

// API endpoint to create a new post
app.post('/api/create-post', async (req, res) => {
    try {
        console.log('Received request to create post:', req.body);
        
        const { title, content, date } = req.body;
        
        if (!title || !content) {
            console.error('Missing required fields');
            return res.status(400).json({ error: 'Title and content are required' });
        }
        
        // Create markdown content
        const markdown = `# ${title}\n\ndate: ${date}\n\n${content}`;
        
        // Generate filename (convert title to URL-friendly format)
        const filename = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '.md';
        
        const filePath = path.join(BLOG_DIR, filename);
        console.log('Writing to file:', filePath);
        
        // Write markdown file
        await fs.writeFile(filePath, markdown);
        console.log('File written successfully');
        
        // Run build script
        exec('node build.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running build script: ${error}`);
                console.error('Build script stderr:', stderr);
                return res.status(500).json({ error: 'Failed to build blog', details: stderr });
            }
            console.log('Build script stdout:', stdout);
            res.json({ success: true, filename });
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post', details: error.message });
    }
});

// Handle OPTIONS requests
app.options('/api/create-post', (req, res) => {
    res.status(200).end();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Blog directory: ${BLOG_DIR}`);
}); 