export const sendEmailStub = ({
  to,
  subject,
  message
}: {
  to: string;
  subject: string;
  message: string;
}) => {
  console.log('📧 Simulated Email Sent');
  console.log('---------------------------');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('Message:');
  console.log(message);
  console.log('---------------------------');
};
