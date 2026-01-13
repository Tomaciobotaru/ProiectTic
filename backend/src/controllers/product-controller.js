import { db } from '../firebase.js'; // dacă vrei să folosești Firestore
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const colRef = collection(db, 'products');

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
    const newProduct = req.body;
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
    await updateDoc(docRef, req.body);
    res.json({ id, ...req.body });
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
