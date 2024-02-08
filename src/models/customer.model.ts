import mongoose from "mongoose";

export interface Customer {
  _id: any;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
}
const customerSchema = new mongoose.Schema<Customer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
});

export const CustomerModel = mongoose.model("Customer", customerSchema);
