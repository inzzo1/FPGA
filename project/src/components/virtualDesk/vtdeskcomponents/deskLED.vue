<script setup lang="ts">
import LightOff from '@/assets/LED/lightOff.vue'
import LightOn  from '@/assets/LED/lightOn.vue'
import { defineProps, computed, type PropType } from 'vue'

const props = defineProps({
  ledData:   { type: Array as PropType<number[]>, default: () => [] },
  boardType: { type: String as PropType<'mini'|'normal'>, default: 'normal' }
})
const isMini = computed(() => props.boardType === 'mini')

// ledData 为空时用 20 个 0 占位
const computedLedData = computed<number[]>(() =>
  (props.ledData?.length ?? 0) > 0 ? (props.ledData as number[]) : new Array(20).fill(0)
)

// 倒序，并带上原始下标
const reversedLed = computed(() =>
  computedLedData.value
    .slice()
    .reverse()
    .map((bit, idx) => ({
      bit,
      originalIndex: computedLedData.value.length - 1 - idx
    }))
)
</script>

<template>
  <div class="LEDOutBg" :class="{ mini: isMini }">
    <div class="lineFrame">
      <div class="wrap">
        <div class="smallLed" v-for="(item, i) in reversedLed" :key="i">
          <component :is="item.bit ? LightOn : LightOff" class="led-icon" />
          <span class="led-label">L{{ String(item.originalIndex).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
    <span class="title">LED灯</span>
  </div>
</template>

<style lang="scss" scoped>
.LEDOutBg{
  /* normal：右侧区域（保持你原来的 40% + 左 2%） */
  width: 40%;
  height: 100%;
  margin-left: 2%;
  position: relative;
  overflow: visible;
  box-sizing: border-box;

  /* normal 变量 */
  --radius: 14px;
  --dash-w: 1.5px;
  --title-size: 18px;
  --label-size: 10px;

  /* mini：同样不要 scale，只缩小内部视觉变量；
     宽度改为 48%，配合左侧输入框 48% + 中间 2% 间距 */
  &.mini{
    width: 40%;
    margin-left: 2%;
    /* ✗ 不要 transform */
    --radius: 4px;
    --dash-w: 0.8px;
    --title-size: 4px;
    --label-size: 3px;
  }

  .lineFrame{
    width: 100%;
    height: 90%;
    margin-top: calc(38% * 5 / 100);
    border-radius: var(--radius);
    border: var(--dash-w) dashed #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wrap{
    width: 90%;
    height: 76%;
    display: flex;
    flex-wrap: wrap;
  }

  .smallLed{
    width: 10%;
    height: 50%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 2%;
  }

  .led-icon{
    width: 90%;
    height: auto;
    transform: rotate(90deg);
    transform-origin: center;
  }

  .led-label{
    margin-top: 20%;
    font-size: var(--label-size);
    font-weight: 600;
    color: #09EDFF;
  }

  .title{
    position: absolute;
    top: -3%;
    left: 5%;
    font-size: var(--title-size);
    color: #fff;
    background-color: #343434;
    line-height: 1;
    padding: 0 4px;
    border-radius: 2px;
  }
}
</style>