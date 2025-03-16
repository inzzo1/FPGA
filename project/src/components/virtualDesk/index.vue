<script setup lang='ts'>
    import Header from "../header/deskHeader.vue"
    import TubeGroup from "./vtdeskcomponents/deskTubesGroup.vue"
    import DeskInput from "./vtdeskcomponents/deskInput.vue";
    import DeskLED from "./vtdeskcomponents/deskLED.vue";
    import DeskButton from "./vtdeskcomponents/deskButton.vue";
    import DeskSwitch from "./vtdeskcomponents/deskSwitch.vue";
</script>

<template>
    <div class="outline">
        <Header style="margin-top: 2%; height: 13%; width: 90%;margin-left: 5%;"></Header>
        <TubeGroup style="height: 38%;"></TubeGroup>
        <div style="height: 20%; display: flex; margin-top: 1%;">
            <DeskInput ></DeskInput>
            <DeskLED></DeskLED>
        </div>
        <div style="height: 14%; display: flex; margin-top: 1%;">
            <DeskButton></DeskButton>
            <DeskSwitch></DeskSwitch>
        </div>
    </div>
</template>
    
<style lang="scss" scoped>
    .outline{
        width: 100%;
        height: 100%;
        background-color: #343434;
        border-radius: 20px;
        overflow: hidden;

    }
</style>