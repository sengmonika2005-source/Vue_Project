<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import AppIcon from './AppIcon.vue'
const props = defineProps<{ open: boolean; recipeTitle: string; pending: boolean; error: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
const dialog = ref<HTMLDialogElement>()
const cancelButton = ref<HTMLButtonElement>()
watch(
  () => props.open,
  async (value) => {
    await nextTick()
    if (value) {
      dialog.value?.showModal()
      cancelButton.value?.focus()
    } else dialog.value?.close()
  },
)
</script>
<template>
  <dialog
    ref="dialog"
    class="confirm-dialog"
    aria-labelledby="delete-title"
    aria-describedby="delete-description"
    @cancel.prevent="!pending && emit('cancel')"
  >
    <span class="state-icon"><AppIcon name="trash" :size="26" /></span>
    <h2 id="delete-title">Delete this recipe?</h2>
    <p id="delete-description">
      “{{ recipeTitle }}” and its reviews will be removed. This cannot be undone.
    </p>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <div class="form-actions">
      <button
        ref="cancelButton"
        class="button secondary"
        :disabled="pending"
        @click="emit('cancel')"
      >
        Keep recipe</button
      ><button class="button danger" :disabled="pending" @click="emit('confirm')">
        {{ pending ? 'Deleting…' : 'Delete recipe' }}
      </button>
    </div>
  </dialog>
</template>
