import { faker } from '@faker-js/faker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../src/firebase.js';

const count = Number(process.argv[2]) || 20;
const colRef = collection(db, 'products');

const buildProduct = () => {
  const price = Number(faker.commerce.price({ min: 25, max: 1500, dec: 2 }));
  const quantity = faker.number.int({ min: 0, max: 120 });

  return {
    name: faker.commerce.productName(),
    price,
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    quantity,
    image: '',
    features: Array.from({ length: 3 }, () => faker.commerce.productAdjective())
  };
};

const seed = async () => {
  const products = Array.from({ length: count }, buildProduct);
  await Promise.all(products.map(product => addDoc(colRef, product)));
  console.log(`Seeded ${products.length} products.`);
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
