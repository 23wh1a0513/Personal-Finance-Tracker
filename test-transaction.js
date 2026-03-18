async function testTransaction() {
  try {
    // Register a test user first
    console.log('Registering test user...');
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User ' + Date.now(),
        email: 'test' + Date.now() + '@test.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerRes.json();
    const token = registerData.token;
    console.log('✓ Token received:', token);

    // Create a transaction
    console.log('\nCreating transaction...');
    const createRes = await fetch('http://localhost:5000/api/finances', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'income',
        category: 'salary',
        amount: 50000,
        transactionDate: '2026-03-17',
        recurring: false,
        description: 'Test salary'
      })
    });

    const createData = await createRes.json();
    
    if (createRes.ok) {
      console.log('✓ Transaction created successfully!');
      console.log('Response:', JSON.stringify(createData, null, 2));
    } else {
      console.error('✗ Failed to create transaction');
      console.error('Status:', createRes.status);
      console.error('Error:', createData);
    }

  } catch (error) {
    console.error('✗ Error occurred:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  }
}

testTransaction();
