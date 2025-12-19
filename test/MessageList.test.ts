import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageList from '../src/components/MessageList.vue'
import type { Message } from '../src/stores/chat'

describe('MessageList.vue', () => {
  it('renders user and bot messages', () => {
    const messages: Message[] = [
      {
        id: 1,
        author: 'you',
        text: 'Hello from user',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        author: 'bot',
        text: 'Hello from bot',
        createdAt: new Date().toISOString()
      }
    ];

    const wrapper = mount(MessageList, {
      props: { messages }
    });

    const allMessages = wrapper.findAll('.message');
    expect(allMessages.length).toBe(2);

    const userMessage = wrapper.find('.message-you');
    const botMessage = wrapper.find('.message-bot');

    expect(userMessage.exists()).toBe(true);
    expect(botMessage.exists()).toBe(true);

    expect(wrapper.text()).toContain('Hello from user');
    expect(wrapper.text()).toContain('Hello from bot');

    const times = wrapper.findAll('.message-time');
    expect(times.length).toBe(2);
    expect(times[0].text()).not.toBe('');
  })

  it('shows empty state when there are no messages', () => {
    const wrapper = mount(MessageList, {
      props: { messages: [] }
    });

    const allMessages = wrapper.findAll('.message');
    expect(allMessages.length).toBe(0);

    expect(wrapper.text()).toContain('Нет сообщений. Напишите что-нибудь первым.');
  })
})
