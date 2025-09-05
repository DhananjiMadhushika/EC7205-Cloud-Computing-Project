import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    lineOne: { type: String, required: true },
    lineTwo: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    formattedAddress: { type: String }
  },
  { timestamps: true }
);

AddressSchema.pre('save', function(next) {
  if (this.isModified('lineOne') || this.isModified('lineTwo') || this.isModified('city') || this.isModified('country') || this.isModified('pinCode')) {
    const parts = [
      this.lineOne,
      this.lineTwo,
      this.city,
      this.country,
      this.pinCode
    ].filter(Boolean);
    
    this.formattedAddress = parts.join(', ');
  }
  next();
});

export default mongoose.model("Address", AddressSchema);