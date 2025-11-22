const http = require('http');

const testPort = (port) => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  });

  server.listen(port, () => {
    console.log(`✅ Test server running on port ${port}`);
    console.log(`🌐 Visit: http://localhost:${port}`);
    console.log('Press Ctrl+C to stop');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`❌ Port ${port} is busy`);
    } else {
      console.log(`❌ Error: ${err.message}`);
    }
  });
};

// Test multiple ports
const ports = [5000, 5001, 5002, 5003];
let currentPortIndex = 0;

const tryNextPort = () => {
  if (currentPortIndex < ports.length) {
    const port = ports[currentPortIndex];
    console.log(`\nTrying port ${port}...`);
    testPort(port);
    currentPortIndex++;
    
    // Try next port after 2 seconds if current fails
    setTimeout(tryNextPort, 2000);
  }
};

tryNextPort();