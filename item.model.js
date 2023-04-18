const mongoose = require("mongoose");

var itemSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    value: { type: Number, required: true },
    description: { type: String },
  },
  { collection: "item" }
);

itemSchema.pre("save", function (next) {
  const item = this;
  if (!item.description) {
    item.description = "No description...";
  }
  return next();
});

mongoose.model("item", itemSchema);
