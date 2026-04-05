async function testBudgetCreation() {
  try {
    // Register a test user first
    console.log('Registering test user...');
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Budgets User ' + Date.now(),
        email: 'testbudget' + Date.now() + '@test.com',
        password: 'password123'
      })
    });

    const registerData = await registerRes.json();
    const token = registerData.token;
    console.log('✓ Token received:', token.slice(0, 20) + '...');

    // Create a budget
    console.log('\nCreating budget...');
    const budgetPayload = {
      month: 3,
      year: 2026,
      totalBudget: 50000,
      categories: [
        { category: 'food', amount: 5000 },
        { category: 'transport', amount: 2000 },
        { category: 'rent', amount: 20000 }
      ]
    };

    console.log('Budget payload:', JSON.stringify(budgetPayload, null, 2));

    const budgetRes = await fetch('http://localhost:5000/api/budgets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetPayload)
    });

    const budgetData = await budgetRes.json();
    
    if (budgetRes.ok) {
      console.log('✓ Budget created successfully!');
      console.log('Response:', JSON.stringify(budgetData, null, 2));
    } else {
      console.error('✗ Failed to create budget');
      console.error('Status:', budgetRes.status);
      console.error('Error:', budgetData);
    }

  } catch (error) {
    console.error('✗ Error occurred:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  }
}

testBudgetCreation();
