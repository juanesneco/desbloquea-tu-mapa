const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Configure marked for security
marked.setOptions({
  headerIds: false,
  mangle: false
});

// Directories
const BLOG_DIR = path.join(__dirname, 'blog');
const PAGES_DIR = path.join(__dirname, 'pages');
const COMPONENTS_DIR = path.join(__dirname, 'components');

// Ensure directories exist
fs.ensureDirSync(BLOG_DIR);
fs.ensureDirSync(PAGES_DIR);

// Base HTML template for blog posts
const blogTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} | Desbloquea Tu Mapa</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="load-header.js"></script>
    <style>
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 var(--spacing-unit);
        }

        .content {
            margin: calc(var(--spacing-unit) * 2) 0;
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: calc(var(--spacing-unit) * 1.5);
            font-weight: 400;
            letter-spacing: -0.03em;
            line-height: 1.2;
        }

        h2 {
            font-size: 1.75rem;
            margin: calc(var(--spacing-unit) * 2) 0 var(--spacing-unit);
            font-weight: 400;
            letter-spacing: -0.02em;
        }

        p {
            margin-bottom: var(--spacing-unit);
            font-size: 1.125rem;
            opacity: 0.9;
        }

        .blog-content {
            background: white;
            border: 1px solid var(--border-color);
            padding: calc(var(--spacing-unit) * 1.5);
            border-radius: 4px;
        }

        .blog-meta {
            color: var(--accent-color);
            font-size: 0.875rem;
            margin-bottom: var(--spacing-unit);
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div id="header-placeholder"></div>
    <div class="container">
        <main class="content">
            <div class="blog-content">
                {{content}}
            </div>
        </main>
        
        <footer>
            <p>&copy; 2024 Desbloquea Tu Mapa. Creado con presencia por Juanes Necoechea.</p>
        </footer>
    </div>
</body>
</html>`;

// Process all markdown files in the blog directory
async function buildBlog() {
  try {
    // Get all markdown files
    const files = await fs.readdir(BLOG_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    for (const file of markdownFiles) {
      // Read markdown content
      const markdownPath = path.join(BLOG_DIR, file);
      const markdown = await fs.readFile(markdownPath, 'utf8');

      // Extract title from first line (assuming format: # Title)
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

      // Extract date from frontmatter if present
      const dateMatch = markdown.match(/date:\s*([^\n]+)/);
      const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Convert markdown to HTML
      const content = marked(markdown);

      // Generate HTML filename
      const htmlFilename = file.replace('.md', '.html');
      const htmlPath = path.join(PAGES_DIR, htmlFilename);

      // Replace placeholders in template
      const html = blogTemplate
        .replace('{{title}}', title)
        .replace('{{content}}', content);

      // Write HTML file
      await fs.writeFile(htmlPath, html);
      console.log(`Generated: ${htmlPath}`);
    }

    console.log('Blog build completed successfully!');
  } catch (error) {
    console.error('Error building blog:', error);
    process.exit(1);
  }
}

// Run the build
buildBlog(); 