<template>
    <!-- 只保留 viewBox，大小交给外部样式 -->
    <svg viewBox="0 0 9 4"
         xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink">
  
      <!-- 中间红色灯体 -->
      <rect x="2" y="0" width="5" height="4" fill="#FF0000" />
  
      <!-- 两侧端帽 -->
      <path d="M9 0.267563V0H7V4H9V3.73244
               C8.40222 3.38663 8 2.74028 8 2
               C8 1.25972 8.40222 0.613373 9 0.267563Z"
            fill="#C16700" clip-rule="evenodd" fill-rule="evenodd"/>
      <path d="M0 0.267563V0H2V4H0V3.73244
               C0.597778 3.38663 1 2.74028 1 2
               C1 1.25972 0.597778 0.613373 0 0.267563Z"
            fill="#C16700" clip-rule="evenodd" fill-rule="evenodd"/>
    </svg>
  </template>