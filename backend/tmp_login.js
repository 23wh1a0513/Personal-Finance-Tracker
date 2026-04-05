const http = require('http');
const data = JSON.stringify({ email:'alice@gmail.com', password:'password123'});
const opts = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(opts, res => {
  let b = '';
  res.on('data', d => b += d);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(b);
  });
});
req.on('error', e => console.error(e));
req.write(data);
req.end();
