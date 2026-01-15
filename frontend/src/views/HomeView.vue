<template>
  <div class="home-container">
    <section class="hero">
      <div>
        <h2>Mini Tech Market</h2>
        <p>
          Magazinul nostru tech livreaza rapid accesorii, gadgeturi si echipamente
          selectate pentru performanta si design.
        </p>
        <div class="hero-actions">
          <button class="ghost-button" @click="scrollToProducts">Vezi produse</button>
          <button
            v-if="canManage"
            class="primary-button"
            @click="openCreate"
          >
            Adauga produs
          </button>
        </div>
      </div>
      <div class="hero-card">
        <img src="@/assets/store.jpg" alt="Magazin Mini Shop" />
      </div>
    </section>

    <section class="toolbar">
      <div class="auth-block">
        <div>
          <p class="auth-title">Cont</p>
          <p class="auth-status">
            <span v-if="authStore.user">Autentificat</span>
            <span v-else>Vizitator</span>
          </p>
        </div>
        <div v-if="!authStore.user" class="auth-hint">
          Autentificarea se face din pagina Login.
        </div>
      </div>

      <div class="sort-controls">
        <label for="sort">Sortare</label>
        <select id="sort" v-model="sortKey">
          <option value="">Implicit</option>
          <option value="priceAsc">Pret ↑</option>
          <option value="priceDesc">Pret ↓</option>
          <option value="nameAsc">Nume A→Z</option>
          <option value="nameDesc">Nume Z→A</option>
        </select>
      </div>

      <div class="sort-controls">
        <label for="category">Categorie</label>
        <select id="category" v-model="categoryFilter">
          <option value="">Toate</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </section>

    <section v-if="!authStore.isAdmin && authStore.user" class="notice">
      <p>Actiunile de administrator sunt restrictionate.</p>
    </section>

    <section v-if="authStore.adminEmails.length === 0" class="notice">
      <p>Seteaza `VITE_ADMIN_EMAILS` pentru a activa accesul de admin.</p>
    </section>

    <section ref="productSection" class="products-section">
      <ProductList
        :products="visibleProducts"
        :loading="loading"
        :can-manage="canManage"
        @edit="onEdit"
        @delete="onDelete"
      />
      <div ref="sentinel" class="sentinel"></div>
      <p v-if="isLoadingMore" class="load-more">Se incarca mai multe produse...</p>
    </section>

    <div v-if="showForm" class="modal">
      <div class="modal-backdrop" @click="closeForm"></div>
      <div class="modal-panel">
        <div class="modal-header">
          <h3>{{ selectedProduct ? 'Editeaza produs' : 'Adauga produs' }}</h3>
          <button class="icon-button" @click="closeForm">✕</button>
        </div>
        <ProductForm
          :product="selectedProduct"
          @saved="onSaved"
          @cancel="onCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import ProductForm from '../components/ProductForm.vue'
import ProductList from '../components/ProductList.vue'
import { useAuthStore } from '@/stores/auth'

const products = ref([])
const loading = ref(true)
const selectedProduct = ref(null)
const sortKey = ref('')
const categoryFilter = ref('')
const showForm = ref(false)
const productSection = ref(null)
const authStore = useAuthStore()
const apiBase = import.meta.env.VITE_API_URL || '/api'
const visibleCount = ref(12)
const pageSize = ref(12)
const sentinel = ref(null)
const isLoadingMore = ref(false)
let observer = null

const canManage = computed(() => authStore.isAdmin)

// Fetch products
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await fetch(`${apiBase}/products`)
    if (!response.ok) {
      throw new Error('Request failed')
    }
    products.value = await response.json()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Computed: sorted products
const normalizedCategory = (product) => {
  if (!product) return ''
  if (typeof product.category === 'string') return product.category
  if (product.category?.name) return product.category.name
  return ''
}

