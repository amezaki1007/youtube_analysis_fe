<template>
  <div class="trend-page">

    <!-- カテゴリタブ -->
    <div class="tabs category-tabs">
      <button
        v-for="tab in categoryTabs"
        :key="tab.query"
        :class="['tab-button', { active: currentCategory === tab.query }]"
        @click="() => {
          currentCategory = tab.query;
          currentRange = tab.range;
          fetchVideos();
        }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 時期タブ -->
    <div class="tabs season-tabs">
      <button
        v-for="tab in seasonTabs"
        :key="tab.label"
        :class="['tab-button', { active: currentSeason === tab.season && currentRange === tab.range && currentYear === tab.year }]"
        @click="() => {
          currentSeason = tab.season;
          currentYear = tab.year;
          currentRange = tab.range;
          fetchVideos();
        }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 読み込み中表示 -->
    <div v-if="loading">読み込み中...</div>

    <!-- 動画リスト -->
    <div v-else class="video-grid">
      <div v-for="video in videos" :key="video.videoId" class="video-card">
        <a :href="`https://www.youtube.com/watch?v=${video.videoId}`" target="_blank">
          <img :src="video.thumbnail" :alt="video.videoTitle" >
          <p>{{ video.videoTitle }}</p>
        </a>
      </div>
    </div>

    <!-- ページング -->
    <div class="pagination">
      <button
        :disabled="currentPage === 1"
        class="pagination-button"
        @click="prevPage"
      >
        前へ
      </button>

      <span class="page-number">ページ {{ currentPage }}</span>

      <button
        class="pagination-button"
        @click="nextPage"
      >
        次へ
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const categoryTabs = [
  { label: '歌ってみた', query: '歌ってみた' },
  { label: 'ボカロオリジナル', query: 'ボカロオリジナル' },
];

const seasonTabs = [
  { label: '直近（７日）', season: 'recent', range: 7 },
  { label: '直近（半年）', season: 'recent', range: 180 },
  { label: '2025春', season: 'spring', year: '2025' },
  { label: '2024冬', season: 'winter', year: '2024' },
  { label: '2024秋', season: 'fall', year: '2024' },
  { label: '2024夏', season: 'summer', year: '2024' },
  { label: '2024春', season: 'spring', year: '2024' },
  { label: '2023冬', season: 'winter', year: '2023' },
  { label: '2023秋', season: 'fall', year: '2023' },
  { label: '2023夏', season: 'summer', year: '2023' },
  { label: '2023春', season: 'spring', year: '2023' },
  { label: '2022冬', season: 'winter', year: '2022' },
  { label: '2022秋', season: 'fall', year: '2022' },
  { label: '2022夏', season: 'summer', year: '2022' },
  { label: '2022春', season: 'spring', year: '2022' },
];

const currentCategory = ref(categoryTabs[0].query);
const currentSeason = ref(seasonTabs[0].season);
const currentYear = ref(seasonTabs[0].year);
const currentRange = ref(seasonTabs[0].range);
const currentPage = ref(1);
const videos = ref([]);
const loading = ref(false);

const fetchVideos = async () => {
  loading.value = true;
  const params = {};

  params.videoType = currentCategory.value;
  if (currentSeason.value == 'recent') {
    params.mode = 'recent';
    params.range = currentRange.value;
  }
  else {
    params.mode = 'normal';
    params.year = currentYear.value;
    params.season = currentSeason.value;
  }
  params.pageSize = 20;
  params.page = currentPage.value;

  // TODO: API 実装後に実装
  // params.statType = 'count';
  // params.order = 'desc';
  // params.channelId = 'tobeimplemented';
  try {
    const res = await axios.get('http://tunetrendapi.com/api/v1/trend', {
      params: params,
    });
    videos.value = res.data;
    console.log(res.data);
  }
  catch (err) {
    console.error('API error:', err);
    videos.value = [];
  }
  finally {
    loading.value = false;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchVideos();
  }
};

const nextPage = () => {
  currentPage.value++;
  fetchVideos();
};

onMounted(fetchVideos);
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 4px;
}

.tab-button.active {
  background-color: #333;
  color: white;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.video-card img {
  width: 100%;
  border-radius: 8px;
}

.video-card p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}
</style>
