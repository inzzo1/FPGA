<!-- /src/views/BoardsWall.vue -->
<script setup lang="ts">
import { list } from 'postcss';
import { onMounted, ref } from 'vue'
// import { useBoardsStore } from '@/stores/boards'
import MiniBoard from '@/components/virtualDesk/miniBoard.vue'

// const store = useBoardsStore()

// onMounted(() => {
//   store.initBoards(40)        // 展示占位
//   store.connect()             // 建立 WebSocket
// })

const store = ref(
  {
    list: [1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  }
)
</script>

<template>
  <div class="wall">
    <div class="topbar">
      <h2>板卡监控墙（40）</h2>
      <!-- <div class="dot" :class="{ on: store.connected }"></div> -->
      <!-- <span class="conn">{{ store.connected ? '已连接' : '连接中/重连…' }}</span> -->
    </div>

    <div class="grid">
      <div class="cell" v-for="(b, i) in store.list" :key="i">
        <MiniBoard :data="b" :scale="0.42" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 删掉你之前的 :root{ --gap: ... } */

.wall{
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 在可继承的祖先上定义变量 */
  --gap: 3px;
  --topbar-h: 44px;
}

.topbar{
  height: var(--topbar-h);
  flex: 0 0 var(--topbar-h);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin: 0;
}

.grid{
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: var(--gap);          /* 变量现在能读到了 */
  background: #E9EEF3;
  margin: 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/* 外包一层 .cell 的写法保持不变 */
.cell{
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
}
.cell > *{
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}
</style>
