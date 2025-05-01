<script lang="ts" setup></script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">トップページ</h1>
    <p class="mb-4">こちらはトップページです。下のボタンをクリックしてデータページに移動してください。</p>
    <NuxtLink to="/data">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        データページへ移動
      </button>
    </NuxtLink>
  </div>
</template>
