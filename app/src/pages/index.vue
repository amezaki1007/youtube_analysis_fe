<script lang="ts" setup>
import AppHeader from '../components/AppHeader.vue';

</script>

<template>
  <div class="container mx-auto p-4">
    <AppHeader />
    <h1 class="text-2xl font-bold mb-4">トップページ</h1>
    <p class="mb-4">こちらはトップページです。下のボタンをクリックしてデータページに移動してください。</p>

    <NuxtLink to="/trend">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        go to trend page
      </button>
    </NuxtLink>
  </div>
</template>
