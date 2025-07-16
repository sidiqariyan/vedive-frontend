const EMAIL_API_ENDPOINT = 'http://ec2-51-20-248-157.eu-north-1.compute.amazonaws.com:8000';

export const sendEmailToRecipient = async (recipient, subject, message) => {
  try {
    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipient,
        subject: subject,
        message: message
      })
    });

    const responseData = await response.json();
    
    // Return success based on the API response
    return responseData.success;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};