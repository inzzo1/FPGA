<script setup lang='ts'>
const props = defineProps({
  headerName: {
    type: String,
    default: 'HDU-CBS-VIRT01'
  },
  boardType: {
    type: String
  }
})
</script>

<template>
  <div
    class="header"
    :class="{ mini: props.boardType === 'mini', real: props.boardType === 'real' }"
  >
    <span class="school">杭州电子科技大学</span>
    <span class="board">{{ props.headerName ?? 'HDU-CBS-VIRT01' }}</span>
  </div>
</template>
    
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .school, .board {
    text-align: right;
    color: white;
  }

  /* 默认字号（虚拟板） */
  .school { font-size: 2vw; }
  .board  { font-size: 1.5vw; }

  /* 实物板：标题稍小，避免占位过大 */
  &.real {
    .school { font-size: 1.5vw; }
    .board  { font-size: 1.15vw; }
  }

  /* mini 时更小 */
  &.mini {
    .school { font-size: 0.4vw; }
    .board  { font-size: 0.3vw; }
  }
}
</style>
