<script setup lang='ts'>
    import Tube from '../../tubes/tube.vue'
</script>
    
<template>
    <div class="tubeOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <Tube :tubeNumber="5"></Tube>
                <Tube :tubeNumber="3"></Tube>
                <Tube :tubeNumber="1"></Tube>
                <Tube :tubeNumber="4"></Tube>
                <Tube :tubeNumber="2"></Tube>
                <Tube :tubeNumber="0"></Tube>
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
        height: 38%;
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