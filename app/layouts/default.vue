<!-- layouts/default.vue -->
<template>
  <div>
    <nav style="padding: 20px; border-bottom: 1px solid #ccc; margin-bottom: 20px;">
      <NuxtLink to="/" style="margin-right: 15px;">Home</NuxtLink>
      <NuxtLink to="/articles" style="margin-right: 15px;">Articles</NuxtLink>
      <NuxtLink to="/recipes">Recipes</NuxtLink>
    </nav>
    <main>
      <slot /> <!-- Konten halaman akan masuk di sini -->
    </main>
  </div>
</template>