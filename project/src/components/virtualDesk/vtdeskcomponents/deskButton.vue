<script setup lang="ts">
    import ButtonOn from '@/assets/Button/buttonOn.vue';
    import buttonOff from '@/assets/Button/buttonOff.vue';
import { ref } from 'vue';

    const buttonNumber = ref([9,8,7,6,5,4,3,2,1,0])
</script>

<template>
        <div class="ButtonOutBg">
            <div class="lineFrame">
                <div class="wrap">
                    <div class="buttonFrame" v-for="(item, index) in buttonNumber" :key='index'>
                        <ButtonOn style="width: 110%;height: auto;"></ButtonOn>
                        <span>SWB0{{ item }}</span>
                    </div>
                </div>
            </div>
            <span>
                按钮
            </span>
        </div>
</template>

<style lang="scss" scoped>
        .ButtonOutBg{
        width: 36%;
        height: 110%;
        margin-left: 5%;
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
                margin: 0 auto;
                display: flex;
                align-items: center;
                .buttonFrame{
                    width: 10%;
                    height: 70%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    span{
                        margin-top: 20%;
                        color: #FBD400;
                        font-size: 6px;
                        font-weight: 400;
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