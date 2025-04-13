<script setup lang="ts">
    import SwitchOff from '@/assets/Switch/switchOff.vue';
    import SwitchOn from '@/assets/Switch/switchOn.vue';
    import { ref, defineEmits, onMounted } from 'vue';
    import options from '@/stores/options.json'


    const switcheData = ref(options.switcheData);

    const emit = defineEmits(['updateSwitchState']);
    
    function generateSwitchState():Record<string,number>{
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

        return switchObj
    }

    // 点击切换拨码开关状态
    const toggleSwitch = (index: number) => {
        switcheData.value[index].state = !switcheData.value[index].state;
        emit('updateSwitchState', generateSwitchState());

    };

    onMounted(() => {
      emit('updateSwitchState', generateSwitchState());
    });


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