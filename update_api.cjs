const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (content.includes("'/api/")) { content = content.replace(/'\/api\//g, "'/api/ff/"); changed = true; }
      if (content.includes('"/api/')) { content = content.replace(/"\/api\//g, '"/api/ff/'); changed = true; }
      if (content.includes("`/api/")) { content = content.replace(/`\/api\//g, "`/api/ff/"); changed = true; }
      
      // Update localhost port in api.js
      if (fullPath.endsWith('api.js')) {
         content = content.replace('http://localhost:4400', 'http://localhost:4000');
         changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log("Updated frontend API urls to /api/ff/ and port to 4000");
