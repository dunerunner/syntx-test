import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createMemoryHistory } from 'vue-router';
import { nextTick } from 'vue';
import ChatView from '../src/views/ChatView.vue';
import { useChatStore } from '../src/stores/chat';
import type { ChatState } from '../src/stores/chat';

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/chat/:id', name: 'chat', component: ChatView }
    ]
  })

describe('ChatView.vue', () => {
  it('renders chat title and messages for current route', async () => {
    const router = createTestRouter();
    const initialState: { chat: ChatState } = {
      chat: {
        chats: [
          { id: '1', title: 'Test Chat' }
        ],
        messagesByChatId: {
          '1': [
            {
              id: 1,
              author: 'you',
              text: 'Hello from test',
              createdAt: new Date().toISOString()
            }
          ]
        },
        loadingMessages: false,
        sending: false
      }
    };

    const pinia = createTestingPinia({
      initialState,
      stubActions: true
    });

    router.push('/chat/1');
    await router.isReady();

    const wrapper = mount(ChatView, {
      global: {
        plugins: [router, pinia]
      }
    });

    await nextTick();

    const title = wrapper.find('.chat-title');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Test Chat');

    expect(wrapper.text()).toContain('Hello from test');
  })

  it('calls loadMessages on mount with route chat id', async () => {
    const router = createTestRouter();
    const pinia = createTestingPinia({
      stubActions: true
    });
    const store = useChatStore();

    router.push('/chat/1');
    await router.isReady();

    mount(ChatView, {
      global: {
        plugins: [router, pinia]
      }
    });

    await nextTick();

    expect(store.loadMessages).toHaveBeenCalled();
    expect((store.loadMessages as any).mock.calls[0][0]).toBe('1');
  })

  it('calls sendMessage when user submits a message', async () => {
    const router = createTestRouter();
    const initialState: { chat: ChatState } = {
      chat: {
        chats: [
          { id: '1', title: 'Test Chat' }
        ],
        messagesByChatId: {
          '1': []
        },
        loadingMessages: false,
        sending: false
      }
    };

    const pinia = createTestingPinia({
      initialState,
      stubActions: true
    });
    const store = useChatStore();

    router.push('/chat/1');
    await router.isReady();

    const wrapper = mount(ChatView, {
      global: {
        plugins: [router, pinia]
      }
    });

    await nextTick();

    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);

    await textarea.setValue('Hello ChatView');
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);

    await button.trigger('click');

    expect(store.sendMessage).toHaveBeenCalled();
    expect((store.sendMessage as any).mock.calls[0][0]).toBe('1');
    expect((store.sendMessage as any).mock.calls[0][1]).toBe('Hello ChatView');
  })
})
