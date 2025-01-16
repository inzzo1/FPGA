<script setup lang="ts">
    import ButtonOn from '@/assets/Button/buttonOn.vue';
    import ButtonOff from '@/assets/Button/buttonOff.vue';
    import LightOff from '@/assets/LED/lightOff.vue';
    import LightOn from '@/assets/LED/lightOn.vue';
    import SwitchOff from '@/assets/Switch/switchOff.vue';
    import SwitchOn from '@/assets/Switch/switchOn.vue';
    
</script>

<template>
    <div class="introOutBg">
        <div class="lineFrame">
            <div class="introItem">
                <div>
                    <SwitchOn style="width: 40%; height: auto;"></SwitchOn>
                    <span>拨码开关(On)</span>
                </div>
                <div>
                    <SwitchOff style="width: 40%; height: auto;"></SwitchOff>
                    <span>拨码开关(Off)</span>
                </div>
            </div>
            <div class="introItem">
                <div>
                    <LightOn style="width: 20%; height: auto; transform: rotate(90deg);"></LightOn>
                    <span>LED(打开)</span>
                </div>
                <div>
                    <LightOff style="width: 16%; height: auto; transform: rotate(90deg)"></LightOff>
                    <span>LED(关闭)</span>
                </div>
            </div>
            <div class="introItem">
                <div>
                    <ButtonOff style="width: 30%; height: auto;"></ButtonOff>
                    <span>按钮(松开)</span>
                </div>
                <div>
                    <ButtonOn style="width: 30%; height: auto;"></ButtonOn>
                    <span>按钮(按下)</span>
                </div>
            </div>
        </div>
        <span>
            组件说明
        </span>
    </div>
</template>

<style lang="scss" scoped>
.introOutBg{
        width: 90%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .lineFrame{
            width: 100%;
            height: 90%;
            margin-top: calc(38% * 5 / 100);
            border-radius: 14px;
            border: 1.5px dashed white;
            display: flex;
            align-items: center;
            justify-content: center;
            .introItem{
                width: 33%;
                height: 60%;
                div{
                    width: 100%;
                    height: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span{
                    color: white;
                    font-size: 10px;
                    }
                }
            }
        }
        > span{
            color: white;
            position: absolute;
            top: -3%;
            left: 5%;
            font-size: 14px;
            background-color: #343434;
        }
    }
    
</style>