<script setup lang='ts'>
    import { ref, computed } from 'vue';
    import Tube from '../../tubes/tube.vue'
    
    const props = defineProps<{
        decimalData: string[]  // ["00001101", …]
        outputData:  string[]  // ["1A2B3C4D", …]
    }>()
    
    // Hex->segament 下标映射表
    const char2idx: Record<string, number> = {
        '-': 0, '0':1,'1':2,'2':3,'3':4,'4':5,'5':6,'6':7,'7':8,'8':9,
        '9':10,'A':11,'B':12,'C':13,'D':14,'E':15,'F':16
    }

    const tubeData = computed(() => {
        // 总是渲染 6 根管
        return Array.from({ length: 6 }, (_, tubeIndex) => {
            // 如果 props.outputData 不足 6 个，hexStr 会 fallback
            const rawHex = props.outputData[tubeIndex] ?? '--------'
            // 转大写并保持 8 字符，右边补 '-' 保证都是 8
            const str = rawHex.toUpperCase().padEnd(8, '-').slice(0, 8)
            const digitIndices = str.split('').map(ch => char2idx[ch] ?? 0)

            // 同理，对 decimalData 做防越界 fallback
            const mask = (props.decimalData[tubeIndex] ?? '00000000')
            .padEnd(8, '0')
            .slice(0, 8)
            const decimalPositions: number[] = []
            mask.split('').forEach((bit, i) => {
            if (bit === '1') decimalPositions.push(i)
            })

            return {
            tubeNumber: tubeIndex,
            isOutPut:   true,
            digitIndices,
            decimalPositions
            }
        })
    })
</script>
    
<template>
    <div class="tubeOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <Tube 
                v-for="cfg in tubeData"
                :key="cfg.tubeNumber"
                :tubeNumber="cfg.tubeNumber"
                :isOutPut="cfg.isOutPut"
                :digitIndices="cfg.digitIndices"
                :decimalPositions="cfg.decimalPositions"
                ></Tube>
            </div>
            <!-- <Digit1>
            </Digit1> -->
        </div>
        <span>
            液晶数码管
        </span>
    </div>
</template>
    
<style lang="scss" scoped>
    .tubeOutBg{
        width: 90%;
        height: 100%;
        margin-left: 5%;
        overflow: hidden;
        position: relative;
        .lineFrame{
            width: 100%;
            height: 90%;
            margin-top: calc(38% * 5 / 100);
            border-radius: 14px;
            border: 1.5px dashed white;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            .wrap{
                width: 92%;
                height: 90%;
                display: flex;
                flex-direction: column-reverse;
                flex-wrap: wrap-reverse;
                justify-content: center;
                align-items: center;
                // background-color: aliceblue; 
            }
        }
        > span{
            color: white;
            position: absolute;
            top: 1%;
            left: 4%;
            font-size: 20px;
            background-color: #343434;
        }
    }
</style>