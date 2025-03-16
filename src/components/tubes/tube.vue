<script setup lang="ts">
    import Digit from '../../assets/LED/digit1.vue'
    import { computed } from "vue";
    const props = defineProps({
        tubeNumber:{
            type: Number,
            default: 0
        },
        isOutPut:{
            type: Boolean,
            default: false
        },
        showNumber: {
            type: Number,
            default: 99999999
        }
    })

    const digits = computed(() => {
        const str = props.showNumber.toString().padStart(8, '0');
        // 2. 分割成字符数组并返回
        return str.split(''); 
    });

</script>

<template>
    <div class="tubeInnerBG">
        <div >
            <div class="wrap">
                <Digit
                v-for="(item, index) in digits"
                :key="index"
                :num ="parseInt(item, 10) + 1"
                ></Digit>
            </div>
        </div>
        <span v-if="props.isOutPut">Output0{{ props.tubeNumber }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .tubeInnerBG{
                width: 32%; 
                height: 45%;
                display: flex;
                justify-content: flex-end;
                flex-wrap: wrap;
                > div{
                    width: 100%;
                    height: 80%;
                    border-radius: 10px;
                    background-color: #171717;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .wrap{
                        width: 90%;
                        height: 60%;
                        display: flex;
                        justify-content: space-between;
                    }
                }
                span{
                    font-size: 8px;
                    color: white;
                }
            }
</style>