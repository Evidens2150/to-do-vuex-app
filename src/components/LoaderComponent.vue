<template>
  <div class="loader" v-if="loading">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
// Modules
import { toRefs } from "vue";

// Props
const props = withDefaults(defineProps<{
  loading: boolean;
  }>(), {
    loading: false,
});

const {
  loading,
} = toRefs(props);
</script>

<style lang='scss'>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  backdrop-filter: blur(8px);

  background-color: rgba(0,0,0,0.2);

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 6px solid rgba(255, 255, 255, 0.87);
  border-top-color: #646cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>