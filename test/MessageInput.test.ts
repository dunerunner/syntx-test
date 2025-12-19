import { mount } from '@vue/test-utils'
import MessageInput from '../src/components/MessageInput.vue'
import { describe, it, expect } from 'vitest'

describe('MessageInput.vue', () => {
  it('emits submit when user enters text and clicks', async () => {
    const wrapper = mount(MessageInput);

    await wrapper.find('textarea').setValue('Hello');

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted().submit).toBeTruthy();
    expect(wrapper.emitted().submit![0][0]).toBe('Hello');
  })

  it('does NOT emit submit when text is empty', async () => {
    const wrapper = mount(MessageInput);

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted().submit).toBeFalsy();
  })
})
