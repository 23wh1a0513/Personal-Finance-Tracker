async function comprehensiveTest() {
  console.log('=== COMPREHENSIVE TEST SUITE ===\n');
  
  try {
    // 1. Test health endpoint
    console.log('1. Testing HEALTH endpoint...');
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    console.log(healthRes.ok ? '✓ Health OK' : '✗ Health FAILED');
    
    // 2. Register user
    console.log('\n2. Registering TEST user...');
    const email = 'test' + Date.now() + '@test.com';
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123'
      })
    });
    
    const registerData = await registerRes.json();
    if (!registerRes.ok) {
      console.log('✗ Registration FAILED:', registerData);
      return;
    }
    
    const token = registerData.token;
    console.log('✓ User registered, token:', token.slice(0, 20) + '...');
    
    // 3. Test NORMAL POST endpoint (simple income transaction)
    console.log('\n3. Testing POST /finances endpoint...');
    const payload = {
      type: 'income',
      category: 'salary',
      amount: 75000,
      transactionDate: '2026-03-17',
      recurring: false,
      description: 'Monthly salary'
    };
    
    console.log('  Payload:', JSON.stringify(payload));
    
    const createRes = await fetch('http://localhost:5000/api/finances', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('  Response status:', createRes.status);
    
    let createData;
    if (createRes.ok || createRes.status === 400) {
      createData = await createRes.json();
    } else {
      const text = await createRes.text();
      console.log('  Non-JSON response:', text.slice(0, 100));
      createData = null;
    }
    
    if (createRes.ok) {
      console.log('✓ POST /finances SUCCESS');
      console.log('  Created transaction ID:', createData._id);
    } else {
      console.log('✗ POST /finances FAILED');
      console.log('  Status:', createRes.status);
      console.log('  Error:', createData);
    }

    // 4. Test GET all finances
    console.log('\n4. Testing GET /finances endpoint...');
    const getRes = await fetch('http://localhost:5000/api/finances', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (getRes.ok) {
      const finances = await getRes.json();
      console.log(`✓ GET /finances SUCCESS - Found ${finances.length} transactions`);
      if (finances.length > 0) {
        console.log('  Sample transactions:');
        finances.slice(0, 2).forEach(f => {
          console.log(`    - ${f.title} (${f.type}): ₹${f.amount}`);
        });
      }
    } else {
      console.log('✗ GET /finances FAILED');
      console.log('  Status:', getRes.status);
    }

    // 5. Create another transaction (expense)
    console.log('\n5. Creating EXPENSE transaction...');
    const expensePayload = {
      type: 'expense',
      category: 'food',
      amount: 500,
      transactionDate: '2026-03-17',
      recurring: false,
      description: 'Lunch'
    };
    
    const expenseRes = await fetch('http://localhost:5000/api/finances', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expensePayload)
    });

    if (expenseRes.ok) {
      const expenseData = await expenseRes.json();
      console.log('✓ Expense transaction created');
      console.log('  ID:', expenseData._id);
    } else {
      const errorData = await expenseRes.json();
      console.log('✗ Expense creation failed:', errorData);
    }

    console.log('\n=== TEST COMPLETE ===');

  } catch (error) {
    console.error('✗ Fatal error:', error.message);
    console.error('Stack:', error.stack);
  }
}

comprehensiveTest();
