<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
defineProps<{ previewUrl: string }>()
const emit = defineEmits<{ fileSelected: [file: File]; clear: [] }>()
const error = ref('')
function select(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  error.value = ''
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    error.value = 'Choose a JPG, PNG, or WebP image.'
    input.value = ''
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'Choose an image smaller than 2 MB.'
    input.value = ''
    return
  }
  emit('fileSelected', file)
  input.value = ''
}
</script>
<template>
  <div class="image-picker">
    <div class="image-picker-preview">
      <img v-if="previewUrl" :src="previewUrl" alt="Selected recipe image preview" />
      <div v-else>
        <AppIcon name="bowl" :size="70" />
        <h3>A picture of delicious</h3>
        <p>Add a photo of your finished dish.</p>
      </div>
    </div>
    <label class="button secondary upload-button"
      ><AppIcon name="upload" :size="18" />{{ previewUrl ? 'Change image' : 'Choose an image'
      }}<input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Choose recipe image"
        @change="select" /></label
    ><button v-if="previewUrl" type="button" class="text-button" @click="$emit('clear')">
      Remove image
    </button>
    <p class="muted">
      JPG, PNG, or WebP · up to 2 MB<br />Optional. A kitchen illustration is used otherwise.
    </p>
    <span v-if="error" class="field-error" role="alert">{{ error }}</span>
  </div>
</template>
