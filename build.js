const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Clean and recreate public directory
fs.removeSync('public');
fs.ensureDirSync('public');

// Copy assets directory if it exists
if (fs.existsSync('assets')) {
    fs.copySync('assets', 'public/assets');
}

// Read the template
const template = fs.readFileSync('template.html', 'utf-8');

// Function to process markdown files
async function processMarkdown(filePath, outputPath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    
    // Parse frontmatter
    const frontmatterData = {};
    if (frontmatter) {
        frontmatter.split('\n').forEach(line => {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key && value) {
                frontmatterData[key] = value;
            }
        });
    }
    
    // Remove frontmatter from content
    let cleanContent = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    
    // Get the title from frontmatter or first h1
    const title = frontmatterData.title || (() => {
        const titleMatch = cleanContent.match(/^#\s+(.+)$/m);
        return titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
    })();
    
    // Get subtitle if it exists
    const subtitle = frontmatterData.subtitle || '';
    
    const html = marked(cleanContent);
    
    // Check if this is the home page
    const isHomePage = filePath.endsWith('index.md') || filePath.endsWith('home.md');
    
    // Replace template variables
    let finalHtml = template
        .replace(/\{\{title\}\}/g, title)
        .replace(/\{\{content\}\}/g, html)
        .replace(/\{\{isHomePage \? '' : 'hidden'\}\}/g, isHomePage ? '' : 'hidden')
        .replace(/\{\{subtitle \? '' : 'hidden'\}\}/g, subtitle ? '' : 'hidden')
        .replace(/\{\{subtitle\}\}/g, subtitle)
        .replace(/\{\{year\}\}/g, new Date().getFullYear());
    
    // Ensure the output directory exists
    fs.ensureDirSync(path.dirname(outputPath));
    
    // Write the HTML file
    fs.writeFileSync(outputPath, finalHtml);
}

// Function to copy HTML files directly
async function copyHtmlFile(filePath, outputPath) {
    // Ensure the output directory exists
    fs.ensureDirSync(path.dirname(outputPath));
    
    // Copy the file directly
    fs.copyFileSync(filePath, outputPath);
}

// Process all markdown files
async function build() {
    // Process pages
    const pages = fs.readdirSync('content/pages');
    for (const page of pages) {
        const inputPath = path.join('content/pages', page);
        const outputPath = path.join('public', page);
        
        if (page.endsWith('.md')) {
            await processMarkdown(inputPath, outputPath.replace('.md', '.html'));
        } else if (page.endsWith('.html')) {
            await copyHtmlFile(inputPath, outputPath);
        }
    }
    
    // Process blog posts
    if (fs.existsSync('content/blog')) {
        const blogPosts = fs.readdirSync('content/blog');
        for (const post of blogPosts) {
            if (post.endsWith('.md')) {
                const inputPath = path.join('content/blog', post);
                const outputPath = path.join('public', 'blog', post.replace('.md', '.html'));
                await processMarkdown(inputPath, outputPath);
            }
        }
    }
    
    console.log('Build complete!');
}

build().catch(console.error); 