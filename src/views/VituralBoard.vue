<script setup lang="ts">
import VitualDesk from '@/components/virtualDesk/index.vue'
import stateHeader from '@/components/header/stateHeader.vue';
import upLoad from '@/components/upLoad.vue';

</script>

<template>
  <div style="width: 100%; height: 100%" class="backGround">
    <div class="header">
      <stateHeader></stateHeader>
    </div>
    <div class="bdPart">
      <div class="VirDeskPart">
        <VitualDesk> </VitualDesk>
      </div>
      <div style="width: 50%; height: 92%;">
        <div class="wrap">
          <div class="upper">
            <upLoad></upLoad>
          </div>
          <div class="buttonGroup">
            <el-button type="primary" round>拉取结果</el-button>
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
  background-image: url('../assets/bg-dyn-light.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  .header{
    width: 46%;
    height: 15%;
    margin-top: 1%;
    margin-left: 4%;
  }
  .bdPart{
    width: 92%;
    height: 60%;
    margin: 0 auto;
    margin-top: 2%;
    display: flex;
    flex-wrap: nowrap;
    .VirDeskPart{
      width: 50%;
      height: 90%;
    }
    .wrap{
      width: 86%;
      height: 100%;
      margin: 0 auto;
      .upper{
        width: 100%;
        height: 60%;
      }
      .buttonGroup{
        width: 80%;
        height: 20%;
        margin: 0 auto;
        margin-top: 10%;
        display: flex;
        justify-content: space-around;
        button{
          width: 34%;
          height: 50%;
          font-size: 20px;
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
