const fs = require('fs');

// Try to read the localStorage data
try {
  // This is a simplified check - in a real browser environment, we would access localStorage directly
  console.log('Checking for products in localStorage...');
  
  // Check if there are any test products files
  const files = fs.readdirSync('./');
  console.log('Files in directory:', files.filter(f => f.includes('product')));
  
  // Check for common localStorage files
  const localStorageFiles = files.filter(f => f.includes('local') && f.includes('storage'));
  console.log('LocalStorage related files:', localStorageFiles);
  
} catch (error) {
  console.error('Error checking products:', error.message);
}