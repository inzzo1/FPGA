<script setup lang="ts">
import { ref, type PropType, computed } from 'vue'

interface InputFormType { input0: string; input1: string; input2: string; input3: string; }
interface PlaceholderType { input0: string; input1: string; input2: string; input3: string; }

const props = defineProps({
  boardType: { type: String as PropType<'mini' | 'normal'>, default: 'normal' }
})
const isMini = computed(() => props.boardType === 'mini')

const inputForm = ref<InputFormType>({ input0: '', input1: '', input2: '', input3: '' })
const placeholders = ref<PlaceholderType>({
  input0: '88 88 88 88', input1: '88 88 88 88', input2: '88 88 88 88', input3: '88 88 88 88'
})

const hidePlaceholder = (num: 0|1|2|3) => { if (isMini.value) return; placeholders.value[`input${num}` as keyof PlaceholderType] = '' }
const showPlaceholder = (num: 0|1|2|3) => {
  if (isMini.value) return
  const k = `input${num}`
  if (!inputForm.value[k as keyof InputFormType]) placeholders.value[k as keyof PlaceholderType] = '88 88 88 88'
}
const formatInput = (num: 0|1|2|3) => {
  if (isMini.value) return
  const k = `input${num}` as keyof InputFormType
  let v = inputForm.value[k].replace(/[^0-9a-fA-F]/g, '')
  if (v.length > 8) v = v.slice(0, 8)
  v = v.toUpperCase().replace(/([0-9A-F]{2})(?=[0-9A-F])/g, '$1 ').trim()
  inputForm.value[k] = v
}

function getState(): Record<string,string> {
  return {
    INPUT0: inputForm.value.input0.replace(/\s/g, ''),
    INPUT1: inputForm.value.input1.replace(/\s/g, ''),
    INPUT2: inputForm.value.input2.replace(/\s/g, ''),
    INPUT3: inputForm.value.input3.replace(/\s/g, '')
  }
}
defineExpose({ getState })
</script>

<template>
  <div class="inputOutBg" :class="{ mini: isMini }">
    <div class="lineFrame">
      <div class="wrap">
        <div class="inputOutBox">
          <span>INPUT3:</span>
          <div class="inputInnerBox" :class="{ disabled: isMini }">
            <span>0x</span>
            <input
              v-model="inputForm.input3" :disabled="isMini" :tabindex="isMini ? -1 : 0"
              @input="formatInput(3)" @focus="hidePlaceholder(3)" @blur="showPlaceholder(3)"
              :placeholder="placeholders.input3" type="text" maxlength="14"
            />
          </div>
        </div>

        <div class="inputOutBox">
          <span>INPUT2:</span>
          <div class="inputInnerBox" :class="{ disabled: isMini }">
            <span>0x</span>
            <input
              v-model="inputForm.input2" :disabled="isMini" :tabindex="isMini ? -1 : 0"
              @input="formatInput(2)" @focus="hidePlaceholder(2)" @blur="showPlaceholder(2)"
              :placeholder="placeholders.input2" type="text" maxlength="14"
            />
          </div>
        </div>

        <div class="inputOutBox">
          <span>INPUT1:</span>
          <div class="inputInnerBox" :class="{ disabled: isMini }">
            <span>0x</span>
            <input
              v-model="inputForm.input1" :disabled="isMini" :tabindex="isMini ? -1 : 0"
              @input="formatInput(1)" @focus="hidePlaceholder(1)" @blur="showPlaceholder(1)"
              :placeholder="placeholders.input1" type="text" maxlength="14"
            />
          </div>
        </div>

        <div class="inputOutBox">
          <span>INPUT0:</span>
          <div class="inputInnerBox" :class="{ disabled: isMini }">
            <span>0x</span>
            <input
              v-model="inputForm.input0" :disabled="isMini" :tabindex="isMini ? -1 : 0"
              @input="formatInput(0)" @focus="hidePlaceholder(0)" @blur="showPlaceholder(0)"
              :placeholder="placeholders.input0" type="text" maxlength="14"
            />
          </div>
        </div>
      </div>
    </div>
    <span class="title">输入框</span>
  </div>
</template>

<style lang="scss" scoped>
.inputOutBg{
  /* normal：48% + 左 5%（保持你原来的大板布局） */
  width: 48%;
  height: 100%;
  margin-left: 5%;
  overflow: visible;
  position: relative;
  box-sizing: border-box;

  /* normal 变量 */
  --radius: 14px;
  --dash-w: 1.5px;
  --label-size: 18px;
  --item-font: 14px;
  --prefix-font: 17px;
  --input-font: 15px;
  --inner-radius: 5px;

  /* mini：不要再 scale，避免 flex 尺寸与视觉不一致 */
  &.mini{
    width: 48%;
    margin-left: 5%;   /* 右边 LED 承担 2% 的间距 */
    /* ✗ 这里不要 transform */
    --radius: 5px;
    --dash-w: 0.8px;
    --label-size: 4px;
    --item-font: 3px;
    --prefix-font: 3px;
    --input-font: 2.8px;
    --inner-radius: 4px;
  }

  .lineFrame{
    width: 100%;
    height: 90%;
    margin-top: calc(38% * 5 / 100);
    border-radius: var(--radius);
    border: var(--dash-w) dashed white;
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
        box-sizing: border-box;

        /* 第二列（INPUT2/0）加 2% 的列间距 */
        &:nth-child(2n){ margin-left: 2%; }

        > span{
          width: 40%;
          color: white;
          font-size: var(--item-font);
        }

        .inputInnerBox{
          height: 60%;
          background-color: #6D6D6D;
          border-radius: var(--inner-radius);
          display: flex;
          align-items: center;
          transition: opacity .2s ease;

          &.disabled{ background-color: #5b5b5b; opacity: .85; }

          span{
            margin-left: 3%;
            color: black;
            font-size: var(--prefix-font);
          }

          input{
            font-size: var(--input-font);
            width: 76%;
            margin-left: 4%;
            border-radius: var(--inner-radius);
            font-family: 'Menlo','SFMono-Regular','Roboto Mono','Consolas',monospace;
            padding: 0 3%;
            border: none;
            caret-color: transparent;
            text-align: left;
            &:focus{ outline: none; }

            &:disabled{
              background: transparent;
              color: #ddd;
              cursor: not-allowed;
              -webkit-text-fill-color: #ddd;
              opacity: 1;
            }
            &:disabled::placeholder{ color: #bfbfbf; }
          }
        }
      }
    }
  }

  .title{
    color: white;
    position: absolute;
    top: -3%;
    left: 5%;
    font-size: var(--label-size);
    background-color: #343434;
    line-height: 1;
    padding: 0 4px;
    border-radius: 2px;
  }
}
</style>