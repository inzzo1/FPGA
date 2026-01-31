<script setup lang="ts">
import SwitchOff from '@/assets/Switch/switchOff.vue'
import SwitchOn  from '@/assets/Switch/switchOn.vue'
import { ref, defineProps, type PropType, computed } from 'vue'
import options from '@/stores/options.json'

const props = defineProps({
  boardType: { type: String as PropType<'mini' | 'normal'>, default: 'normal' }
})
const isMini = computed(() => props.boardType === 'mini')

const switcheData = ref(options.switcheData)

/** 暴露给父级：读取当前拨码状态 */
function getState(): Record<string, number> {
  const obj: Record<string, number> = {}
  for (const item of switcheData.value) {
    const key = 'SW' + String(item.number).padStart(2, '0')
    obj[key] = item.state ? 1 : 0
  }
  return obj
}
defineExpose({ getState })

/** 切换，仅在可交互(非 mini)时生效 */
function toggleSwitch(idx: number) {
  if (isMini.value) return           // ← mini 下禁用点击；若需可交互，删除此行
  switcheData.value[idx].state = !switcheData.value[idx].state
}
</script>

<template>
  <div class="SwitchOutBg" :class="{ mini: isMini }">
    <div class="lineFrame">
      <div class="wrap">
        <div class="switchFrame" v-for="(item, index) in switcheData" :key="index">
          <component
            :is="item.state ? SwitchOn : SwitchOff"
            class="switch-icon"
            :class="{ disabled: isMini }"
            :tabindex="isMini ? -1 : 0"
            @click="toggleSwitch(index)"
          />
          <span class="sw-label">{{ String(item.number).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
    <span class="title">拨码开关</span>
    <span class="subtitle" v-if="!isMini">—SW</span>
  </div>
</template>

<style lang="scss" scoped>
.SwitchOutBg{
  /* ===== 布局（保持你原来的正常板卡） ===== */
  width: 52%;
  height: 100%;
  margin-top: 0.5%;
  margin-left: 2%;
  position: relative;
  overflow: visible;              /* 防止标题被裁剪 */
  box-sizing: border-box;

  /* ===== 视觉变量：normal 默认值 ===== */
  --radius: 14px;                 /* 外框圆角 */
  --dash-w: 1.5px;                /* 虚线粗细 */
  --title-size: 18px;             /* 标题字号 */
  --subtitle-size: 13px;          /* 副标题字号 */
  --label-size: 12px;             /* 下方编号字号 */
  --icon-w: 140%;                 /* 拨码图标宽度（旋转后） */
  --icon-mt: 40%;                 /* 拨码图标顶部外边距 */

  /* ===== mini 模式：更小更细 ===== */
  &.mini{
    /* 不用 transform，避免和布局占位不一致 */
    --radius: 4px;
    --dash-w: 0.8px;               /* 更细的虚线 */
    --title-size: 4px;
    --subtitle-size: 3px;
    --label-size: 3px;
    --icon-w: 100%;               /* 图标更小一点 */
    --icon-mt: 22%;
  }

  .lineFrame{
    width: 100%;
    height: 88%;
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
    display: flex;
    flex-wrap: wrap;
  }

  .switchFrame{
    width: 5%;                    /* 20 个 * 5% = 100% 正好一行 */
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .switch-icon{
    width: var(--icon-w);
    height: auto;
    margin-top: var(--icon-mt);
    transform: rotate(270deg);
    transform-origin: center;
    &.disabled{
      pointer-events: none;       /* mini 下彻底禁用点击 */
      cursor: default;
      filter: grayscale(.05) brightness(.98);
    }
  }

  .sw-label{
    color: #4CA2FF;
    padding-top: 30%;
    font-size: var(--label-size);
  }

  .title{
    color: #fff;
    position: absolute;
    top: 1%;
    left: 5%;
    font-size: var(--title-size);
    background-color: #343434;
    line-height: 1;
    padding: 0 4px;
    border-radius: 2px;
  }
  .subtitle{
    color: #fff;
    position: absolute;
    top: 3%;
    left: 20%;
    font-size: var(--subtitle-size);
    background-color: #343434;
    line-height: 1;
    padding: 0 4px;
    border-radius: 2px;
  }
}
</style>