<script setup lang='ts'>
    import Header from "./deskcomponents/deskHeader.vue"
    import TubeGroup from "./deskcomponents/deskTubesGroup.vue"
    import DeskInput from "./deskcomponents/deskInput.vue";
    import DeskLED from "./deskcomponents/deskLED.vue";
    import DeskButton from "./deskcomponents/deskButton.vue";
    import DeskSwitch from "./deskcomponents/deskSwitch.vue";
</script>

<template>
    <div class="outline">
        <Header style="margin-top: 2%;"></Header>
        <TubeGroup></TubeGroup>
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
        width: 50%;
        height: 60%;
        background-color: #343434;
        border-radius: 20px;
    }
</style>