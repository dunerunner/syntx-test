<template>
  <div class="sidebar">
    <h2 class="sidebar-title">Chats</h2>

    <div class="sidebar-new-chat">
      <el-input
        v-model="newChatTitle"
        placeholder="Chat name"
        @keyup.enter="handleCreateChat"
      />
      <el-button
        type="primary"
        size="default"
        class="sidebar-new-chat-button"
        @click="handleCreateChat"
      >
        Create
      </el-button>
    </div>

    <el-menu :default-active="activeId" class="sidebar-menu">
      <el-menu-item
        v-for="chat in chats"
        :key="chat.id"
        :index="chat.id"
        data-test="chat-item"
        @click="goToChat(chat.id)"
      >
        <span>{{ chat.title }}</span>
      </el-menu-item>
    </el-menu>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore, type Chat } from '../stores/chat';

const store = useChatStore();
const route = useRoute();
const router = useRouter();

const chats = computed<Chat[]>(() => store.chats);
const activeId = computed(() =>
  route.params.id ? String(route.params.id) : ''
);

const newChatTitle = ref('');

function goToChat(id: string) {
  router.push({ name: 'chat', params: { id } });
}

function handleCreateChat() {
  if (!newChatTitle.value.trim()) {
    return;
  }
  const chat = store.createChat(newChatTitle.value);
  newChatTitle.value = '';
  if (chat) {
    router.push({ name: 'chat', params: { id: chat.id } });
  }
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 95%;
  padding: 12px;
  box-sizing: border-box;
  border-right: 1px solid #ebeef5;
}

.sidebar-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
  overflow: auto;
}

.sidebar-new-chat {
  margin-top: 12px;
  margin-bottom: 24px;
  display: flex;
  gap: 8px;
}

.sidebar-new-chat-button {
  white-space: nowrap;
}
</style>
