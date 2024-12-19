<script setup lang='ts'>
    import Header from "./deskcomponents/deskHeader.vue"
    import TubeGroup from "./deskcomponents/deskTubesGroup.vue"
    import DeskInput from "./deskcomponents/deskInput.vue";
</script>

<template>
    <div class="outline">
        <Header style="margin-top: 2%;"></Header>
        <TubeGroup></TubeGroup>
        <DeskInput style="margin-top: 1%;"></DeskInput>
    </div>
</template>
    
<style lang="scss" scoped>
    .outline{
        width: 50%;
        height: 60%;
        background-color: #343434;
        border-radius: 20px;
        overflow: hidden;
    }
</style>