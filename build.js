import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Function to get template based on file type
function getTemplate(type, title, content) {
  const baseTemplate = {
    blog: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Desbloquea Tu Mapa - Blog</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="load-header.js"></script>
</head>
<body>
    <div id="header-placeholder"></div>
    <div class="content-section">
        ${content}
    </div>
    <footer>
        <p>&copy; 2024 Desbloquea Tu Mapa. Creado con presencia por Juanes Necoechea.</p>
    </footer>
</body>
</html>`,
    prompt: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Desbloquea Tu Mapa - Prompts</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <style>
        .prompt-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        .prompt-content {
            background: white;
            border: 1px solid var(--border-color);
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .prompt-meta {
            background: var(--background-color);
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            color: var(--accent-color);
        }
        .copy-prompt-btn {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
            transition: background-color 0.2s ease;
        }
        .copy-prompt-btn:hover {
            background: var(--primary-color);
        }
        .copy-prompt-btn.copied {
            background: #4CAF50;
        }
        h1 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        h2, h3 {
            color: var(--primary-color);
            margin-top: 2rem;
        }
        blockquote {
            border-left: 4px solid var(--accent-color);
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: var(--text-color);
            opacity: 0.9;
        }
        code {
            background: var(--background-color);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.9rem;
        }
        pre {
            background: var(--background-color);
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <div class="nav-content">
            <a href="../index.html" class="logo">Desbloquea Tu Mapa</a>
            <nav>
                <ul class="nav-links">
                    <li><a href="../index.html">Inicio</a></li>
                    <li><a href="../prompts.html">Prompts</a></li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="prompt-container">
        <div class="prompt-content">
            <div class="prompt-meta">
                <i class="fas fa-lightbulb"></i> Prompt de Reflexión
            </div>
            ${content}
            <button class="copy-prompt-btn" onclick="copyPromptContent()">
                <i class="fas fa-copy"></i> Copiar Prompt
            </button>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
            <a href="../prompts.html" class="button" style="text-decoration: none;">
                <i class="fas fa-arrow-left"></i> Volver a Prompts
            </a>
        </div>
    </div>
    <footer>
        <p>&copy; 2024 Desbloquea Tu Mapa. Creado con presencia por Juanes Necoechea.</p>
    </footer>
    <script>
        function copyPromptContent() {
            const content = document.querySelector('.prompt-content').innerText;
            navigator.clipboard.writeText(content).then(() => {
                const btn = document.querySelector('.copy-prompt-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            });
        }
    </script>
</body>
</html>`
  };
  
  return baseTemplate[type] || baseTemplate.blog;
}

// Function to extract title from markdown content
function extractTitle(markdown) {
  const lines = markdown.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.replace('# ', '').trim();
    }
  }
  return 'Sin título';
}

// Function to process a markdown file
function processMarkdownFile(filePath, type = 'blog') {
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const html = convertMarkdownToHtml(markdown);
  const title = extractTitle(markdown);
  
  // Create HTML file name in appropriate directory
  const fileName = path.basename(filePath).replace('.md', '.html');
  let htmlFilePath;
  
  if (type === 'prompt') {
    htmlFilePath = path.join(__dirname, 'website', 'prompts', fileName);
  } else {
    htmlFilePath = path.join(__dirname, 'website', fileName);
  }
  
  // Get appropriate template
  const fullHtml = getTemplate(type, title, html);

  // Write the HTML file
  fs.writeFileSync(htmlFilePath, fullHtml);
  console.log(`Processed ${filePath} -> ${htmlFilePath} (${type})`);
}

// Function to process files in a directory with specific type
function processDirectory(dirPath, type) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        processMarkdownFile(filePath, type);
      }
    });
  }
}

// Find and process all markdown files
function processAllMarkdownFiles() {
  // Process blog content
  const contentDir = path.join(__dirname, 'website', 'content');
  processDirectory(contentDir, 'blog');
  
  // Process prompts from prompts_md folder
  const promptsMdDir = path.join(__dirname, 'website', 'prompts_md');
  processDirectory(promptsMdDir, 'prompt');
}

// Function to extract title and description from markdown content
function extractPromptMetadata(markdown) {
  const lines = markdown.split('\n');
  let title = 'Sin título';
  let description = '';
  
  // Extract title (first h1)
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
      // Remove markdown formatting from title
      title = title.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
      title = title.replace(/\*(.*?)\*/g, '$1'); // Remove italic
      title = title.replace(/`(.*?)`/g, '$1'); // Remove code
      break;
    }
  }
  
  // Extract description (first paragraph after title)
  let foundTitle = false;
  for (const line of lines) {
    if (line.startsWith('# ')) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim() && !line.startsWith('#') && !line.startsWith('*')) {
      description = line.trim();
      // Remove markdown formatting
      description = description.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
      description = description.replace(/\*(.*?)\*/g, '$1'); // Remove italic
      description = description.replace(/`(.*?)`/g, '$1'); // Remove code
      // Limit description length
      if (description.length > 150) {
        description = description.substring(0, 150) + '...';
      }
      break;
    }
  }
  
  return { title, description };
}

// Function to update prompts.html with current prompts
function updatePromptsPage() {
  const promptsMdDir = path.join(__dirname, 'website', 'prompts_md');
  const promptsHtmlPath = path.join(__dirname, 'website', 'prompts.html');
  
  if (!fs.existsSync(promptsMdDir)) {
    return;
  }
  
  const files = fs.readdirSync(promptsMdDir);
  const promptsData = [];
  
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(promptsMdDir, file);
      const markdown = fs.readFileSync(filePath, 'utf-8');
      const { title, description } = extractPromptMetadata(markdown);
      const htmlFilename = file.replace('.md', '.html');
      
      // Assign icons based on content or filename
      let icon = 'fas fa-lightbulb';
      if (file.includes('causa-raiz') || title.toLowerCase().includes('análisis')) {
        icon = 'fas fa-search';
      } else if (file.includes('identidad') || title.toLowerCase().includes('identidad')) {
        icon = 'fas fa-user';
      } else if (file.includes('ikigai') || title.toLowerCase().includes('ikigai')) {
        icon = 'fas fa-compass';
      } else if (title.toLowerCase().includes('reflexión')) {
        icon = 'fas fa-thought-bubble';
      }
      
      promptsData.push({
        filename: htmlFilename,
        title,
        description,
        icon
      });
    }
  });
  
  // Read current prompts.html
  let promptsHtml = fs.readFileSync(promptsHtmlPath, 'utf-8');
  
  // Replace the availablePrompts array
  const promptsArray = JSON.stringify(promptsData, null, 12);
  const regex = /const availablePrompts = \[[\s\S]*?\];/;
  const replacement = `const availablePrompts = ${promptsArray};`;
  
  promptsHtml = promptsHtml.replace(regex, replacement);
  
  // Write back to file
  fs.writeFileSync(promptsHtmlPath, promptsHtml);
  console.log('Updated prompts.html with current prompts list');
}

// Run the build process
console.log('Starting build process...');
processAllMarkdownFiles();
updatePromptsPage();
console.log('Build process completed.'); 