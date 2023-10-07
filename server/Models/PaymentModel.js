const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    payeeId: { type: String, required: true },
    payeeName: { type: String, required: true },
    payeeResId: { type: String, required: true },
    amount: { type: Number, default: 200 },
    linkId: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: [
        "subscribed",
        "not subscribed",
        "expired",
        "pending",
        "deprecated",
      ],
      default: "not subscribed",
    },
    subscriptionUpdated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Payments",
  }
);
const Payments = mongoose.model("Payments", paymentSchema);
module.exports = Payments;
