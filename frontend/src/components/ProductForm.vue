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
        Pret:
        <input type="number" v-model.number="form.price" step="0.01" required />
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
import { db } from '../firebase'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'

const props = defineProps({
  product: Object // produsul pentru edit
})

const emits = defineEmits(['saved', 'cancel'])

const isEdit = ref(!!props.product)
const form = ref({
  name: props.product?.name || '',
  description: props.product?.description || '',
  price: props.product?.price || 0,
  image: props.product?.image || ''
})

watch(
  () => props.product,
  (newVal) => {
    if (newVal) {
      isEdit.value = true
      form.value = { ...newVal }
    } else {
      isEdit.value = false
      form.value = { name: '', description: '', price: 0, image: '' }
    }
  }
)

const handleSubmit = async () => {
  try {
    const colRef = collection(db, 'products')
    if (isEdit.value && props.product.id) {
      const docRef = doc(db, 'products', props.product.id)
      await updateDoc(docRef, { ...form.value })
    } else {
      await addDoc(colRef, { ...form.value })
    }

    emits('saved')
    form.value = { name: '', description: '', price: 0, image: '' }
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
