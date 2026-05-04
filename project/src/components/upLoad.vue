<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'uploaded', file: File): void
}>()

const selectedFileName = ref('')

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
  selectedFileName.value = raw.name
  emit('uploaded', raw)
}

const clearSelected = () => {
  selectedFileName.value = ''
}

defineExpose({ clearSelected })
</script>

<template>
  <div class="outRound">
    <div class="uploadBox">
      <el-upload
        drag
        action="#"
        :auto-upload="false"
        :limit="1"
        :show-file-list="false"
        accept=".bit"
        :before-upload="beforeUpload"
        :on-change="handleChange"
      >
        <template v-if="!selectedFileName">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            点击或拖拽文件到此处上传
          </div>
        </template>
        <template v-else>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text selectedName">{{ selectedFileName }}</div>
          <div class="el-upload__tip uploadTip">已选择文件，点击“点击烧录”开始上传</div>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outRound {
  width: 100%;
  height: 100%;
  border-radius: 22px;
  background-color: rgb(196, 196, 196);
  display: flex;
  justify-content: center;
  align-items: center;
}

.uploadBox {
  width: 94%;
  height: 86%;
  background-color: white;
  border-radius: 22px;
  overflow: hidden;
}

:deep(.el-upload) {
  width: 100%;
  height: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  padding: 30px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.selectedName {
  max-width: 85%;
  text-align: center;
  font-size: 16px;
  color: #606266;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uploadTip {
  margin-top: 8px;
  color: #909399;
  font-size: 13px;
}
</style>
