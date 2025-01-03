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

    const formatInput = (num: 0 | 1 | 2 | 3) => {
        const key = `input${num}` as keyof InputFormType;

        let value = inputForm.value[key].replace(/\D/g, ''); // 移除非数字字符

        if (value.length > 8) {
            value = value.slice(0, 8); // 限制输入字符最多8对数字
        }
        // 格式化成每两个数字之间有一个空格
        value = value.replace(/(\d{2})(?=\d)/g, '$1 ').trim();

        inputForm.value[key] = value;
    };
</script>

<template>
    <div class="inputOutBg">
        <div class="lineFrame">
            <div class="wrap">
                <div class="inputOutBox">
                    <span>
                        Input3:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input3"
                        @input="formatInput(3)"
                        @focus="hidePlaceholder"
                        @blur="showPlaceholder(3)"
                        :placeholder="placeholders.input3"
                        type="text"
                        maxlength="14"
                        />
                    </div>
                </div>
                <div class="inputOutBox" style="margin-left: 2%; width: 48%;">
                    <span>
                        Input1:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input1"
                        @input="formatInput(1)"
                        @focus="hidePlaceholder"
                        @blur="showPlaceholder(1)"
                        :placeholder="placeholders.input1"
                        type="text"
                        maxlength="14"
                        />
                    </div>
                </div>
                <div class="inputOutBox">
                    <span>
                        Input2:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input2"
                        @input="formatInput(2)"
                        @focus="hidePlaceholder"
                        @blur="showPlaceholder(2)"
                        :placeholder="placeholders.input2"
                        type="text"
                        maxlength="14"
                        />
                    </div>
                </div>
                <div class="inputOutBox" style="margin-left: 2%; width: 48%;">
                    <span>
                        Input0:
                    </span>
                    <div class="inputInnerBox">
                        <span>0x</span>
                        <input
                        v-model="inputForm.input0"
                        @input="formatInput(0)"
                        @focus="hidePlaceholder"
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
                    width: 50%;
                    height: 50%;
                    background-color: #343434;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    > span{
                        width: 40%;
                        color: white;
                        font-size: 13px;
                    }
                    .inputInnerBox{
                        height: 60%;
                        background-color: #6D6D6D;
                        border-radius: 5px;
                        display: flex;
                        span{
                            margin-left: 3%;
                            color: black;
                            font-size: 13px;
                        }
                        input{
                            font-size: 14px;
                            width: 77%;
                            margin-left: 3%;
                            border-radius: 5px;
                            padding: 0 6%;
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
            top: -1%;
            left: 5%;
            font-size: 14px;
            background-color: #343434;
        }
    }
</style>