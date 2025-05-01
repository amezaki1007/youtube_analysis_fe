<template>
  <div class="bg-gray-100 p-4 rounded">
    <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'APIレスポンス',
  },
});
</script>
