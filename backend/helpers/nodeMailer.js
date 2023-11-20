// Nodemailer Configuration

import nodemailer from "nodemailer";

// 2. Create a nodemailer transporter with Gmail service and authentication credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sujitb368@gmail.com",
    pass: "eibn rugp brqi edrw",
  },
});

// asynchronous function to send emails using nodemailer.
async function sendEmail(emailConfig) {
  try {
    // Extract necessary information from the email configuration object.
    const { to, subject, text, html, attachments } = emailConfig;

    // send mail with defined transport object
    // Use the transporter to send the email with specified content and attachments.
    const info = await transporter.sendMail({
      from: "sujitb368@gmail.com", // sender address
      to, // receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
      // attachments: [
      //   {
      //     filename: 'invoice.pdf', // The name of the attachment
      //     path: 'https://images.ctfassets.net/lzny33ho1g45/5HzGPfsoZo3g7klt0Aww6X/89adc1672b7872667eb5f781adeccfac/fcb74faee4c0576ceaacf82777f6bc93__1_.png?w=1400', // Replace with the actual path to your invoice file
      //   },
      // ],
    });

    //used to send a confirm response to the client, email has sent
    return true;
  } catch (error) {
    console.error("An error occurred:", error);
    return res
      .status(500)
      .send({ message: "Unable to send Email", success: false, error });
  }
}

// Export the sendEmail function for use in other modules.
export { sendEmail };
