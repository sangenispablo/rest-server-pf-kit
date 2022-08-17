const nodemailer = require("nodemailer");

const TEST_MAIL = "pablo@c1381926.ferozo.com";

const transporter = nodemailer.createTransport({
  host: "c1381926.ferozo.com",
  port: 465,
  auth: {
    user: TEST_MAIL,
    pass: "L3v3lup@pab",
  },
});

module.exports = { transporter, TEST_MAIL };
