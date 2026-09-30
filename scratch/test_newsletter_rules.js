async function testRules() {
  const testEmail = 'worldnews@timeschicago.com';

  console.log('1. Subscribing email:', testEmail, 'to category: WORLD...');
  const subRes = await fetch('http://localhost:5000/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      newsletters: ['WORLD']
    })
  });
  const subData = await subRes.json();
  console.log('Subscription response:', subData);

  console.log('\n2. Publishing a new article in category WORLD...');
  const postRes = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Nigeria’s Christians Are Being Killed And the World Is Getting Used to It",
      category: "WORLD",
      subheadline: "Nigeria is experiencing one of the world's most serious crises of violence against Christians. In September, gunmen attacked Christian communities in Plateau...",
      author: "Samuel Mauricio Patiño Fuentes",
      thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?fm=webp&fit=crop&w=800&q=80",
      content: "<p>Article content test...</p>",
      status: "Published",
      broadcastToSubscribers: true,
      publishedAt: new Date().toISOString()
    })
  });

  const postData = await postRes.json();
  console.log('Article creation response:', postData.success ? '✅ Article Published & Broadcasted!' : postData);
}

testRules();
