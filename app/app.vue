<template>
  <div>
    <header class="bg-gray-100 p-4 border-b">
      <div class="container mx-auto">
        <h1 class="text-xl font-bold">Nuxt 3 APIデモアプリ</h1>
      </div>
    </header>

    <main>
      <!-- このコンポーネントが、現在のルートに対応するページコンポーネントをレンダリングします -->
      <NuxtPage />
    </main>

    <footer class="bg-gray-100 p-4 border-t mt-8">
      <div class="container mx-auto text-center text-gray-600">
        &copy; 2025 Nuxt 3 APIデモアプリ
      </div>
    </footer>
  </div>
</template>
