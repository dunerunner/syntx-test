import { defineStore } from 'pinia';

export interface Chat {
  id: string;
  title: string;
}

export type Author = 'you' | 'bot'

export interface Message {
  id: number;
  author: Author;
  text: string;
  createdAt: string;
}

export interface ChatState {
  chats: Chat[];
  messagesByChatId: Record<string, Message[]>;
  loadingMessages: boolean;
  sending: boolean;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    chats: [
      { id: '1', title: 'Общий' },
      { id: '2', title: 'Работа' },
      { id: '3', title: 'Поддержка' }
    ],
    messagesByChatId: {},
    loadingMessages: false,
    sending: false
  }),
  actions: {
    loadMessages(chatId: string): Promise<void> {
      if (this.messagesByChatId[chatId]) {
        return Promise.resolve();
      }
      this.loadingMessages = true;
      return new Promise(resolve => {
        setTimeout(() => {
          this.messagesByChatId[chatId] = [
            {
              id: Date.now(),
              author: 'bot',
              text: 'Привет! Это начало чата.',
              createdAt: new Date().toISOString()
            }
          ]
          this.loadingMessages = false;
          resolve();
        }, 600);
      });
    },
    sendMessage(chatId: string, text: string): Promise<Message | void> {
      const trimmed = text.trim();
      if (!trimmed) {
        return Promise.resolve();
      }
      if (!this.messagesByChatId[chatId]) {
        this.messagesByChatId[chatId] = [];
      }

      this.sending = true;
      const msg: Message = {
        id: Date.now(),
        author: 'you',
        text: trimmed,
        createdAt: new Date().toISOString()
      }
      return new Promise(resolve => {
        setTimeout(() => {
          this.messagesByChatId[chatId]?.push(msg);
          this.sending = false;
          resolve(msg);
          setTimeout(() => {
            this.addBotReply(chatId, trimmed);
          }, 1200);
        }, 400);
      });
    },
    addBotReply(chatId: string, lastText: string) {
      if (!this.messagesByChatId[chatId]) {
        this.messagesByChatId[chatId] = [];
      }
      const msg: Message = {
        id: Date.now() + 1,
        author: 'bot',
        text: `Бот: вы написали "${lastText}". Спасибо за сообщение!`,
        createdAt: new Date().toISOString()
      }
      this.messagesByChatId[chatId].push(msg)
    },
    createChat(title: string): Chat | null {
      const trimmed = title.trim();
      if (!trimmed) {
        return null;
      }
      const id = String(Date.now());
      const chat: Chat = { id, title: trimmed };
      this.chats.push(chat);
      this.messagesByChatId[id] = [
        {
          id: Date.now(),
          author: 'bot',
          text: 'Новый чат создан. Напишите первое сообщение.',
          createdAt: new Date().toISOString()
        }
      ]
      return chat;
    }
  }
})
