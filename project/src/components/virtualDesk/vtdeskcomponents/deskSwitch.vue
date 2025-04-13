<script setup lang="ts">
    import SwitchOff from '@/assets/Switch/switchOff.vue';
    import SwitchOn from '@/assets/Switch/switchOn.vue';
    import { ref, defineEmits } from 'vue';

    interface SwitchItem {
        number: number;  // 拨码开关的编号
        state: boolean;  // false 表示关（Off），true 表示开（On）
    }
    
    const switcheData = ref<SwitchItem[]>([
      
        { number: 19, state: false },
        { number: 18, state: false },
        { number: 17, state: false },
        { number: 16, state: false },
        { number: 15, state: false },
        { number: 14, state: false },
        { number: 13, state: false },
        { number: 12, state: false },
        { number: 11, state: false },
        { number: 10, state: false },
        { number: 9,  state: false },
        { number: 8,  state: false },
        { number: 7,  state: false },
        { number: 6,  state: false },
        { number: 5,  state: false },
        { number: 4,  state: false },
        { number: 3,  state: false },
        { number: 2,  state: false },
        { number: 1,  state: false },
        { number: 0,  state: false }
    ]);

    const emit = defineEmits(['updateSwitchState']);

    // 点击切换拨码开关状态
    const toggleSwitch = (index: number) => {
        switcheData.value[index].state = !switcheData.value[index].state;

        // 2) 把 switcheData.value 转成一个对象，形如：
        //    { SW00:0, SW01:1, ... }
        const switchObj: Record<string, number> = {};
        // 遍历 switcheData.value
        for (const item of switcheData.value) {
          // 比如 item.number=0 => key='SW00'
          // 如果 state=false => switchObj['SW00'] = 0
          const key = 'SW' + String(item.number).padStart(2, '0');
          switchObj[key] = item.state ? 1 : 0;
        }

        // 3) 把这个对象通过事件发给父组件
        emit('updateSwitchState', switchObj);

    };

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