<script setup lang='ts'>
    const props = defineProps({
        headerName : {
            type: String,
            default: 'HDU-CBS-VIRT01'
        }
    })
</script>

<template>
     <div class="header">
        <span style="font-size: 24px;">杭州电子科技大学</span>
        <span style="font-size: 16px;">{{ props.headerName }}</span>
     </div>
</template>
    
<style lang="scss" scoped>
    .header{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        span{
            text-align: right;
            color: white;
        }
    }
</style>