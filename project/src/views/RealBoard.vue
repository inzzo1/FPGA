<script setup lang="ts">
import RealDesk from '@/components/realDesk/index.vue'
import stateHeader from '@/components/header/stateHeader.vue';
import upLoad from '@/components/upLoad.vue';
</script>

<template>
  <div style="width: 100%; height: 100%" class="backGround">
    <div class="bdPart">
      <div style="width: 50%; height: 100%;overflow: hidden;">
        <div class="header">
          <stateHeader></stateHeader>
        </div>
        <div class="RealDeskPart">
          <RealDesk></RealDesk>
        </div>
      </div>
      <div style="width: 50%; height: 100%; overflow: hidden;">
        <div class="wrap">
          <div class="picture">
            <span>点击获取实拍图片</span>
          </div>
          <div class="uploadPart">
            <upLoad></upLoad>
          </div>
          <div class="buttonGroup">
            <el-button type="warning" round>点击烧录</el-button>
            <el-button type="primary" round>下载信号</el-button>
            <el-button type="danger" round>结束实验</el-button>
          </div>
        </div>
      </div>
    </div>
    <span>
      FPGA 远程实验平台
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .backGround{
    background-image: url('../../src/assets/bj.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    .bdPart{
      width: 92%;
      height: 80%;
      margin: 0 auto;
      margin-top: 2%;
      display: flex;
      flex-wrap: nowrap;
      .header{
        width: 100%;
        height: 18.75%;
        margin: 0 auto;
        margin-top: 1%;
      }
      .RealDeskPart{
        width: 100%;
        height: 70%;
      }
      .wrap{
        width: 86%;
        height: 94%;
        margin: 0 auto;
        margin-top: 5%;
        display: flex;
        flex-wrap: wrap;
        .picture{
          width: 100%;
          height: 50%;
          background-color: rgb(196, 196, 196);
          border-radius: 30px;
          position: relative;
          cursor: pointer;
          >span{
            font-size: 30px;
            position: absolute;
            top: 42%;
            left: 30%;
          }
        }
        .uploadPart{
          width: 60%;
          height: 36%;
        }
        .buttonGroup{
          width: 40%;
          height: 34%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          button{
            width: 80%;
            height: 24%;
            font-size: 20px;
            margin: 0;
          }
        }
      }
    }
    > span{
      position: absolute;
      bottom: 10%;
      left: 5%;
      font-size: 35px;
      color: white;
    }

  }
</style>
