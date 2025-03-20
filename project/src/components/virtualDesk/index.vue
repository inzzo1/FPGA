<script setup lang='ts'>
    import { ref, defineEmits, defineProps } from "vue";
    import Header from "../header/deskHeader.vue"
    import TubeGroup from "./vtdeskcomponents/deskTubesGroup.vue"
    import DeskInput from "./vtdeskcomponents/deskInput.vue";
    import DeskLED from "./vtdeskcomponents/deskLED.vue";
    import DeskButton from "./vtdeskcomponents/deskButton.vue";
    import DeskSwitch from "./vtdeskcomponents/deskSwitch.vue";

    // 接收从父组件（VituralBoard.vue）传进来的 ledData
    const props = defineProps({
    ledData: {
        type: Array,
        default: () => [],
    },
    });

    const buttonState = ref([]);
    const switchState = ref([]);
    const emit = defineEmits(['sendButtonState', 'sendSwitchState']);

    const updateButtonState = (data) => {
        buttonState.value = data;
        emit('sendButtonState', buttonState.value)
    }

    const updateSwitchState = (data) => {
        switchState.value = data;
        emit('sendSwitchState', switchState.value);
    };
</script>

<template>
  <div class="outline">
    <Header style="margin-top: 2%; height: 13%; width: 90%; margin-left: 5%;"></Header>
    <TubeGroup style="height: 38%;"></TubeGroup>
    <div style="height: 20%; display: flex; margin-top: 1%;">
      <DeskInput></DeskInput>
      <!-- 将父组件传进来的 ledData 传给 DeskLED -->
      <DeskLED :ledData="props.ledData"></DeskLED>
    </div>
    <div style="height: 14%; display: flex; margin-top: 1%;">
      <!-- 监听按钮更新 -->
      <DeskButton @updateButtonState="updateButtonState"></DeskButton>
      <!-- 监听拨码开关更新 -->
      <DeskSwitch @updateSwitchState="updateSwitchState"></DeskSwitch>
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