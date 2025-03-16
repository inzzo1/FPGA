<script setup lang="ts">
    
</script>

<template>
    <div class="outRound">
        <div style="width: 94%; height: 86%; background-color: white; border-radius: 22px;">
            <el-upload
            drag
            action="#"
            multiple
            >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              点击或拖拽文件到此处上传
            </div>
          </el-upload>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .outRound{
        width: 100%;
        height: 100%;
        border-radius: 22px;
        background-color: rgb(196, 196, 196);
        display: flex;
        justify-content: center;
        align-items: center;
      }
</style>