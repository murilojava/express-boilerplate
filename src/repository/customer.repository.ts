import { Customer, CustomerModel } from "../models/customer.model";

export class CustomerRepository {
  async add(customer: Customer) {
    this.sanitizeCustomer(customer);

    return await CustomerModel.create(customer);
  }

  async edit(_id: any, customer: Customer) {
    this.sanitizeCustomer(customer);

    const { _id: id, ...rest } = customer;

    return await CustomerModel.updateOne({ _id }, { $set: { ...rest } });
  }

  async remove(_id: any) {
    return await CustomerModel.deleteOne({ _id });
  }

  private sanitizeCustomer(customer: Customer) {
    if (customer.cpf) customer.cpf = customer.cpf.replace(/\D/g, "");
    if (customer.email) customer.email = customer.email.toLowerCase().trim();
    if (customer.name) customer.name = customer.name.trim();
  }

  async findAll() {
    return await CustomerModel.find({}).lean();
  }
}
