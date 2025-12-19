<template>
  <div class="messages">
    <div
      v-for="m in messages"
      :key="m.id"
      class="message"
      :class="m.author === 'you' ? 'message-you' : 'message-bot'"
    >
      <div class="message-meta">
        <span class="message-author">
          {{ m.author === 'you' ? 'Вы' : 'Бот' }}
        </span>
        <span class="message-time">{{ formatTime(m.createdAt) }}</span>
      </div>
      <div class="message-text">{{ m.text }}</div>
    </div>

    <div v-if="!messages.length" class="messages-empty">
      Нет сообщений. Напишите что-нибудь первым.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '../stores/chat';

defineProps<{
  messages: Message[]
}>()

function formatTime(value: string) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.messages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  box-sizing: border-box;
}
.message {
  max-width: 70%;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 6px;
}
.message-you {
  margin-left: auto;
  background: #ecf5ff;
}
.message-bot {
  margin-right: auto;
  background: #f5f7fa;
}
.message-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 4px;
  opacity: 0.8;
}
.message-text {
  font-size: 14px;
}
.messages-empty {
  text-align: center;
  color: #909399;
  margin-top: 20px;
}
</style>
