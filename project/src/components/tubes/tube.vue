<script setup lang="ts">
import Digit from '../../assets/LED/digit1.vue'
import { computed, type PropType } from 'vue'

const props = withDefaults(defineProps<{
  tubeNumber?: number
  isOutPut?: boolean
  digitIndices: number[]
  decimalPositions: number[]
  /** 新增：mini 时缩小；不传或传 normal 时保持原样 */
  size?: 'mini' | 'normal'
}>(), {
  tubeNumber: 0,
  isOutPut: false,
  size: 'normal'
})

const isMini = computed(() => props.size === 'mini')
</script>

<template>
  <div class="tubeInnerBG" :class="{ mini: isMini }">
    <div>
      <div class="wrap">
        <Digit
          v-for="(idx, i) in digitIndices"
          :key="i"
          :num="idx"
          :showDot="decimalPositions.includes(i)"
        />
      </div>
    </div>
    <span v-if="props.isOutPut">OUTPUT{{ props.tubeNumber }}</span>
  </div>
</template>

<style lang="scss" scoped>
.tubeInnerBG{
  /* 原有尺寸与布局（normal） */
  width: 32%;
  height: 45%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;

  /* 用 CSS 变量做“可缩放”的细节 */
  --scale: 1;
  --radius: 10px;     /* 内框圆角 */
  --label-size: 11px; /* 标签字号 */
  --gap: 0;           /* Digit 之间的空隙（你的 .wrap 是 space-between，这里给 0 即可） */

  transform: scale(var(--scale));
  transform-origin: center top;

  &.mini{
    /* mini：整体缩小、圆角更小、字号更小 */
    --scale: .78;     /* 想再小就调这个，比如 .72/.7 */
    --radius: 3px;
    --label-size: 5px;
  }

  > div{
    width: 100%;
    height: 80%;
    border-radius: var(--radius);
    background-color: #171717;
    display: flex;
    justify-content: center;
    align-items: center;

    .wrap{
      width: 90%;
      height: 60%;
      display: flex;
      justify-content: space-between; /* 保持你原来两端分散 */
      gap: var(--gap);
    }
  }

  span{
    color: white;
    font-size: var(--label-size);
  }
}
</style>