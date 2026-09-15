// Placeholder for SMS sending logic using Twilio
// Actual implementation requires environment variables and Twilio setup
const sendSms = async (to, message) => {
  // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  // await client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_FROM,
  //   to: to
  // });
  console.log(`SMS sent to ${to}: ${message}`);
};

export default sendSms;