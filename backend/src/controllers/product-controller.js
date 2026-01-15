import { db } from '../firebase.js';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const colRef = collection(db, 'products');

const normalizeProduct = (input) => {
  const price = Number(input?.price);
  const quantity = Number(input?.quantity);

  return {
    name: String(input?.name || '').trim(),
    description: String(input?.description || '').trim(),
    category: String(input?.category || '').trim(),
    price: Number.isFinite(price) ? price : 0,
    quantity: Number.isFinite(quantity) ? quantity : 0,
    image: String(input?.image || '').trim()
  };
};

const validateProduct = (product) => {
  if (!product.name) return 'Numele produsului este obligatoriu.';
  if (!product.description) return 'Descrierea produsului este obligatorie.';
  return '';
};

export const getAllProducts = async (req, res) => {
  try {
    const snapshot = await getDocs(colRef);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = normalizeProduct(req.body);
    const validationError = validateProduct(newProduct);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const docRef = await addDoc(colRef, newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, 'products', id);
    const updatedProduct = normalizeProduct(req.body);
    const validationError = validateProduct(updatedProduct);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    await updateDoc(docRef, updatedProduct);
    res.json({ id, ...updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'products', id));
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
