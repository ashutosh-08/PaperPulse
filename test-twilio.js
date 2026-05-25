/**
 * Quick diagnostic to test Twilio credentials and account status.
 */
require('dotenv').config();
const twilio = require('twilio');

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

console.log('=== Twilio Diagnostic ===');
console.log(`SID: ${TWILIO_SID}`);
console.log(`Token: ${TWILIO_AUTH_TOKEN ? TWILIO_AUTH_TOKEN.substring(0, 10) + '...' : 'MISSING'}`);

if (!TWILIO_SID || !TWILIO_AUTH_TOKEN) {
  console.error('❌ Missing Twilio SID or AUTH_TOKEN in .env');
  process.exit(1);
}

try {
  const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

  // Test 1: Fetch account details
  console.log('\n[Test 1] Fetching account details...');
  client.api.accounts(TWILIO_SID).fetch()
    .then(account => {
      console.log(`✓ Account Status: ${account.status}`);
      console.log(`✓ Account Type: ${account.type}`);
      console.log(`✓ Auth Tokens: ${account.authTokens.length}`);
    })
    .catch(err => {
      console.error(`❌ Account fetch failed: ${err.message}`);
    });

  // Test 2: List messages (should show recent sends)
  setTimeout(() => {
    console.log('\n[Test 2] Listing recent messages...');
    client.messages.list({ limit: 5 })
      .then(messages => {
        console.log(`✓ Found ${messages.length} recent messages`);
        messages.forEach(msg => {
          console.log(`  - ${msg.sid}: ${msg.status} (from: ${msg.from} to: ${msg.to})`);
        });
      })
      .catch(err => {
        console.error(`❌ Message list failed: ${err.message}`);
      });
  }, 1000);

  // Test 3: Check incoming phone numbers
  setTimeout(() => {
    console.log('\n[Test 3] Checking incoming phone numbers...');
    client.incomingPhoneNumbers.list({ limit: 5 })
      .then(numbers => {
        console.log(`✓ Found ${numbers.length} incoming phone numbers`);
        numbers.forEach(num => {
          console.log(`  - ${num.phoneNumber}: ${num.friendlyName} (status: ${num.status})`);
        });
      })
      .catch(err => {
        console.error(`❌ Phone number list failed: ${err.message}`);
      });
  }, 2000);

} catch (error) {
  console.error(`❌ Failed to initialize Twilio client: ${error.message}`);
  process.exit(1);
}

// Exit after tests complete
setTimeout(() => {
  console.log('\n=== End Diagnostic ===');
  process.exit(0);
}, 3500);
