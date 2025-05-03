import axios from 'axios';

export const sendSms = async (to: string, otpCode: string) => {
  const afroToken = process.env.AFRO_TOKEN;
  const from = process.env.AFRO_IDENTIFIER;
  const sender = process.env.AFRO_SENDER_NAME;

  const message = `🔒 SafeSpace: Your OTP is ${otpCode}. Use it to proceed. #${otpCode}`;

  try {
    const response = await axios.post(
      'https://api.afromessage.com/api/send',
      {
        from,
        sender,
        to,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${afroToken}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );

    return {
      status: response.status,
      message:
        response.status === 200 ? 'SMS sent successfully' : 'Error sending SMS',
      response_message: response.statusText,
    };
  } catch (error) {
    return {
      message: 'Error sending SMS',
      response_message: error.message,
      status: 500,
    };
  }
};
