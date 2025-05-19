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

    <!-- 確認ダイアログ -->
    <div v-if="showConfirmDialog" class="confirm-dialog">
      <div class="confirm-dialog-content">
        <p>今後この動画を非表示にしますか？</p>
        <div class="confirm-buttons">
          <button class="cancel-button" @click="cancelHideVideo">キャンセル</button>
          <button class="confirm-button" @click="confirmHideVideo">OK</button>
        </div>
      </div>
    </div>

    <!-- 動画リスト -->
    <div
      v-for="video in videos"
      :key="video.videoId"
      class="video-card"
      :class="{ 'swiping': video.videoId === swipingVideoId }"
      @touchstart="handleTouchStart($event, video.videoId)"
      @touchmove="handleTouchMove($event, video.videoId)"
      @touchend="handleTouchEnd(video.videoId)"
    >
      <!-- スワイプで表示されるゴミ箱アイコン (モバイル) - コンテンツの下に配置 -->
      <div class="swipe-action">
        <button class="trash-button" @click="showHideConfirmation(video.videoId)">
          <span class="trash-icon">🗑️</span>
        </button>
      </div>

      <div class="video-content">
        <a :href="`https://www.youtube.com/watch?v=${video.videoId}`" target="_blank">
          <img :src="video.thumbnail" :alt="video.videoTitle">
        </a>
        <div class="video-info">
          <a :href="`https://www.youtube.com/watch?v=${video.videoId}`" target="_blank">
            <p>{{ video.videoTitle }}</p>
          </a>
          <p class="text-xs text-gray-500">
            {{ video.viewcount }} 回視聴・{{ formatDate(video.publishedAt) }}
          </p>
        </div>
        <!-- 非表示ボタン (PC) -->
        <button class="hide-button desktop-only" @click="showHideConfirmation(video.videoId)">×</button>
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

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0始まり
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const categoryTabs = [
  { label: '歌ってみた', query: '歌ってみた' },
  { label: 'ボカロオリジナル', query: 'ボカロオリジナル' },
];

const seasonTabs = [
  { label: '直近（7日）', season: 'recent', range: 7 },
  { label: '直近（1ヶ月）', season: 'recent', range: 30 },
  { label: '直近（3ヶ月）', season: 'recent', range: 90 },
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

// 非表示機能のための変数
const showConfirmDialog = ref(false);
const selectedVideoId = ref(null);
const swipingVideoId = ref(null);
const touchStartX = ref(0);
const swipeThreshold = 160; // スワイプを検出する閾値（ピクセル）
const isMobile = ref(false);

// デバイスタイプの確認
const checkDeviceType = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

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

  try {
    const res = await axios.get('https://cl.tunetrendapi.com/api/v1/trend', {
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
    // ページトップへスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // スムーズスクロール
    });
  }
};

const nextPage = () => {
  currentPage.value++;
  fetchVideos();
  // ページトップへスクロール
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // スムーズスクロール
  });
};

// タッチイベントハンドラー（モバイル用スワイプ機能）
const handleTouchStart = (event, _videoId) => {
  touchStartX.value = event.touches[0].clientX;
  swipingVideoId.value = null;
};

const handleTouchMove = (event, videoId) => {
  if (!isMobile.value) return;

  const touchX = event.touches[0].clientX;
  const diff = touchX - touchStartX.value;

  // 右スワイプのみ検出（diff > 0）
  if (diff > 0 && diff > swipeThreshold / 2) {
    swipingVideoId.value = videoId;
  }
  else {
    swipingVideoId.value = null;
  }
};

const handleTouchEnd = (videoId) => {
  if (swipingVideoId.value === videoId) {
    // スワイプ後は自動的に元の位置に戻る
    // ゴミ箱アイコンはクリックで操作する
    setTimeout(() => {
      swipingVideoId.value = null;
    }, 2000);
  }
};

// 非表示確認ダイアログを表示
const showHideConfirmation = (videoId) => {
  selectedVideoId.value = videoId;
  showConfirmDialog.value = true;
};

// 非表示をキャンセル
const cancelHideVideo = () => {
  showConfirmDialog.value = false;
  selectedVideoId.value = null;
};

// 非表示を確定
const confirmHideVideo = async () => {
  if (!selectedVideoId.value) return;

  try {
    await axios.put('https://cl.tunetrendapi.com/api/v1/video/hide', {}, {
      params: {
        videoId: selectedVideoId.value,
        value: true,
      },
    });

    // 成功したら動画リストから削除
    videos.value = videos.value.filter(video => video.videoId !== selectedVideoId.value);

    showConfirmDialog.value = false;
    selectedVideoId.value = null;
  }
  catch (err) {
    console.error('Failed to hide video:', err);
    alert('動画の非表示設定に失敗しました。');
  }
};

onMounted(() => {
  checkDeviceType();
  fetchVideos();

  // ウィンドウサイズが変更されたときにデバイスタイプを再チェック
  window.addEventListener('resize', checkDeviceType);
});

</script>

<style scoped>
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: visible;      /* 横スクロール有効化 */
  flex-wrap: wrap;
  -webkit-overflow-scrolling: touch; /* iOS の慣性スクロール対応 */
  scrollbar-width: none; /* Firefox: スクロールバー非表示 */
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
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  justify-items: center;
}

.video-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  max-width: 600px;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.video-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  transition: transform 0.3s ease;
}

.video-card.swiping .video-content {
  transform: translateX(80px);
}

.swipe-action {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  background-color: #ff4f4f;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card.swiping .swipe-action {
  opacity: 1;
}

.trash-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trash-icon {
  font-size: 1.5rem;
}

.video-card img {
  max-width: 240px;
  height: auto;
  border-radius: 8px;
}

.video-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  flex-grow: 1;
}

.video-card p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: left;
}

.hide-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}

/* 確認ダイアログ */
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 300px;
  width: 100%;
  text-align: center;
}

.confirm-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
}

.cancel-button, .confirm-button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #eee;
}

.confirm-button {
  background-color: #ff4f4f;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-number {
  font-weight: bold;
}

/* メディアクエリ */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .video-card img {
    max-width: 160px;
  }
}

@media (min-width: 769px) {
  .swipe-action {
    display: none;
  }
}
</style>
