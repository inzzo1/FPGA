<script setup lang="ts">
    
</script>

<template>
    <div class="inputOutBg">
        <div class="lineFrame">

        </div>
        <span>
            输入框
        </span>
    </div>
</template>

<style lang="scss" scoped>
    .inputOutBg{
        width: 50%;
        height: 20%;
        margin-left: 5%;
        overflow: hidden;
        position: relative;
        .lineFrame{
            width: 100%;
            height: 90%;
            margin-top: calc(38% * 5 / 100);
            border-radius: 14px;
            border: 1.5px dashed white;
        }
        > span{
            color: white;
            position: absolute;
            top: -1%;
            left: 5%;
            font-size: 14px;
            background-color: #343434;
        }
    }
</style>