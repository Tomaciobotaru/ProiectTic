<template>
  <div class="product-form">
    <form @submit.prevent="handleSubmit">
      <label>
        Nume produs:
        <input type="text" v-model="form.name" required />
      </label>

      <label>
        Descriere:
        <textarea v-model="form.description" required></textarea>
      </label>

      <label>
        Categorie:
        <input
          type="text"
          v-model="form.category"
          placeholder="Laptopuri, Gadgeturi..."
          required
        />
      </label>

      <label>
        Pret:
        <input type="number" v-model.number="form.price" step="0.01" required />
      </label>

      <label>
        Cantitate in stoc:
        <input type="number" v-model.number="form.quantity" min="0" required />
      </label>

      <label>
        Imagine (URL):
        <input type="text" v-model="form.image" placeholder="Optional" />
      </label>

      <div class="buttons">
        <button type="submit">{{ isEdit ? 'Actualizeaza' : 'Adauga' }} produs</button>
        <button
          type="button"
          v-if="isEdit"
          @click="cancelEdit"
          class="cancel-btn"
        >
          Renunta
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { getCategoryLabel } from '@/utils/product'

const props = defineProps({
  product: Object // produsul pentru edit
})

const emits = defineEmits(['saved', 'cancel'])
const apiBase = import.meta.env.VITE_API_URL || '/api'

const isEdit = ref(!!props.product)

const getDefaultForm = () => ({
  name: '',
  description: '',
  category: '',
  price: 0,
  quantity: 0,
  image: ''
})

const form = ref({
  ...getDefaultForm(),
  name: props.product?.name || '',
  description: props.product?.description || '',
  category: props.product?.category || '',
  price: props.product?.price || 0,
  quantity: props.product?.quantity ?? 0,
  image: props.product?.image || ''
})

watch(
  () => props.product,
  (newVal) => {
    if (newVal) {
      isEdit.value = true
      form.value = {
        ...getDefaultForm(),
        ...newVal,
        category: getCategoryLabel(newVal),
        quantity: newVal.quantity ?? 0
      }
    } else {
      isEdit.value = false
      form.value = getDefaultForm()
    }
  }
)

const handleSubmit = async () => {
  try {
    const isUpdate = isEdit.value && props.product?.id
    const url = isUpdate
      ? `${apiBase}/products/${props.product.id}`
      : `${apiBase}/products`
    const method = isUpdate ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form.value })
    })

    if (!response.ok) {
      throw new Error('Request failed')
    }

    emits('saved')
    form.value = getDefaultForm()
  } catch (err) {
    console.error('Error saving product:', err)
  }
}

const cancelEdit = () => {
  emits('cancel')
}
</script>

<style scoped>
.product-form {
  width: 100%;
}

form label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: var(--color-ink-muted);
}

input,
textarea {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

button {
  padding: 0.6rem 1.2rem;
  background-color: var(--color-leaf);
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #256447;
}

.cancel-btn {
  background-color: var(--color-clay);
}

.cancel-btn:hover {
  background-color: var(--color-clay-dark);
}
</style>
