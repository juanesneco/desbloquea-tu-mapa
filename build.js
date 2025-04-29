const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true
});

// Function to convert markdown to HTML
function convertMarkdownToHtml(markdown) {
  return marked.parse(markdown);
}

// Function to process a markdown file
function processMarkdownFile(filePath) {
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const html = convertMarkdownToHtml(markdown);
  
  // Create HTML file name
  const htmlFilePath = filePath.replace('.md', '.html');
  
  // Basic HTML template
  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desbloquea Tu Mapa - Blog</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap" rel="stylesheet">
    <script src="load-header.js"></script>
</head>
<body>
    <div id="header-placeholder"></div>
    <div class="content-section">
        ${html}
    </div>
    <footer>
        <p>&copy; 2024 Desbloquea Tu Mapa. Creado con presencia por Juanes Necoechea.</p>
    </footer>
</body>
</html>`;

  // Write the HTML file
  fs.writeFileSync(htmlFilePath, fullHtml);
  console.log(`Processed ${filePath} -> ${htmlFilePath}`);
}

// Find and process all markdown files
function processAllMarkdownFiles() {
  const contentDir = path.join(__dirname, 'content');
  
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        processMarkdownFile(filePath);
      }
    });
  }
}

// Run the build process
console.log('Starting build process...');
processAllMarkdownFiles();
console.log('Build process completed.'); 