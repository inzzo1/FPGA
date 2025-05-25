<script setup lang="ts">
    import Digit from '../../assets/LED/digit1.vue'
    import { computed, type PropType } from "vue";
    const props = defineProps({
        tubeNumber:       { type: Number,              default: 0 },
        isOutPut:         { type: Boolean,             default: false },
        digitIndices:     { type: Array as PropType<number[]>, default: () => [] },
        decimalPositions: { type: Array as PropType<number[]>, default: () => [] }
    })

</script>

<template>
    <div class="tubeInnerBG">
        <div >
            <div class="wrap">
                <Digit
                v-for="(idx, i) in digitIndices"
                :key="i"
                :num="idx"
                :showDot="decimalPositions.includes(i)"
                />
            </div>
        </div>
        <span v-if="props.isOutPut" :style="{fontSize: props.isOutPut? '11px' : '8px'}">OUTPUT{{ props.tubeNumber }}</span>
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
                    color: white;
                }
            }
</style>