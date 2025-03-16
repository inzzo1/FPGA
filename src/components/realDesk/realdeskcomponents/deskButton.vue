<script setup lang="ts">
    import buttonOn from '@/assets/Button/buttonOn.vue';
    import buttonOff from '@/assets/Button/buttonOff.vue';
    import { ref } from 'vue';

    interface Button {
        name: string;
        state: boolean;
    }

    const buttonList = ref<Button[][]>([
        [{name:'R4', state: false}, {name:'AA4', state: false}, {name:'AB6', state: false}, {name:'T5', state: false} ],
        [{name:'V8', state: false}, {name:'AA8', state: false}, {name:'V9', state: false}, {name:'Y9', state: false}]
    ])

    const toggleButton = (button: Button) => {
        button.state = !button.state;  // 切换按钮状态
    };
</script>

<template>
    <div class="buttonOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <div v-for="(item, index) in buttonList" class="outLay" :key="index">
                    <div v-for="(button, index) in item" :key="index" class="button">
                        <div style="width: 100%; height: 60%; display: flex; justify-content: center;">
                            <component 
                            :is="button.state ? buttonOn : buttonOff" 
                            @click="toggleButton(button)"
                            style="width: 80%; height: auto;" />
                        </div>
                        <div style="width: 100%; height: 40%; display: flex; justify-content: center;align-items: center;">
                            <span>{{ button.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span>
            按钮
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
            height: 90%;
            margin-top: calc(38% * 5 / 100);
            border-radius: 14px;
            border: 1.5px dashed white;
            display: flex;
            align-items: center;
            justify-content: center;
            .wrap{
                width: 90%;
                height: 70%;
                margin: 0, auto;
                display: flex;
                .outLay{
                    width: 48%;
                    height: 100%;
                    margin-left: 1%;
                    margin-right: 1%;
                    display: flex;
                    .button{
                        width: 25%;
                        height: 100%;
                        user-select: none;
                        span{
                            color: white;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        > span{
            color: white;
            position: absolute;
            top: -4%;
            left: 5%;
            font-size: 14px;
            background-color: #343434;
        }
    }
</style>