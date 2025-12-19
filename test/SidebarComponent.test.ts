import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'
import SidebarComponent from '../src/components/SidebarComponent.vue'
import ChatView from '../src/views/ChatView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/chat/:id', name: 'chat', component: ChatView }
  ]
});

describe('SidebarComponent.vue', () => {
  it('renders chat titles', async () => {
    router.push('/chat/1');
    await router.isReady();

    const wrapper = mount(SidebarComponent, {
      global: {
        plugins: [router, createTestingPinia()]
      }
    })

    await nextTick();

    const items = wrapper.findAll('[data-test="chat-item"]');
    expect(items.length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain('General');
  })
});
