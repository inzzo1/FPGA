<script setup lang="ts">
    import LightOff from '@/assets/LED/lightOff.vue';
    import LightOn from '@/assets/LED/lightOn.vue';
    import { ref } from 'vue';

    const allLeds = ref(
        [
        [{ number: 31, name: 'R1' }, { number: 30, name: 'P2' }, { number: 29, name: 'P1' }, { number: 28, name: 'N2' }, { number: 27, name: 'M1' }, { number: 26, name: 'M2' }, { number: 25, name: 'L1' }, { number: 24, name: 'J2' }],
        [{ number: 23, name: 'G1' }, { number: 22, name: 'E1' }, { number: 21, name: 'D2' }, { number: 20, name: 'A1' }, { number: 19, name: 'L3' }, { number: 18, name: 'G3' }, { number: 17, name: 'K4' }, { number: 16, name: 'G4' }],
        [{ number: 15, name: 'K1' }, { number: 14, name: 'J1' }, { number: 13, name: 'H2' }, { number: 12, name: 'G2' }, { number: 11, name: 'F1' }, { number: 10, name: 'E2' }, { number: 9, name: 'D1' }, { number: 8, name: 'B1' }],
        [{ number: 7, name: 'R2' }, { number: 6, name: 'N3' }, { number: 5, name: 'M3' }, { number: 4, name: 'K3' }, { number: 3, name: 'H3' }, { number: 2, name: 'N4' }, { number: 1, name: 'L4' }, { number: 0, name: 'J4' }]
        ]
    )

</script>

 <template>
    <div class="introOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <div v-for="(item, index) in allLeds" class="outLay" :key="index">
                    <div v-for="(led , index) in item" :key="index" class="ledFrame">
                        <div style="display: flex; justify-content: center; height: 40%;">
                            <span style="color: white; font-size: 14px;">
                                {{ led.name }}
                            </span>
                        </div>
                        <div style="display: flex; justify-content: center;">
                            <LightOff style="width: 80%; height: auto; transform: rotate(90deg);"></LightOff>
                        </div>
                        <div style="display: flex; justify-content: center;align-items: center ; height: 50%;">
                            <span style="color: #4CA2FF; font-size: 10px;">
                                {{ led.number }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
        <span>
            LED灯
        </span>
    </div>
 </template>

 <style lang="scss" scoped>
    .introOutBg{
        width: 100%;
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
            .wrap{
                width: 100%;
                height: 80%;
                display: flex;
                flex-wrap: wrap;
                .outLay{
                width: 46%;
                margin-left: 2%;
                margin-right: 2%;
                height: 50%;
                display: flex;
                flex-wrap: wrap;
                .ledFrame{
                    width: 12.5%;
                    height: 100%;
                }
            }
            }
        }
        > span{
            color: white;
            position: absolute;
            top: -2%;
            left: 5%;
            font-size: 16px;
            background-color: #343434;
        }
    }
 </style>