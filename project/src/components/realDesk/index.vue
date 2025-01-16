<script setup lang="ts">
    import Header from '@/components/header/deskHeader.vue'
    import CpIntro from './realdeskcomponents/cpIntro.vue';
    import LedLight from './realdeskcomponents/ledLight.vue'
    import Tubes from '@/components/tubes/tube.vue'
</script>


<template>
    <div class="outline">
        <div class="outHeader">
            <div class="chips"></div>
            <div style="width: 50%; height: 100%;">
                <Header 
                :headerName= "'HDU-XL-CB502'"
                style="width: 100%; height: 40%;" 
                ></Header>
                <CpIntro
                style="width: 100%; height: 60%;"
                ></CpIntro>
            </div>
        </div>
        <div class="bodyPar1">
            <div class="LedLight">
                <LedLight>
                </LedLight>
            </div>
            <div class="rightPart">
                <div class="digitTube">
                    <Tubes
                    :isOutPut="false"
                    ></Tubes>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .outline{
        width: 50%;
        height: 60%;
        background-color: #343434;
        border-radius: 20px;
        overflow: hidden;
        .outHeader{
            width: 94%;
            height: 30%;
            margin-left: 3%;
            margin-top: 2%;
            display: flex;
            .chips{
                width: 50%;
                height: 100%;
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
                }
            }
        }
    }
</style>