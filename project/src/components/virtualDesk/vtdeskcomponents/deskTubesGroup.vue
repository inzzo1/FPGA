<script setup lang='ts'>
import { computed } from 'vue'
import Tube from '../../tubes/tube.vue'

const props = withDefaults(defineProps<{
  decimalData: string[]
  outputData:  string[]
  boardType?: 'mini' | 'normal'
}>(), {
  boardType: 'normal'
})

const isMini = computed(() => props.boardType === 'mini')

const char2idx: Record<string, number> = {
  '-': 0, '0':1,'1':2,'2':3,'3':4,'4':5,'5':6,'6':7,'7':8,'8':9,
  '9':10,'A':11,'B':12,'C':13,'D':14,'E':15,'F':16
}

const tubeData = computed(() => {
  return Array.from({ length: 6 }, (_, tubeIndex) => {
    const rawHex = props.outputData[tubeIndex] ?? '--------'
    const str = rawHex.toUpperCase().padEnd(8, '-').slice(0, 8)
    const digitIndices = str.split('').map(ch => char2idx[ch] ?? 0)

    const mask = (props.decimalData[tubeIndex] ?? '00000000').padEnd(8, '0').slice(0, 8)
    const decimalPositions: number[] = []
    mask.split('').forEach((bit, i) => { if (bit === '1') decimalPositions.push(i) })

    return { tubeNumber: tubeIndex, isOutPut: true, digitIndices, decimalPositions }
  })
})
</script>

<template>
    <div class="tubeOut-outer">
        <div class="tubeOutBg" :class="{ mini: isMini }">
            <div class="lineFrame">
                <div class="wrap">
                    <Tube 
                    v-for="cfg in tubeData"
                    :key="cfg.tubeNumber"
                    :tubeNumber="cfg.tubeNumber"
                    :isOutPut="cfg.isOutPut"
                    :digitIndices="cfg.digitIndices"
                    :decimalPositions="cfg.decimalPositions"
                    :size="isMini ? 'mini' : 'normal'" 
                    />
                </div>
            </div>
            <span>液晶数码管</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* 外层容器：负责水平居中，不缩放这个层 */
.tubeOut-outer{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;   /* 水平居中 */
  align-items: flex-start;   /* 需要垂直居中可改 center */
  overflow: hidden;
}

/* 内层主体：缩放与布局都在这里 */
.tubeOutBg{
  /* 默认（normal）尺寸变量 */
  --label-size: 20px;   /* 标题字号 */
  --scale: 1;           /* 缩放倍数 */
  --radius: 14px;       /* 线框圆角 */
  --border-w: 1.5px;    /* 线框边宽 */
  --wrap-w: 92%;        /* Tube 区域内部的宽度 */

  width: calc(90% / var(--scale));
  /* 默认整体宽度 */
  height: 100%;
  position: relative;
  overflow: hidden;
  margin: 0;            /* 居中交给 .tubeOut-outer */
  box-sizing: border-box;

  &.mini{
    /* mini：更小的标题、更小圆角、更细边、更宽一些的内容区与整体 */
    --label-size: 6px;
    --scale: .90;       /* 如果想整体再小/大可改这项 */
    --radius: 5px;      /* ← 圆角更小 */
    --border-w: 1px;    /* ← 边线更细 */
    --wrap-w: 99%;      /* ← Tube 内容更宽 */
  }

  /* 缩放围绕中心顶部，缩小后仍能居中对齐 */
  transform: scale(var(--scale));
  transform-origin: center top;

  .lineFrame{
    width: 100%;
    height: 90%;
    margin-top: calc(38% * 5 / 100);
    border-radius: var(--radius);            /* 用变量控制圆角 */
    border: var(--border-w) dashed white;    /* 用变量控制边宽 */
    display: flex;
    justify-content: center;
    align-items: flex-end;
    box-sizing: border-box;
  }

  .wrap{
    width: var(--wrap-w);   /* 用变量控制内部内容宽度 */
    height: 90%;
    display: flex;
    flex-direction: column-reverse;
    flex-wrap: wrap-reverse;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  > span{
    color: white;
    position: absolute;
    top: 1%;
    left: 4%;
    font-size: var(--label-size);
    background-color: #343434;
    line-height: 1;
    padding: 0 4px;
    border-radius: 2px;
  }
}
</style>