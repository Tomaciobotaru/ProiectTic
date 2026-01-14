<template>
  <div class="about-page">
    <h1>Despre Mini Shop</h1>
    <p>
      Mini Shop este un magazin online dedicat pasionaților de tehnologie.
      Oferim produse variate, de la laptopuri de gaming la accesorii și componente.
      Scopul nostru este să oferim clienților o experiență simplă, rapidă și sigură.
    </p>
    <img src="@/assets/tech.png" alt="Mini Shop" class="store-image" />
  </div>
</template>

<script setup>
// nu avem nevoie de logică aici deocamdată
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
}

.store-image {
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
  border-radius: 8px;
}
</style>
