<template>
  <header class="app-header">
    <nav class="nav">
      <RouterLink to="/" class="logo">VocaTrend App</RouterLink>

      <!-- ハンバーガーアイコン -->
      <button class="menu-toggle" @click="toggleMenu">
        ☰
      </button>

      <!-- ナビゲーション -->
      <ul :class="['nav-links', { open: isMenuOpen }]">
        <li><RouterLink to="/" @click="closeMenu">Home</RouterLink></li>
        <li><RouterLink to="/about" @click="closeMenu">About</RouterLink></li>
        <li><RouterLink to="/contact" @click="closeMenu">Contact</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.app-header {
  background-color: #333;
  padding: 1rem;
  height: 48px;
  color: white;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.menu-toggle {
  display: none;
  font-size: 2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a:hover {
  text-decoration: underline;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    background-color: #444;
    position: absolute;
    top: 60px;
    right: 0;
    width: 200px;
    padding: 1rem;
    border-radius: 8px;
  }

  .nav-links.open {
    display: flex;
  }
}
</style>
