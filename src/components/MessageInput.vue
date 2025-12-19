<template>
  <div class="input-wrapper">
    <el-form :model="form" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="form.text"
          type="textarea"
          :rows="2"
          placeholder="Введите сообщение"
          @keydown.enter.exact.prevent="onSubmit"
        />
      </el-form-item>
      <div class="input-actions">
        <el-button
          type="primary"
          :disabled="isDisabled"
          :loading="sending"
          @click="onSubmit"
        >
          Отправить
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

defineProps<{
  sending?: boolean
}>();

const emits = defineEmits<{
  submit: [text: string]
}>();

const form = reactive({
  text: ''
});

const isDisabled = computed(() => !form.text.trim());

function onSubmit() {
  const value = form.text.trim();
  if (!value) {
    return;
  }
  emits('submit', value);
  form.text = '';
}
</script>

<style scoped>
.input-wrapper {
  padding: 12px;
  border-top: 1px solid #ebeef5;
  box-sizing: border-box;
}
.input-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
