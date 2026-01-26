import { db } from '../firebase.js';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Product } from '../models/product-model.js';

const colRef = collection(db, 'products');

const normalizeProduct = (input) => {
  const price = Number(input?.price);
  const quantity = Number(input?.quantity);

  return new Product({
    name: String(input?.name || '').trim(),
    description: String(input?.description || '').trim(),
    category: String(input?.category || '').trim(),
    price: Number.isFinite(price) ? price : 0,
    quantity: Number.isFinite(quantity) ? quantity : 0,
    image: String(input?.image || '').trim()
  });
};


export const getAllProducts = async (req, res) => {
  try {
    const snapshot = await getDocs(colRef);
    const products = snapshot.docs.map(doc =>
      new Product({ id: doc.id, ...doc.data() }).toPlain()
    );
    res.json(products);
  } catch (err) {
    console.error('getAllProducts failed:', err);
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = normalizeProduct(req.body);
    const docRef = await addDoc(colRef, newProduct.toPlain());
    res.status(201).json({ id: docRef.id, ...newProduct.toPlain() });
  } catch (err) {
    console.error('createProduct failed:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, 'products', id);
    const updatedProduct = normalizeProduct(req.body);
    await updateDoc(docRef, updatedProduct.toPlain());
    res.json({ id, ...updatedProduct.toPlain() });
  } catch (err) {
    console.error('updateProduct failed:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'products', id));
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('deleteProduct failed:', err);
    res.status(500).json({ error: err.message });
  }
};
