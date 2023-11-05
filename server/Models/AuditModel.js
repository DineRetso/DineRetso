const mongoose = require("mongoose");
const auditSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "AuditLogs",
  }
);

const Audit = mongoose.model("AuditLogs", auditSchema);
module.exports = Audit;
