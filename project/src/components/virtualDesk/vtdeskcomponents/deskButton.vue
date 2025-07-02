<script setup lang="ts">
    import ButtonOn from '@/assets/Button/buttonOn.vue';
    import ButtonOff from '@/assets/Button/buttonOff.vue';
    import { ref, defineEmits, onMounted } from 'vue';
    import options from '@/stores/options.json'


    const buttonData = ref(options.buttonData);
    
    function getState(): Record<string, number> {
        const obj: Record<string, number> = {}
        for (const item of buttonData.value) {
            const key = 'SWB' + String(item.number).padStart(2,'0')
            obj[key] = item.state ? 1 : 0
        }
        return obj
    }

    defineExpose({ getState })
    
    // 切换时只修改内部数据，不再发 emit
    function toggleButton(idx: number) {
        buttonData.value[idx].state = !buttonData.value[idx].state
    }
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
                        <span>0{{ item.number }}</span>
                    </div>
                </div>
            </div>
            <span>
                按钮
            </span>
            <span>
                —SWB
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
                        color: #FBD400;
                        font-size: 13px;
                        font-weight: 400;
                    }
                }
            }
        }
        > span:first-of-type {
            color: white;
            position: absolute;
            top: -7%;
            left: 5%;
            font-size: 18px;
            background-color: #343434;
            }
        > span:nth-of-type(2) {
            color: white;
            position: absolute;
            top: -4%;
            left: 15%;
            font-size: 13px;
            background-color: #343434;
            }
        }
</style>