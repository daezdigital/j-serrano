const fs = require('fs');
const files = ['index.html', 'services.html', 'portfolio.html', 'about.html', 'contact.html', 'reviews.html'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/href="index\.html"/g, 'href="/"');
    content = content.replace(/href="services\.html/g, 'href="/services');
    content = content.replace(/href="portfolio\.html"/g, 'href="/portfolio"');
    content = content.replace(/href="about\.html"/g, 'href="/about"');
    content = content.replace(/href="contact\.html"/g, 'href="/contact"');
    content = content.replace(/href="reviews\.html"/g, 'href="/reviews"');
    fs.writeFileSync(file, content);
    console.log('Cleaned URLs in ' + file);
  }
});
