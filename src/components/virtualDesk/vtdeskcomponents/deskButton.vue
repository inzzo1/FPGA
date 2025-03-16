<script setup lang="ts">
    import ButtonOn from '@/assets/Button/buttonOn.vue';
    import ButtonOff from '@/assets/Button/buttonOff.vue';
    import { ref } from 'vue';

    interface ButtonItem {
        number: number;  // 原先你的按钮编号
        state: boolean;  // 记录该按钮的开关状态
    }

    const buttonData = ref<ButtonItem[]>([
        { number: 9, state: false },
        { number: 8, state: false },
        { number: 7, state: false },
        { number: 6, state: false },
        { number: 5, state: false },
        { number: 4, state: false },
        { number: 3, state: false },
        { number: 2, state: false },
        { number: 1, state: false },
        { number: 0, state: false },
    ]);
    
    //点击切换按钮状态
    const toggleButton = (index: number) => {
        buttonData.value[index].state = !buttonData.value[index].state;
    };
</script>

<template>
        <div class="ButtonOutBg">
            <div class="lineFrame">
                <div class="wrap">
                    <div class="buttonFrame" v-for="(item, index) in buttonData" :key='index'>
                        <component
                        :is="item.state ? ButtonOn : ButtonOff"
                        @click="toggleButton(index)"
                        style="width: 110%; height: auto;"
                        />
                        <span>SWB0{{ item.number }}</span>
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
                    user-select: none;
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