<script setup lang="ts">
    import SwitchOff from '@/assets/Switch/switchOff.vue';
    import SwitchOn from '@/assets/Switch/switchOn.vue';
    import { ref } from 'vue';
    
    interface Switch {
        number: number
        name: string
        state: boolean
    }

    const switchList = ref<Switch[][]>([
        [{number:31, name: 'T3', state: false}, {number:30, name: 'U3', state: false}, {number:29, name: 'T4', state: false}, {number:28, name: 'V3', state: false}, {number:27, name: 'V4', state: false}, {number:26, name: 'W4', state: false}, {number:25, name: 'Y4', state: false}, {number:24, name: 'Y6', state: false}],
        [{number:23, name: 'W7', state: false}, {number:22, name: 'Y8', state: false}, {number:21, name: 'Y7', state: false}, {number:20, name: 'T1', state: false}, {number:19, name: 'U1', state: false}, {number:18, name: 'U2', state: false}, {number:17, name: 'W1', state: false}, {number:16, name: 'W2', state: false}],
        [{number:15, name: 'Y1', state: false}, {number:14, name: 'AA1', state: false}, {number:13, name: 'V2', state: false}, {number:12, name: 'Y2', state: false}, {number:11, name: 'AB1', state: false}, {number:10, name: 'AB2', state: false}, {number:9, name: 'AB3', state: false}, {number:8, name: 'AB5', state: false}],
        [{number:7, name: 'AA6', state: false}, {number:6, name: 'R2', state: false}, {number:5, name: 'R3', state: false}, {number:4, name: 'T6', state: false}, {number:3, name: 'R6', state: false}, {number:2, name: 'U7', state: false}, {number:1, name: 'AB7', state: false}, {number:0, name: 'AB8', state: false}]
    ])

    const toggleSwitch = (switchItem: Switch) => {
        switchItem.state = !switchItem.state;  
    };

</script>

<template>
    <div class="buttonOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <div v-for="(item, index) in switchList" :key="index" class="outLay">
                    <div v-for="(switchItem, index) in item" :key="index" class="switch">
                        <div 
                        style="width: 100%; 
                        height: 30%; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center;">
                            <span style="color: white; font-size: 9px;">
                                {{ switchItem.name }}
                            </span>
                        </div>
                        <div 
                        style="width: 120%; 
                        height: 33%; 
                        margin-left: -10%; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center;">
                            <component 
                            :is="switchItem.state ? SwitchOn : SwitchOff" 
                            @click="toggleSwitch(switchItem)"
                            style="transform: rotate(-90deg);" />
                        </div>
                        <div 
                        style="width: 100%; 
                        height: 36%; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center;">
                            <span style="color: #4CA2FF; font-size: 8px;">
                                {{ switchItem.number }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span>
            拨码开关
        </span>
    </div>
</template>

<style lang="scss" scoped>
    .buttonOutBg{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .lineFrame{
            width: 100%;
            height: 86%;
            margin-top: calc(38% * 5 / 100);
            border-radius: 14px;
            border: 1.5px dashed white;
            display: flex;
            align-items: center;
            justify-content: center;
            .wrap{
                width: 98%;
                height: 80%;
                margin: 0, auto;
                display: flex;
            }
            .outLay{
                width: 23%;
                height: 100%;
                margin: 0 1% 0 1%;
                display: flex;
                .switch{
                    width: 12.5%;
                    height: 100%;
                    overflow: hidden;
                    user-select: none;
                }
            }
        }
        > span{
            color: white;
            position: absolute;
            top: 2%;
            left: 3%;
            font-size: 16px;
            background-color: #343434;
        }
    }
</style>