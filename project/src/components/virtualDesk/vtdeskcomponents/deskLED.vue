<script setup lang="ts">
    import LightOff from '@/assets/LED/lightOff.vue';
    import LightOn from '@/assets/LED/lightOn.vue';
import { ref } from 'vue';
    const ledNumber = ref([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])
</script>

<template>
    <div class="LEDOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <div class="smallLed" v-for="(item, index) in ledNumber" :key='index'>
                    <LightOff style="width: 90%;height: auto; transform: rotate(90deg);"></LightOff>
                    <span>
                        L{{ String(item).padStart(2, '0') }}
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