<script setup lang="ts">
  import { ref } from 'vue';

    const format = () => ('')
    const state = ref(true)
</script>

<template>
    <div class="outRound">
      <div class="headerBg">
        <div style="display: flex; justify-content: space-around; align-items: center;
        width: 100%;height: 93%;">
          <span>剩余时间：XXXXX</span>
            <div style="display: inline-flex; align-items: center;">
            <el-icon size="22px" color="rgb(0, 230, 81)" v-if="state">
              <SuccessFilled />
            </el-icon>
            <el-icon size="22px" color="rgb(230, 186, 0)" v-if="!state">
              <WarningFilled />
            </el-icon>
            <span >
              {{ state ? '已烧录' : '未上传' }}
            </span>
          </div>
        </div>
        <div style="width: 108%; height: 10%;">
          <el-progress :percentage="80" :format="format" color="rgb(101, 231, 0)"/>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
    .outRound{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .headerBg{
      width: 50%;
      height: 60%;
      background-color: rgb(226, 226, 226);
      border-radius: 40px;
      overflow: hidden;
      span{
        font-size: 22px;
      }
    }
  }
</style>