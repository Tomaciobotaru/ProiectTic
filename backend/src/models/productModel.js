export class Product {
  constructor({ id, name, price, description, quantity }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.quantity = quantity ?? 0;
  }
}
