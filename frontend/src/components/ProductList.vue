<template>
  <div class="product-list">
    <h2>Produsele noastre</h2>

    <div v-if="loading" class="loading">
      Se incarca produsele...
    </div>

    <div v-else>
      <!-- Empty state -->
      <div v-if="products.length === 0" class="no-products">
        <img src="@/assets/empty-box.png" alt="No products" />
        <p>Nu exista produse momentan.</p>
      </div>

      <!-- Products grid -->
      <div v-else class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="product.image || defaultImage" alt="Product Image" />

          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <p class="price">{{ formatPrice(product.price) }}</p>
            <p class="stock">{{ formatQuantity(product.quantity) }}</p>
            <p v-if="getCategoryLabel(product)" class="category">
              {{ getCategoryLabel(product) }}
            </p>
          </div>

          <div v-if="canManage" class="actions">
            <button @click="$emit('edit', product)" class="edit-btn">Editeaza</button>
            <button @click="$emit('delete', product.id)" class="delete-btn">Sterge</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import defaultImage from '@/assets/logo.jpg'
import { getCategoryLabel } from '@/utils/product'

const props = defineProps({
  products: Array,
  loading: Boolean,
  canManage: Boolean
})

const formatPrice = (value) => {
  const number = Number(value)
  if (Number.isNaN(number)) return 'Pret la cerere'
  return `$${number.toFixed(2)}`
}

const formatQuantity = (value) => {
  const number = Number(value)
  if (Number.isNaN(number)) return 'Stoc indisponibil'
  return `Stoc: ${number} buc`
}

</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.product-list h2 {
  text-align: center;
  color: var(--color-ink);
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-ink-muted);
}

.no-products img {
  width: 120px;
  margin-bottom: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.product-card {
  background: var(--color-card);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 1.25rem;
  box-shadow: 0 10px 24px rgba(29, 26, 23, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(29, 26, 23, 0.12);
}

.product-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 0.9rem;
  background: #f3efe8;
}

.product-info h3 {
  font-size: 1.15rem;
  margin: 0.4rem 0;
  text-align: center;
}

.product-info p {
  font-size: 0.9rem;
  color: var(--color-ink-muted);
  text-align: center;
  margin: 0.2rem 0;
}

.product-card .price {
  font-weight: bold;
  color: var(--color-leaf);
  font-size: 1.1rem;
  margin-top: 0.4rem;
}

.product-card .stock {
  font-size: 0.85rem;
  color: var(--color-ink-muted);
  margin-top: 0.2rem;
}

.product-card .category {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-clay-dark);
  margin-top: 0.3rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
}

.actions button {
  flex: 1;
  padding: 0.4rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
}

.edit-btn {
  background: var(--color-leaf);
  color: #fff;
}

.edit-btn:hover {
  background: #256447;
}

.delete-btn {
  background: var(--color-clay);
  color: #fff;
}

.delete-btn:hover {
  background: var(--color-clay-dark);
}

@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
