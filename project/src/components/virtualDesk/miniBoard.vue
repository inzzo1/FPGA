<script setup lang='ts'>
    import { ref, defineEmits, defineProps, type PropType } from "vue";
    import Header from "../header/deskHeader.vue"
    import TubeGroup from "./vtdeskcomponents/deskTubesGroup.vue"
    import DeskInput from "./vtdeskcomponents/deskInput.vue";
    import DeskLED from "./vtdeskcomponents/deskLED.vue";
    import DeskButton from "./vtdeskcomponents/deskButton.vue";
    import DeskSwitch from "./vtdeskcomponents/deskSwitch.vue";

    // 接收从父组件（VituralBoard.vue）传进来的 ledData
    const props = defineProps({
      ledData:     { type: Array as PropType<number[]>, default: () => [] },
      decimalData: { type: Array as PropType<string[]>, default: () => [] },
      outputData:  { type: Array as PropType<string[]>, default: () => [] }
    })

    // 拿到子组件实例
    const btnComp = ref<InstanceType<typeof DeskButton>>()
    const swComp  = ref<InstanceType<typeof DeskSwitch>>()
    const inComp  = ref<InstanceType<typeof DeskInput>>()

    // 对外暴露：一次拿齐所有状态
    function getAllStates() {
      return {
        button: btnComp.value?.getState()  || {},
        sw:     swComp.value?.getState()   || {},
        input:  inComp.value?.getState()   || {}
      }
    }
    defineExpose({ getAllStates })
</script>

<template>
  <div class="outline">
    <Header style="margin-top: 2%; height: 13%; width: 90%; margin-left: 5%; " boardType="mini"></Header>
    <TubeGroup 
    style="height: 38%;"
    :decimalData="props.decimalData"
    :outputData="props.outputData"
    boardType="mini"
    >
    </TubeGroup>
    <div style="height: 20%; display: flex; margin-top: 1%;">
      <DeskInput ref="inComp" boardType="mini"></DeskInput>
      <!-- 将父组件传进来的 ledData 传给 DeskLED -->
      <DeskLED :ledData="props.ledData" boardType="mini"></DeskLED>
    </div>
    <div style="height: 14%; display: flex; margin-top: 1%;">
      <!-- 监听按钮更新 -->
      <DeskButton ref="btnComp" boardType="mini"></DeskButton>
      <!-- 监听拨码开关更新 -->
      <DeskSwitch ref="swComp" boardType="mini"></DeskSwitch>
    </div>
  </div>
</template>
<style lang="scss" scoped>
    .outline{
        width: 100%;
        height: 100%;
        background-color: #343434;        
        overflow: hidden;
    }
</style>