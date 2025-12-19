<template>
  <div class="chat-view">
    <div class="chat-header" v-if="chat">
      <h2 class="chat-title">{{ chat.title }}</h2>
    </div>
    <div v-else class="chat-header">
      <h2 class="chat-title">Чат не найден</h2>
    </div>

    <el-skeleton v-if="loadingMessages" animated :rows="4" />

    <template v-else>
      <MessageList v-if="chat" :messages="messages" />
      <div v-else class="chat-empty">
        Выберите чат слева или создайте новый.
      </div>
    </template>

    <MessageInput v-if="chat" :sending="sending" @submit="handleSend" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore, type Chat, type Message } from '../stores/chat';
import MessageList from '../components/MessageList.vue';
import MessageInput from '../components/MessageInput.vue';

const store = useChatStore();
const route = useRoute();

const chatId = computed<string>(() => String(route.params.id || ''));

const chat = computed<Chat | undefined>(() =>
  store.chats.find(c => c.id === chatId.value)
);

const messages = computed<Message[]>(() =>
  store.messagesByChatId[chatId.value] || []
);

const loadingMessages = computed<boolean>(() => store.loadingMessages);
const sending = computed<boolean>(() => store.sending);

watch(
  chatId,
  id => {
    if (id) store.loadMessages(id)
  },
  { immediate: true }
)

function handleSend(text: string) {
  if (!chatId.value) return
  store.sendMessage(chatId.value, text)
}
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 95%;
}
.chat-header {
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
}
.chat-title {
  margin: 0;
}
.chat-empty {
  padding: 16px;
  color: #909399;
}
</style>
