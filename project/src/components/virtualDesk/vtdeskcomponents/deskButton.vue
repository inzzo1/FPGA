<script setup lang="ts">
import ButtonOn  from '@/assets/Button/buttonOn.vue'
import ButtonOff from '@/assets/Button/buttonOff.vue'
import { ref, defineProps, type PropType, computed } from 'vue'
import options from '@/stores/options.json'

const props = defineProps({
  boardType: { type: String as PropType<'mini' | 'normal'>, default: 'normal' }
})
const isMini = computed(() => props.boardType === 'mini')

const buttonData = ref(options.buttonData)

/** 暴露给父级：读取当前按钮状态 */
function getState(): Record<string, number> {
  const obj: Record<string, number> = {}
  for (const item of buttonData.value) {
    const key = 'SWB' + String(item.number).padStart(2, '0')
    obj[key] = item.state ? 1 : 0
  }
  return obj
}
defineExpose({ getState })

/** 仅在可交互时才切换；mini 下直接返回（禁用） */
function onClick(idx: number) {
  if (isMini.value) return
  buttonData.value[idx].state = !buttonData.value[idx].state
}
</script>

<template>
  <div class="ButtonOutBg" :class="{ mini: isMini }">
    <div class="lineFrame">
      <div class="wrap">
        <div class="buttonFrame" v-for="(item, index) in buttonData" :key="index">
          <component
            :is="item.state ? ButtonOn : ButtonOff"
            class="btn-svg"
            :class="{ disabled: isMini }"
            :tabindex="isMini ? -1 : 0"
            aria-disabled="true"
            @click="onClick(index)"
          />
          <span class="btn-label">0{{ item.number }}</span>
        </div>
      </div>
    </div>

    <span class="title">按钮</span>
    <span class="subtitle" v-if="!isMini">—SWB</span>
  </div>
</template>

<style lang="scss" scoped>
.ButtonOutBg{
  width: 36%;
  height: 110%;
  margin-left: 5%;
  position: relative;
  overflow: visible;
  box-sizing: border-box;

  --radius: 14px;
  --dash-w: 1.5px;
  --title-size: 18px;
  --subtitle-size: 13px;
  --label-size: 13px;
  --btn-height: 70%;

  &.mini{
    --radius: 4px;
    --dash-w: 0.8px;
    --title-size: 4px;
    --subtitle-size: 1px;
    --label-size: 4px;
    --btn-height: 55%;
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
    width: 96%;
    height: 70%;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

  .buttonFrame{
    width: 10%;
    height: var(--btn-height);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    user-select: none;
  }

  .btn-svg{
    width: 110%;
    height: auto;
    &.disabled{
      pointer-events: none;      /* 禁用点击 */
      cursor: default;
      filter: grayscale(.1) brightness(.95); /* 轻微灰显，想要原样可删 */
    }
  }

  .btn-label{
    color: #FBD400;
    font-size: var(--label-size);
    font-weight: 400;
  }

  .title{
    position: absolute;
    top: 12%;
    left: 5%;
    transform: translateY(-60%);
    font-size: var(--title-size);
    line-height: 1.2;
    color: #fff;
    background: #343434;
    padding: 0 4px 2px;
    border-radius: 2px;
  }
  .subtitle{
    position: absolute;
    top: 7%;
    left: 17%;
    transform: translateY(-35%);
    font-size: var(--subtitle-size);
    line-height: 1.2;
    color: #fff;
    background: #343434;
    padding: 0 4px 2px;
    border-radius: 2px;
  }
}
</style>