<script setup lang="ts">
    const props = defineProps({
        tubeNumber:{
            type:Number,
            default: 0
        }
    })
</script>

<template>
    <div class="tubeInnerBG">
        <div >
        </div>
        <span>Output0{{ props.tubeNumber }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .tubeInnerBG{
                width: 32%; 
                height: 45%;
                display: flex;
                justify-content: flex-end;
                flex-wrap: wrap;
                div{
                    width: 100%;
                    height: 80%;
                    border-radius: 10px;
                    background-color: #171717;
                }
                span{
                    font-size: 8px;
                    color: white;
                }
            }
</style>