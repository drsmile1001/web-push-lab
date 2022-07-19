<template>
  <div>
    <h1>FCM 推播測試</h1>
    <button @click="requestPermission">訂閱推播</button>
  </div>
</template>

<script setup lang="ts">
import { requestPermission } from "./main";
</script>
