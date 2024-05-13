const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  code: { type: Number, required: true },
  datePublished: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notice", NoticeSchema);
