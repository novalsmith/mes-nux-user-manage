<template>
  <div class="wrapper">
    <section>
      <h1>Articles</h1>
      <ul>
        <li v-for="a in articles" :key="a.id">
          <img v-if="a.image" :src="a.image" width="100" />
          <h2>{{ a.title }}</h2>
        </li>
      </ul>
    </section>

    <section>
      <h1>Recipes</h1>
      <ul>
        <li v-for="r in recipes" :key="r.id">
          <img v-if="r.image" :src="r.image" width="100" />
          <h2>{{ r.title }}</h2>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const { articles, recipes } = await useArticle();
</script>