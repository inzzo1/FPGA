<script setup lang="ts">
    import { ref } from 'vue';


    interface InputFormType {
        input0: string;
        input1: string;
        input2: string;
        input3: string;
    }

    interface PlaceholderType {
        input0: string;
        input1: string;
        input2: string;
        input3: string;
    }

    const inputForm = ref<InputFormType>(
    {
        input0: '',
        input1: '',
        input2: '',
        input3: ''
    }
    )

    const placeholders = ref<PlaceholderType>({
        input0: '88 88 88 88',
        input1: '88 88 88 88',
        input2: '88 88 88 88',
        input3: '88 88 88 88',
    });

    const hidePlaceholder = (num: 0 | 1 | 2 | 3) => {
        const key = `input${num}` as keyof PlaceholderType;
        placeholders.value[key] = '';
    };

    const showPlaceholder = (num: 0 | 1 | 2 | 3) => {
        const formKey = `input${num}` as keyof InputFormType;
        const phKey = `input${num}` as keyof PlaceholderType;
        if (!inputForm.value[formKey]) {
            placeholders.value[phKey] = '88 88 88 88';
        }
    };

    /** 把输入格式化成十六进制两两分组的大写字符串 */
    const formatInput = (num: 0 | 1 | 2 | 3) => {
    const key = `input${num}` as keyof InputFormType;

    // 1. 去掉所有非 16 进制字符
    let value = inputForm.value[key].replace(/[^0-9a-fA-F]/g, '');

    // 2. 限制最多 8 个十六进制字符（= 4 组 “XX XX …”）
    //    如果你想改成 16 个字符（8 组），把 8 改成 16 即可
    if (value.length > 8) value = value.slice(0, 8);

    // 3. 统一转成大写
    value = value.toUpperCase();

    // 4. 每两个字符后插入一个空格（结尾不加）
    value = value.replace(/([0-9A-F]{2})(?=[0-9A-F])/g, '$1 ').trim();

    // 5. 回写到表单
    inputForm.value[key] = value;
    };
    
    // 暴露给上层调用，返回一个对象，键名可以根据你后端需要改
    function getState(): Record<string,string> {
     // 去掉空格，把16进制串恢复成连续 XXYYZZZZ
    return {
        INPUT0: inputForm.value.input0.replace(/\s/g, ''),
        INPUT1: inputForm.value.input1.replace(/\s/g, ''),
        INPUT2: inputForm.value.input2.replace(/\s/g, ''),
        INPUT3: inputForm.value.input3.replace(/\s/g, '')
        };
    }
   defineExpose({ getState });
</script>

<template>
    <div class="inputOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <div class="inputOutBox">
                    <span>
                        INPUT3:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input3"
                        @input="formatInput(3)"
                        @focus="hidePlaceholder(3)"
                        @blur="showPlaceholder(3)"
                        :placeholder="placeholders.input3"
                        type="text"
                        maxlength="14"
                        />
                    </div>
                </div>
                <div class="inputOutBox" style="margin-left: 2%; width: 48%;">
                    <span>
                        INPUT2:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input1"
                        @input="formatInput(2)"
                        @focus="hidePlaceholder(1)"
                        @blur="showPlaceholder(1)"
                        :placeholder="placeholders.input1"
                        type="text"
                        maxlength="14"
                        />
                    </div>
                </div>
                <div class="inputOutBox">
                    <span>
                        INPUT1:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input2"
                        @input="formatInput(2)"
                        @focus="hidePlaceholder(2)"
                        @blur="showPlaceholder(2)"
                        :placeholder="placeholders.input2"
                        type="text"
                        maxlength="14"
                        />
                    </div>
                </div>
                <div class="inputOutBox" style="margin-left: 2%; width: 48%;">
                    <span>
                        INPUT0:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input0"
                        @input="formatInput(0)"
                        @focus="hidePlaceholder(0)"
                        @blur="showPlaceholder(0)"
                        :placeholder="placeholders.input0"
                        type="text"
                        maxlength="14"
                        />
                    </div>
                </div>
            </div>
        </div>
        <span>
            输入框
        </span>
    </div>
</template>

<style lang="scss" scoped>
    .inputOutBg{
        width: 48%;
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
            align-items: center;
            .wrap{
                width: 94%;
                height: 70%;
                display: flex;
                flex-wrap: wrap;
                .inputOutBox{
                    width: 48%;
                    height: 50%;
                    background-color: #343434;
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: space-around;
                    align-items: center;
                    > span{
                        width: 40%;
                        color: white;
                        font-size: 14px;
                    }
                    .inputInnerBox{
                        height: 60%;
                        background-color: #6D6D6D;
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        span{
                            margin-left: 3%;
                            color: black;
                            font-size: 17px;
                        }
                        input{
                            font-size: 15px;
                            width: 76%;
                            margin-left: 4%;
                            border-radius: 5px;
                            font-family: 'Menlo', 'SFMono-Regular', 'Roboto Mono', 'Consolas', monospace;
                            padding: 0 3%;
                            border: none;
                            caret-color: transparent;
                            text-align: left;
                            &:focus {
                                outline: none;
                            }
                        }
                    }
                }
            }
        }
        > span{
            color: white;
            position: absolute;
            top: -3%;
            left: 5%;
            font-size: 18px;
            background-color: #343434;
        }
    }
</style>