<script setup lang="ts">
    import buttonOn from '@/assets/Button/buttonOn.vue';
    import buttonOff from '@/assets/Button/buttonOff.vue';
    import { ref } from 'vue';

    interface Button {
        name: string;
        state: boolean;
        btIndex: number;
    }

    const buttonList = ref<Button[][]>([
        [{name:'R4', state: false, btIndex: 7}, {name:'AA4', state: false, btIndex: 6}, {name:'AB6', state: false, btIndex: 5}, {name:'T5', state: false, btIndex: 4} ],
        [{name:'V8', state: false, btIndex: 3}, {name:'AA8', state: false, btIndex: 2}, {name:'V9', state: false, btIndex: 1}, {name:'Y9', state: false, btIndex: 0}]
    ])

    const toggleButton = (button: Button) => {
        button.state = !button.state;  // 切换按钮状态
    };

    const flatButtonList = () => buttonList.value.flat()

    // 8 位字符串，顺序：BT0 -> BT7
    const getStatusString = () => {
        return Array.from({ length: 8 }, (_, index) => {
            const target = flatButtonList().find(item => item.btIndex === index)
            return target?.state ? '1' : '0'
        }).join('')
    }

    const setStatusFromString = (status: string) => {
        if (!status || typeof status !== 'string') return
        const normalized = status.trim().padEnd(8, '0').slice(0, 8)
        const map = new Map<number, boolean>()
        normalized.split('').forEach((bit, idx) => {
            map.set(idx, bit === '1')
        })
        for (const item of flatButtonList()) {
            item.state = map.get(item.btIndex) ?? false
        }
    }

    const resetStates = () => {
        for (const item of flatButtonList()) {
            item.state = false
        }
    }

    defineExpose({ getStatusString, setStatusFromString, resetStates })
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
