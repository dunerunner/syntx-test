import { setActivePinia, createPinia } from 'pinia';
import { useChatStore } from '../src/stores/chat';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Chat Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  })

  it('initializes with default chats', () => {
    const store = useChatStore();
    expect(store.chats.length).toBe(3);
  })

  it('creates a new chat', () => {
    const store = useChatStore();
    const chat = store.createChat('New Chat');

    expect(chat?.title).toBe('New Chat');
    expect(store.chats.length).toBe(4);
  })

  it('sends a message', async () => {
    const store = useChatStore();

    await store.loadMessages('1');
    await store.sendMessage('1', 'Hello!');

    const messages = store.messagesByChatId['1'];
    expect(messages[messages.length - 1].text).toBe('Hello!');
  })
})
