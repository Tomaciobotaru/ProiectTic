<template>
  <div>
    <h1>Mini Shop</h1>
    <p>Test Firestore: {{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const message = ref('Loading...')

onMounted(async () => {
  try {
    const colRef = collection(db, 'products')
    const snapshot = await getDocs(colRef)
    message.value = `Found ${snapshot.size} products`
  } catch (err) {
    message.value = 'Error connecting to Firestore'
    console.error(err)
  }
})
</script>
