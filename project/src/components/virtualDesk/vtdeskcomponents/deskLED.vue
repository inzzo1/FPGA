<script setup lang="ts">
import LightOff from '@/assets/LED/lightOff.vue';
import LightOn from '@/assets/LED/lightOn.vue';
import { defineProps, computed } from 'vue';

const props = defineProps({
  ledData: {
    type: Array,
    default: () => [],
  }
});

// 当父组件传来的 ledData 为空时，用一个默认的 20 个 0 替代
const computedLedData = computed(() =>
  props.ledData.length > 0
    ? props.ledData
    : new Array(20).fill(0)
);

// 先倒序，再把「原始 index」打包进来
const reversedLed = computed(() =>
  computedLedData.value
    .slice()                      // 复制一份
    .reverse()                    // 倒序
    .map((bit, idx) => ({
      bit,
      originalIndex: computedLedData.value.length - 1 - idx
    }))
);
</script>

<template>
  <div class="LEDOutBg">
    <div class="lineFrame">
      <div class="wrap">
        <div
          class="smallLed"
          v-for="(item, i) in reversedLed"
          :key="i"
        >
          <component
            :is="item.bit ? LightOn : LightOff"
            style="width: 90%; height: auto; transform: rotate(90deg);transform-origin: center;"
          ></component>
          <span>
            L{{ String(item.originalIndex).padStart(2, '0') }}
          </span>
        </div>
      </div>
    </div>
    <span>
        LED灯
    </span>
  </div>
</template>

<style lang="scss" scoped>
    .LEDOutBg{
        width: 40%;
        height: 110%;
        margin-left: 2%;
        overflow: hidden;
        position: relative;
        .lineFrame{
            width: 100%;
            height: 90%;
            margin-top: calc(38% * 5 / 100);
            border-radius: 14px;
            border: 1.5px dashed white;
            display: flex;
            justify-content: center;
            align-items: center;
            .wrap{
                width: 90%;
                height: 76%;
                display: flex;
                flex-wrap: wrap;
                .smallLed{
                    width: 10%;
                    height: 50%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin-top: 2%;
                    span{
                        font-size: 10px;
                        font-weight: 600;
                        color: #09EDFF;
                        margin-top: 20%;
                    }
                }
            }
        }
        > span{
            color: white;
            position: absolute;
            top: -3%;
            left: 5%;
            font-size: 18px;
            background-color: #343434;
        }
    }
</style>