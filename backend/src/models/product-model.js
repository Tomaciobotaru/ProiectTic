export class Product {
  constructor({ id, name, price, description, category, quantity, image }) {
    if (id) this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
    this.quantity = quantity ?? 0;
    this.image = image || '';
  }

  toPlain() {
    const plain = {
      name: this.name,
      price: this.price,
      description: this.description,
      category: this.category,
      quantity: this.quantity,
      image: this.image
    };

    if (this.id) {
      plain.id = this.id;
    }

    return plain;
  }
}