const categories = computed(() => {
  const set = new Set()
  products.value.forEach((product) => {
    const name = normalizedCategory(product)
    if (name) set.add(name)
  })
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const sortedProducts = computed(() => {
  let arr = [...products.value]
  if (categoryFilter.value) {
    arr = arr.filter((product) => normalizedCategory(product) === categoryFilter.value)
  }
  switch (sortKey.value) {
    case 'priceAsc':
      return arr.sort((a, b) => a.price - b.price)
    case 'priceDesc':
      return arr.sort((a, b) => b.price - a.price)
    case 'nameAsc':
      return arr.sort((a, b) => a.name.localeCompare(b.name))
    case 'nameDesc':
      return arr.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return arr
  }
})

const visibleProducts = computed(() => {
  return sortedProducts.value.slice(0, visibleCount.value)
})

const openCreate = () => {
  selectedProduct.value = null
  showForm.value = true
}

// Called after form save
const onSaved = () => {
  selectedProduct.value = null
  showForm.value = false
  fetchProducts()
}

// Cancel edit
const onCancel = () => {
  selectedProduct.value = null
  showForm.value = false
}

// Edit clicked
const onEdit = (product) => {
  if (!canManage.value) return
  selectedProduct.value = { ...product }
  showForm.value = true
}

// Delete clicked
const onDelete = async (id) => {
  if (!canManage.value) return
  if (!confirm('Sigur vrei sa stergi acest produs?')) return
  try {
    const response = await fetch(`${apiBase}/products/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Request failed')
    }
    fetchProducts()
  } catch (err) {
    console.error('Error deleting product:', err)
  }
}

const closeForm = () => {
  showForm.value = false
  selectedProduct.value = null
}

const scrollToProducts = () => {
  if (!productSection.value) return
  productSection.value.scrollIntoView({ behavior: 'smooth' })
}

onMounted(fetchProducts)

watch(
  () => authStore.isAdmin,
  (isAdmin) => {
    if (!isAdmin) {
      showForm.value = false
      selectedProduct.value = null
    }
  },
  { immediate: true }
)

const setupObserver = () => {
  if (!sentinel.value) return
  if (observer) observer.disconnect()

  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (!entry.isIntersecting) return
    if (visibleCount.value >= sortedProducts.value.length) return

    isLoadingMore.value = true
    setTimeout(() => {
      visibleCount.value += pageSize.value
      isLoadingMore.value = false
    }, 200)
  })

  observer.observe(sentinel.value)
}

watch(
  () => [sortKey.value, categoryFilter.value, products.value.length],
  () => {
    visibleCount.value = pageSize.value
    setupObserver()
  }
)

onMounted(() => {
  setupObserver()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  align-items: center;
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 40px rgba(29, 26, 23, 0.08);
}

.hero h2 {
  font-size: 2.2rem;
  margin-bottom: 0.6rem;
}

.hero p {
  color: var(--color-ink-muted);
  margin-bottom: 1.5rem;
}

.hero-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.hero-card img {
  width: 100%;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 10px 24px rgba(29, 26, 23, 0.12);
}

.toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  align-items: center;
}

.auth-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #fffaf3;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.auth-title {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--color-ink-muted);
  letter-spacing: 1px;
}

.auth-status {
  font-size: 0.95rem;
}

.auth-hint {
  font-size: 0.8rem;
  color: var(--color-ink-muted);
}

.sort-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

.sort-controls label {
  font-weight: 600;
  color: var(--color-ink-muted);
}

.sort-controls select {
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: #fff;
}

.primary-button,
.ghost-button {
  padding: 0.65rem 1.3rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-button {
  background: var(--color-leaf);
  color: #fff;
  box-shadow: 0 10px 20px rgba(47, 125, 93, 0.2);
}

.ghost-button {
  background: transparent;
  color: var(--color-ink);
  border: 1px solid var(--color-border);
}

.primary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
}

.notice {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: #fff6ef;
  border: 1px dashed rgba(183, 90, 66, 0.4);
  color: var(--color-ink-muted);
}

.products-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sentinel {
  height: 1px;
}

.load-more {
  text-align: center;
  color: var(--color-ink-muted);
  font-size: 0.9rem;
}

.modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 20;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(29, 26, 23, 0.4);
}

.modal-panel {
  position: relative;
  width: min(620px, 92vw);
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 18px 40px rgba(29, 26, 23, 0.2);
  z-index: 1;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-ink-muted);
}
</style>
