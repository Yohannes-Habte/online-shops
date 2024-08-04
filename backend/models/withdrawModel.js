import mongoose from 'mongoose';

const { Schema } = mongoose;

const withdrawSchema = new Schema(
  {
    seller: { type: Object, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Processing' },
  },
  { timestamps: true }
);

// Withdraw Model
const Withdraw = mongoose.model('Withdraw', withdrawSchema);
export default Withdraw;
