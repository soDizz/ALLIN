import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { feedback } = data;

    // 환경변수 검증
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Missing email credentials in environment variables');
      return new Response('Email configuration error', { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Gmail App Password 필요
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 연결 테스트
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // 자신에게 보내기
      subject: 'Feedback from Website',
      text: feedback,
      html: `<p><strong>Feedback:</strong></p><p>${feedback}</p>`,
    };

    const result = await transporter.sendMail(mailOptions);

    if (result.rejected && result.rejected.length > 0) {
      console.error('Email rejected:', result.rejected);
      return new Response('Failed to send feedback', { status: 500 });
    }

    return new Response('Feedback sent successfully', { status: 200 });
  } catch (error) {
    console.error('Email sending error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Failed to send feedback: ${errorMessage}`, { status: 500 });
  }
}
