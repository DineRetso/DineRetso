const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User_Model.js");
const Payments = require("../Models/PaymentModel.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

dotenv.config();
const PAY_API_KEY = process.env.PAY_API_KEY;
const PAY_API_KEY_BASE64 = Buffer.from(PAY_API_KEY).toString("base64");
const paymentRouter = express.Router();

// Create an async route handler using express-async-handler
const createPaymentLinkHandler = async (req, res) => {
  const { userId, payeeName, payeeResId, paymentType } = req.body;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Basic ${PAY_API_KEY_BASE64}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: paymentType === "Premium" ? 50000 : 20000,
          description: "Subscription",
          remarks: payeeResId,
        },
      },
    }),
  };

  try {
    const response = await fetch("https://api.paymongo.com/v1/links", options);

    if (!response.ok) {
      const errorMessage = `Failed to create payment link. Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const paymentLink = await response.json();
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 10);
    const pendingPayments = await Payments.find({
      payeeResId: payeeResId,
      status: "pending",
    });
    for (const pendingPayment of pendingPayments) {
      pendingPayment.status = "deprecated";
      await pendingPayment.save();
    }

    const newPayment = new Payments({
      payeeId: userId,
      payeeName: payeeName,
      payeeResId: payeeResId,
      paymentLink: paymentLink.data.attributes.checkout_url,
      amount: paymentType === "Premium" ? 500 : 200,
      paymentType: paymentType,
      linkId: paymentLink.data.id,
      startDate: currentDate,
      endDate: endDate,
      status: "pending",
    });

    await newPayment.save();
    await User.findByIdAndUpdate(
      userId,
      { linkId: paymentLink.data.id },
      { new: true }
    );
    res.json(paymentLink);
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: "Payment link creation failed" });
  }
};
//sendemailoneweekexpiration
function sendExpiration(userEmail, expiration) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.DineE,
        pass: process.env.DineP,
      },
    });

    const mailOptions = {
      from: `DineRetso <${process.env.DineE}>`,
      to: userEmail,
      subject: "Subscription Expiration Reminder",
      html: `
      <html>
      <head>
          <style>
              /* Add your CSS styles here */
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #F3782C;
                  color: #fff;
                  padding: 20px;
                  text-align: center;
              }
              .content {
                  padding: 20px;
              }
              .message {
                  font-size: 16px;
              }
             .dine {
                  font-weight: bold;
                  color: #F3782C;
             }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Subscription Expiration Reminder</h1>
              </div>
              <div class="content">
                  <p class="message">Hello,</p>
                  <p class="message">Your subscription in <span class="dine">DineRetso</span> will expire on ${expiration}.</p>
                
              </div>
          </div>
      </body>
      </html>
        `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${userEmail}: ${error}`);
        reject(error);
      } else {
        console.log(`Email sent to ${userEmail}: ${info.response}`);
        resolve(info);
      }
    });
  });
}

//getPayment
const getPaymentLinkDetails = async (linkId) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Basic ${PAY_API_KEY_BASE64}`,
    },
  };
  const response = await fetch(
    `https://api.paymongo.com/v1/links/${linkId}`,
    options
  );

  if (!response.ok) {
    throw new Error("Failed to get payment link details");
  }
  const responseData = await response.json();
  const paymentstatus = await Payments.findOne({ linkId: linkId });
  const user = await User.findOne({ linkId: linkId });
  if (!user) {
    const result = {
      responseData: responseData,
    };
    return result;
  }
  const restaurant = await Restaurant.findOne({ _id: user.myRestaurant });
  if (paymentstatus) {
    if (responseData.data.attributes.status === "paid") {
      const currentDate = new Date();
      if (!paymentstatus.subscriptionUpdated) {
        paymentstatus.startDate = currentDate;
        const endDate = new Date(currentDate);
        endDate.setMonth(currentDate.getMonth() + 1);
        paymentstatus.endDate = endDate;
        paymentstatus.subscriptionUpdated = true;
        paymentstatus.status = "subscribed";
        user.subscriptionStatus = "subscribed";
        user.subscriptionStartDate = currentDate;
        user.subscriptionEndDate = endDate;
        restaurant.isSubscribed = "subscribed";
        restaurant.subscriptionStartDate = currentDate;
        restaurant.subscriptionEndDate = endDate;
        restaurant.paymentType = paymentstatus.paymentType;
        restaurant.postCount = 0;
        await paymentstatus.save();
        await user.save();
        await restaurant.save();
      } else if (currentDate >= paymentstatus.endDate) {
        paymentstatus.status = "expired";
        user.subscriptionStatus = "expired";
        restaurant.isSubscribed = "expired";
        user.subscriptionStartDate = null;
        user.subscriptionEndDate = null;
        user.emailSent = false;
        restaurant.subscriptionStartDate = null;
        restaurant.subscriptionEndDate = null;
        user.linkId = "";
        await paymentstatus.save();
        await user.save();
        await restaurant.save();
      } else if (
        currentDate >=
          new Date(paymentstatus.endDate - 7 * 24 * 60 * 60 * 1000) &&
        !user.emailSent
      ) {
        await sendExpiration(user.email, user.subscriptionEndDate);
        user.emailSent = true;
        await user.save();
      }
    }
  }
  const result = {
    payments: paymentstatus,
    users: user,
    restaurants: restaurant,
    responseData: responseData,
  };
  return result;
};
const getPaymentLinkDetailsHandler = async (req, res) => {
  const { linkId } = req.params;
  try {
    const paymentLinkDetails = await getPaymentLinkDetails(linkId);
    res.json(paymentLinkDetails);
  } catch (error) {
    console.error("Error getting payment link details:", error);
    res.status(500).json({ error: "Failed to get payment link details" });
  }
};

const dailySubscriptionCheck = () => {
  cron.schedule("0 17 * * *", async () => {
    // For each user, check their payment link status
    const users = await User.find({});
    for (const user of users) {
      if (user.linkId) {
        try {
          await getPaymentLinkDetails(user.linkId);
        } catch (error) {
          console.error(
            `Error checking subscription for user ${user._id}: ${error}`
          );
        }
      }
    }
  });
};

dailySubscriptionCheck();

paymentRouter.post("/createPaymentLink", createPaymentLinkHandler);
paymentRouter.get("/getPaymentLink/:linkId", getPaymentLinkDetailsHandler);

module.exports = paymentRouter;
