export const getCategoryLabel = (product) => {
  if (!product) return ''
  const category = product.category
  if (typeof category === 'string') return category
  if (category && typeof category === 'object' && category.name) return category.name
  return ''
}
