<script setup lang="ts">
    import Digit from '../../assets/LED/digit1.vue'
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
            <div class="wrap">
                <Digit></Digit>
                <Digit></Digit>
                <Digit></Digit>
                <Digit></Digit>
                <Digit></Digit>
                <Digit></Digit>
                <Digit></Digit>
                <Digit></Digit>
            </div>
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