const http = require('http');

const data = JSON.stringify({
  post: {
    id: "test_email_123",
    title: "Test Article Email Distribution",
    subheadline: "Verifying targeted email and newsletter broadcast functionality.",
    category: "Business",
    status: "Published",
    targetedEmails: ["testclient@company.com", "vip@partner.com"],
    broadcastToSubscribers: true,
    author: "Test Author",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?fm=webp&fit=crop&w=800&q=80"
  }
});

const req = http.request('http://localhost:5000/api/posts/notify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', (e) => console.error('Error:', e));
req.write(data);
req.end();
