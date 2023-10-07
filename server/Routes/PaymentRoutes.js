const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User_Model.js");
const Payments = require("../Models/PaymentModel.js");
const Restaurant = require("../Models/Restaurant_Model.js");

dotenv.config();
const PAY_API_KEY = process.env.PAY_API_KEY;
const PAY_API_KEY_BASE64 = Buffer.from(PAY_API_KEY).toString("base64");
const paymentRouter = express.Router();

// Create an async route handler using express-async-handler
const createPaymentLinkHandler = async (req, res) => {
  const { userId, payeeName, payeeResId } = req.body;
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
          amount: 20000,
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
    const pendingPayments = await Payments.find({ status: "pending" });
    for (const pendingPayment of pendingPayments) {
      pendingPayment.status = "deprecated";
      await pendingPayment.save();
    }

    const newPayment = new Payments({
      payeeId: userId,
      payeeName: payeeName,
      payeeResId: payeeResId,
      paymentLink: paymentLink.data.attributes.checkout_url,
      amount: 200,
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
        await paymentstatus.save();
        await user.save();
        await restaurant.save();
      } else if (currentDate >= paymentstatus.endDate) {
        paymentstatus.status = "expired";
        user.subscriptionStatus = "expired";
        restaurant.isSubscribed = "expired";
        user.subscriptionStartDate = null;
        user.subscriptionEndDate = null;
        user.linkId = "";
        await paymentstatus.save();
        await user.save();
        await restaurant.save();
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

paymentRouter.post("/createPaymentLink", createPaymentLinkHandler);
paymentRouter.get("/getPaymentLink/:linkId", getPaymentLinkDetailsHandler);

module.exports = paymentRouter;
