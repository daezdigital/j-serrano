const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const siteDir = 'c:/Users/Personal/OneDrive/Documentos/Antigravity Works/CVK';
const brainDir = 'C:/Users/Personal/.gemini/antigravity/brain/17b0d90b-0e15-4546-bf24-7710910a634c';

const mapping = {
    '/images/chris-profile.png': 'chris_portrait_1778012017308.png',
    '/images/hero-fallback.png': 'hero_fallback_1778012032882.png',
    '/images/services-section.png': 'services_section_1778012307271.png',
    '/images/about-section.png': 'about_section_1778012315025.png',
    '/images/reviews-section.png': 'reviews_section_1778012308575.png',
    '/images/Chris Van Kleeck.jpg': 'C:/Users/Personal/Downloads/Chris Van Kleeck.jpg'
};

const server = http.createServer((req, res) => {
    // Strip query parameters to avoid 404s on assets with version strings (e.g., style.css?v=final)
    const cleanUrl = req.url.split('?')[0];
    let url = decodeURI(cleanUrl);
    if (url === '/') url = '/index.html';

    // Check if it's an image in our mapping
    if (mapping[url]) {
        let filePath = mapping[url];
        // If it's not an absolute path, resolve it to brainDir
        if (!path.isAbsolute(filePath)) {
            filePath = path.resolve(brainDir, filePath);
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Image not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(data);
            }
        });
        return;
    }

    // Otherwise serve from site directory
    let filePath = path.join(siteDir, url);
    
    // Auto-append .html for clean URLs (mimicking Vercel's behavior)
    if (!path.extname(filePath)) {
        filePath += '.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            let contentType = 'text/html';
            if (url.endsWith('.css')) {
                contentType = 'text/css';
            } else if (url.endsWith('.js')) {
                contentType = 'application/javascript';
            } else if (url.endsWith('.png')) {
                contentType = 'image/png';
            } else if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
                contentType = 'image/jpeg';
            } else if (url.endsWith('.gif')) {
                contentType = 'image/gif';
            } else if (url.endsWith('.svg')) {
                contentType = 'image/svg+xml';
            } else if (url.endsWith('.ico')) {
                contentType = 'image/x-icon';
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log(`Development server running at http://localhost:${port}`);
});
