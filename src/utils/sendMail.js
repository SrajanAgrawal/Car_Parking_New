import nodemailer from 'nodemailer';

const sendMail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.Google_Email_Password,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject,
    html,
  };

  // send mail
  try {
      const result =  await transporter.sendMail(mailOptions);
      console.log("Email sent: " + result.response);
    
  } catch (error) {
        
        console.log(`Error in sending mail: ${error}`)
        process.exit(1)
  }

}

export {sendMail}