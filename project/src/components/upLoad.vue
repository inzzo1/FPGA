<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'

const emit = defineEmits<{
  (e: 'uploaded', file: File): void
}>()

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const isBitFile = rawFile.name.toLowerCase().endsWith('.bit')
  if (!isBitFile) {
    ElMessage.error('请上传 .bit 文件')
    return false
  }
  return false // 由父组件统一调用后端接口
}

const handleChange: UploadProps['onChange'] = uploadFile => {
  const raw = uploadFile.raw
  if (!raw) return
  if (!raw.name.toLowerCase().endsWith('.bit')) return
  emit('uploaded', raw)
}
</script>

<template>
    <div class="outRound">
        <div style="width: 94%; height: 86%; background-color: white; border-radius: 22px;">
            <el-upload
            drag
            action="#"
            :auto-upload="false"
            :limit="1"
            accept=".bit"
            :before-upload="beforeUpload"
            :on-change="handleChange"
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
