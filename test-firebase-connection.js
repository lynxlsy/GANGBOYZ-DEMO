// test-firebase-connection.js
const { db, auth, storage } = require('./lib/firebase-config');
const { collection, getDocs } = require('firebase/firestore');
const { ref, listAll } = require('firebase/storage');

async function testFirebaseConnection() {
  console.log('Testing Firebase connection...');
  
  try {
    // Test Firestore connection
    console.log('Testing Firestore...');
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log(`✅ Firestore connected successfully. Found ${snapshot.size} documents in test collection.`);
  } catch (error) {
    console.error('❌ Firestore connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
  
  try {
    // Test Storage connection
    console.log('Testing Storage...');
    const storageRef = ref(storage, '/');
    const listResult = await listAll(storageRef);
    console.log(`✅ Storage connected successfully. Found ${listResult.prefixes.length} folders and ${listResult.items.length} files.`);
  } catch (error) {
    console.error('❌ Storage connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
  
  try {
    // Test Auth connection
    console.log('Testing Auth...');
    const currentUser = auth.currentUser;
    console.log(`✅ Auth connected successfully. Current user: ${currentUser ? currentUser.email : 'Not signed in'}`);
  } catch (error) {
    console.error('❌ Auth connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
  
  console.log('Firebase connection test completed.');
}

// Run the test
testFirebaseConnection().catch(console.error);