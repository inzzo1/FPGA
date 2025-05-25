<script setup lang="ts">
    import SwitchOff from '@/assets/Switch/switchOff.vue';
    import SwitchOn from '@/assets/Switch/switchOn.vue';
    import { ref, defineEmits, onMounted } from 'vue';
    import options from '@/stores/options.json'


    const switcheData = ref(options.switcheData);

    function getState(): Record<string, number> {
        const obj: Record<string, number> = {}
        for (const item of switcheData.value) {
            const key = 'SW' + String(item.number).padStart(2,'0')
            obj[key] = item.state ? 1 : 0
        }
        return obj
    }

    defineExpose({ getState })

    function toggleSwitch(idx: number) {
        switcheData.value[idx].state = !switcheData.value[idx].state
    }

</script>

<template>
    <div class="SwitchOutBg">
      <div class="lineFrame">
        <div class="wrap">
          <div class="switchFrame" v-for="(item, index) in switcheData" :key="index">
            <component
              :is="item.state ? SwitchOn : SwitchOff"
              style="width: 140%; height: auto; margin-top: 40%; transform: rotate(270deg);"
              @click="toggleSwitch(index)"
            />
            <span>SW{{ String(item.number).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
      <span>
        拨码开关
      </span>
    </div>
  </template>

<style lang="scss" scoped>
    .SwitchOutBg{
        width: 52%;
        height: 100%;
        margin-top: 0.5%;
        margin-left: 2%;
        overflow: hidden;
        position: relative;
        .lineFrame{
            width: 100%;
            height: 88%;
            margin-top: calc(38% * 5 / 100);
            border-radius: 14px;
            border: 1.5px dashed white;
            display: flex;
            justify-content: center;
            align-items: center;
            .wrap{
                width: 96%;
                height: 70%;
                display: flex;
                flex-wrap: wrap;
                .switchFrame{
                    width: 5%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    user-select: none;
                    span{
                        padding-top: 50%;
                        color: #4CA2FF;
                        font-size: 8px;
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