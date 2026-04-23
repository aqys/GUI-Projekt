<template>
  <main class="not-found">
    <h1>404</h1>
    <p>Siden blev ikke fundet.</p>
    <RouterLink to="/dashboard">Gå til dashboard</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 50vh;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 0.75rem;
}

a {
  color: var(--color-primary-hover);
  font-weight: 700;
}
</style>
