<script setup lang="ts">
    import SwitchOff from '@/assets/Switch/switchOff.vue';
    import SwitchOn from '@/assets/Switch/switchOn.vue';
import { ref } from 'vue';

    const switchNumber = ref([19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0])
</script>

<template>
    <div class="SwitchOutBg">
            <div class="lineFrame">
                <div class="wrap">
                    <div class="switchFrame" v-for="(item, index) in switchNumber" :key="index">
                        <SwitchOff style="width: 140%;height: auto;margin-top: 40%; transform: rotate(270deg);"></SwitchOff>
                        <span>SW{{ String(item).padStart(2, '0') }}</span>
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
            height: 90%;
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
                    span{
                        padding-top: 50%;
                        color: #4CA2FF;
                        font-size: 6px;
                    }
                }
            }
        }
        > span{
            color: white;
            position: absolute;
            top: -3%;
            left: 5%;
            font-size: 14px;
            background-color: #343434;
        }
        }
</style>