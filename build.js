const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Create public directory if it doesn't exist
fs.ensureDirSync('public');

// Read the template
const template = fs.readFileSync('template.html', 'utf-8');

// Function to process markdown files
async function processMarkdown(filePath, outputPath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const html = marked(content);
    
    // Get the title from the first h1 in the markdown
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
    
    // Replace template variables
    const finalHtml = template
        .replace('{{title}}', title)
        .replace('{{content}}', html)
        .replace('{{year}}', new Date().getFullYear());
    
    // Ensure the output directory exists
    fs.ensureDirSync(path.dirname(outputPath));
    
    // Write the HTML file
    fs.writeFileSync(outputPath, finalHtml);
}

// Process all markdown files
async function build() {
    // Process pages
    const pages = fs.readdirSync('content/pages');
    for (const page of pages) {
        if (page.endsWith('.md')) {
            const inputPath = path.join('content/pages', page);
            const outputPath = path.join('public', page.replace('.md', '.html'));
            await processMarkdown(inputPath, outputPath);
        }
    }
    
    // Process blog posts
    const blogPosts = fs.readdirSync('content/blog');
    for (const post of blogPosts) {
        if (post.endsWith('.md')) {
            const inputPath = path.join('content/blog', post);
            const outputPath = path.join('public', 'blog', post.replace('.md', '.html'));
            await processMarkdown(inputPath, outputPath);
        }
    }
    
    console.log('Build complete!');
}

build().catch(console.error); 