import { defineStore } from 'pinia';

export interface Chat {
  id: string;
  title: string;
}

export type Author = 'user' | 'bot';

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
      { id: '1', title: 'General' },
      { id: '2', title: 'Work' },
      { id: '3', title: 'Support' }
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
              text: 'Hello! This is the start of the chat.',
              createdAt: new Date().toISOString()
            }
          ];
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
        author: 'user',
        text: trimmed,
        createdAt: new Date().toISOString()
      };

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
        text: `Bot: you wrote "${lastText}". Thanks for your message!`,
        createdAt: new Date().toISOString()
      };
      this.messagesByChatId[chatId].push(msg);
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
          text: 'New chat created. Write the first message.',
          createdAt: new Date().toISOString()
        }
      ];

      return chat;
    }
  }
});
