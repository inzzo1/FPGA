<template>
  <div class="teacher-dashboard">
    <h2>教师管理中心</h2>
    <el-button type="primary" @click="importStudents">导入学生</el-button>
    <el-button type="primary" @click="exportData">导出实验数据</el-button>
    <el-table :data="students">
      <el-table-column prop="id" label="学生ID"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column
        prop="experimentStatus"
        label="实验状态"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const students = ref([
  { id: '001', name: '张三', experimentStatus: '已完成' },
  { id: '002', name: '李四', experimentStatus: '进行中' },
])

const importStudents = () => {
  console.log('导入学生功能')
}

const exportData = () => {
  console.log('导出实验数据')
}
</script>
