<script setup lang="ts">
import Header from '@/components/header/deskHeader.vue'
import CpIntro from './realdeskcomponents/deskCpIntro.vue';
import LedLight from './realdeskcomponents/deskLedLight.vue'
import Tubes from '@/components/tubes/tube.vue'
import Button from './realdeskcomponents/deskButton.vue';
import deskSwitch from './realdeskcomponents/deskSwitch.vue';
import { defineProps, ref, type PropType } from 'vue'

const props = defineProps({
  ledBits: { type: Array as PropType<number[]>, default: () => [] }
})

const btnComp = ref<InstanceType<typeof Button>>()
const swComp = ref<InstanceType<typeof deskSwitch>>()

// Tubes 组件现在使用 digitIndices/decimalPositions，不再使用旧的 showNumber
const digitIndices = [0, 0, 0, 0, 0, 0, 0, 0] // 8 个“-”
const decimalPositions: number[] = []

const getAllStates = () => ({
  switchButtonStatus: swComp.value?.getStatusString?.() || '0'.repeat(32),
  tapButtonStatus: btnComp.value?.getStatusString?.() || '0'.repeat(8)
})

const setProcessedButtonString = (status: string) => {
  btnComp.value?.setStatusFromString?.(status)
}

const setProcessedSwitchString = (status: string) => {
  swComp.value?.setStatusFromString?.(status)
}

const setProcessedStatus = (switchStatus: string, buttonStatus: string) => {
  setProcessedSwitchString(switchStatus)
  setProcessedButtonString(buttonStatus)
}

const resetDeskStates = () => {
  btnComp.value?.resetStates?.()
  swComp.value?.resetStates?.()
}

defineExpose({
  getAllStates,
  setProcessedButtonString,
  setProcessedSwitchString,
  setProcessedStatus,
  resetDeskStates
})
</script>


<template>
    <div class="outline">
        <div class="outHeader">
            <div class="chips">
                <img src="@/assets/MCU.png" alt="MCU.pic" class="MCU">
                <img src="@/assets/resistance-group.png" alt="resistance-group.pic" class="resistance">
                <img src="@/assets/chips.png" alt="chips.pic" class="innerChips">
            </div>
            <div style="width: 50%; height: 100%;">
                <Header 
                :headerName= "'HDU-XL-CB502'"
                boardType="real"
                style="width: 100%; height: 40%;" 
                ></Header>
                <CpIntro
                style="width: 100%; height: 60%;"
                ></CpIntro>
            </div>
        </div>
        <div class="bodyPar1">
            <div class="LedLight">
                <LedLight :ledBits="props.ledBits">
                </LedLight>
            </div>
            <div class="rightPart">
                <div class="digitTube">
                    <Tubes
                    :isOutPut="false"
                    :digitIndices="digitIndices"
                    :decimalPositions="decimalPositions"
                    style="width: 100%; height: 120%; margin-top: 3%;"
                    ></Tubes>
                </div>
                <div class="button">
                    <Button ref="btnComp"></Button>
                </div>
            </div>
        </div>
        <div class="bodyPar2">
            <deskSwitch ref="swComp"></deskSwitch>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .outline{
        width: 98%;
        height: 100%;
        background-color: #343434;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 10px 10px 15px 0px rgba(0, 0, 0, 0.8);
        .outHeader{
            width: 94%;
            height: 30%;
            margin-left: 3%;
            margin-top: 2%;
            display: flex;
            .chips{
                width: 50%;
                height: 100%;
                position: relative;
                .MCU{
                    position: absolute;
                    top: 10%;
                    left: 0;
                }
                .resistance{
                    width: 55%;
                    position: absolute;
                    top: 20%;
                    left: 40%;
                }
                .innerChips{
                    position: absolute;
                    top: 20%;
                    left: 53%;
                }
            }
        }
        .bodyPar1{
            width: 94%;
            height: 36%;
            margin-left: 3%;
            margin-top: 2%;
            display: flex;
            .LedLight{
                width: 59%;
                height: 100%;
            }
            .rightPart{
                width: 40%;
                margin-left: 1%;
                .digitTube{
                    width: 100%;
                    height: 50%;
                    overflow: hidden;
                }
                .button{
                    width: 100%;
                    height: 40%;
                    margin-top: 3%;
                }
            }
        }
        .bodyPar2{
            width: 94%;
            height: 22%;
            margin-left: 3%;
        }
    }
</style>
