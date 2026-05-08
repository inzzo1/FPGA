<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBoard = path => {
  router.push(path)
}
</script>

<template>
  <div class="page-container">
    <section class="selector-panel">
      <h1 class="title">选择实验板</h1>
      <p class="subtitle">点击卡片直接进入对应实验页面</p>

      <div class="cards">
        <button class="board-card virtual" type="button" @click="goBoard('/VirtualBoard')">
          <div class="card-top">
            <h2>虚拟板</h2>
            <span class="enter">进入 →</span>
          </div>
          <img
            src="@/assets/pictures/虚拟板-样例图.png"
            alt="虚拟板"
            class="board-img"
          />
        </button>

        <button class="board-card real" type="button" @click="goBoard('/RealBoard')">
          <div class="card-top">
            <h2>实体板</h2>
            <span class="enter">进入 →</span>
          </div>
          <img
            src="@/assets/pictures/实物板-样例图.png"
            alt="实体板"
            class="board-img"
          />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  padding: 56px 32px;
  background-image: url('../../src/assets/bj.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.selector-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 36px 42px;
  border-radius: 26px;
  background: rgba(248, 246, 243, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
}

.title {
  margin: 0;
  font-size: 44px;
  font-weight: 700;
  color: #1f2430;
  letter-spacing: 1px;
}

.subtitle {
  margin: 10px 0 28px;
  font-size: 18px;
  color: #4c5567;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  gap: 24px;
}

.board-card {
  display: block;
  text-align: left;
  border: none;
  border-radius: 18px;
  padding: 16px 16px 18px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(19, 30, 48, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.board-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(19, 30, 48, 0.22);
}

.board-card.virtual {
  border-top: 5px solid #4e9dff;
}

.board-card.real {
  border-top: 5px solid #ff8e4b;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-top h2 {
  margin: 0;
  font-size: 28px;
  color: #1f2430;
}

.enter {
  font-size: 16px;
  font-weight: 600;
  color: #5a6374;
}

.board-img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #d9dde6;
}

@media (max-width: 900px) {
  .page-container {
    padding: 28px 14px;
  }

  .selector-panel {
    padding: 24px 18px 28px;
  }

  .title {
    font-size: 34px;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
