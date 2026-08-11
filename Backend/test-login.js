const http = require('http');

async function testLogin(fullName, email, password, confirmPassword, expectedRole, shouldPass = true) {
  if (password !== confirmPassword) {
    console.log(`❌ TEST FAILED (Password mismatch): ${email}`);
    return false;
  }

  const postData = JSON.stringify({ fullName, email, password });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (shouldPass) {
            if (json.success && json.user.role === expectedRole) {
              console.log(`✅ TEST PASSED: [${expectedRole.toUpperCase()}] Name: "${fullName}", Email: "${email}" -> Redirects to /${expectedRole}-dashboard`);
              resolve(true);
            } else {
              console.log(`❌ TEST FAILED for ${email}:`, json);
              resolve(false);
            }
          } else {
            if (!json.success) {
              console.log(`✅ TEST PASSED (Negative Case): Invalid Name/Creds correctly rejected with: "${json.message}"`);
              resolve(true);
            } else {
              console.log(`❌ TEST FAILED: Expected failure but got success for ${email}`);
              resolve(false);
            }
          }
        } catch (e) {
          console.log(`❌ FAILED parsing response for ${email}:`, data);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ HTTP Request Error for ${email}:`, e.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function runAllTests() {
  console.log('===================================================');
  console.log('🧪 Testing Full Name, Email & Password Login System');
  console.log('===================================================\n');

  // 1. Admin test case
  await testLogin('Admin', 'admin@gmail.com', 'admin123', 'admin123', 'admin');

  // 2. Writer test case
  await testLogin('Writer', 'writer@gmail.com', 'Writer123', 'Writer123', 'writer');

  // 3. Reader test case
  await testLogin('Reader', 'reader@gmail.com', 'Reader123', 'Reader123', 'reader');

  // 4. Invalid name test case (Wrong name for Admin)
  await testLogin('WrongName', 'admin@gmail.com', 'admin123', 'admin123', 'admin', false);

  console.log('\n===================================================');
}

runAllTests();
