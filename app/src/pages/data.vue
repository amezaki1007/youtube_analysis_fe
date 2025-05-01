<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">データページ</h1>
    <p class="mb-4">以下のボタンをクリックすると、APIからデータを取得します。</p>

    <button
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      :disabled="loading"
      @click="fetchData"
    >
      {{ loading ? 'データ取得中...' : 'APIからデータ取得' }}
    </button>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <div v-if="data" class="bg-gray-100 p-4 rounded">
      <h2 class="text-xl font-bold mb-2">APIレスポンス:</h2>
      <pre class="whitespace-pre-wrap">{{ JSON.stringify(data, null, 2) }}</pre>
    </div>

    <div class="mt-4">
      <NuxtLink to="/">
        <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          トップページに戻る
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const data = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('https://cl.tunetrendapi.com/test');

    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status}`);
    }

    data.value = await response.json();
  }
  catch (err) {
    console.error('データ取得エラー:', err);
    error.value = `データの取得に失敗しました: ${err.message}`;
  }
  finally {
    loading.value = false;
  }
};
</script>
