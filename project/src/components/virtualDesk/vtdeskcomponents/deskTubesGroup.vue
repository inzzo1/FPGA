<script setup lang='ts'>
    import { ref } from 'vue';
    import Tube from '../../tubes/tube.vue'
    interface tubes{
        tubeNumber: number,
        isOutPut: boolean,
        showNumber: number
    }
    
    const tubeData = ref<tubes[]>(
    [
        {tubeNumber: 5, isOutPut: true, showNumber: 99999999},
        {tubeNumber: 3, isOutPut: true, showNumber: 99999999},
        {tubeNumber: 1, isOutPut: true, showNumber: 99999999},
        {tubeNumber: 4, isOutPut: true, showNumber: 99999999},
        {tubeNumber: 2, isOutPut: true, showNumber: 99999999},
        {tubeNumber: 0, isOutPut: true, showNumber: 99999999}
    ]
    )

</script>
    
<template>
    <div class="tubeOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <Tube 
                v-for="(item, index) in tubeData" 
                :key="index" 
                :tubeNumber="item.tubeNumber" 
                :isOutPut="item.isOutPut"
                :showNumber="item.showNumber"
                ></Tube>
            </div>
            <!-- <Digit1>
            </Digit1> -->
        </div>
        <span>
            液晶数码管
        </span>
    </div>
</template>
    
<style lang="scss" scoped>
    .tubeOutBg{
        width: 90%;
        height: 100%;
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
            align-items: flex-end;
            .wrap{
                width: 92%;
                height: 90%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                // background-color: aliceblue; 
            }
        }
        > span{
            color: white;
            position: absolute;
            top: 1%;
            left: 5%;
            font-size: 14px;
            background-color: #343434;
        }
    }
</style>