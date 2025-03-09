import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";

export interface ICart extends Document {
  product_id: ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema<ICart> = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product model
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
