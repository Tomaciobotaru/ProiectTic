export const validateProduct = (req, res, next) => {
  const { name, description, category, price, quantity } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Numele produsului este obligatoriu.' });
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'Descrierea produsului este obligatorie.' });
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: 'Categoria produsului este obligatorie.' });
  }

  if (price !== undefined && Number.isNaN(Number(price))) {
    return res.status(400).json({ error: 'Pretul trebuie sa fie numeric.' });
  }

  if (quantity !== undefined && Number.isNaN(Number(quantity))) {
    return res.status(400).json({ error: 'Cantitatea trebuie sa fie numerica.' });
  }

  return next();
};
