<script setup lang="ts">
import AppIcon from './AppIcon.vue'
const props = defineProps<{ modelValue: string[]; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [instructions: string[]] }>()
function update(index: number, value: string) {
  emit(
    'update:modelValue',
    props.modelValue.map((item, i) => (i === index ? value : item)),
  )
}
</script>
<template>
  <section class="editor-section">
    <div class="panel-heading">
      <span class="section-number">02</span>
      <div>
        <h2>Cooking instructions</h2>
        <p>Walk us through it, one delicious step at a time.</p>
      </div>
    </div>
    <div v-for="(step, index) in modelValue" :key="index" class="instruction-editor-row">
      <span class="step-number">{{ index + 1 }}</span
      ><textarea
        :aria-label="`Cooking step ${index + 1}`"
        :value="step"
        rows="2"
        maxlength="2000"
        :aria-invalid="!!error && !step.trim()"
        placeholder="Describe this step…"
        @input="update(index, ($event.target as HTMLTextAreaElement).value)"
      /><button
        class="icon-button"
        type="button"
        :aria-label="`Remove step ${index + 1}`"
        :disabled="modelValue.length <= 1"
        @click="
          emit(
            'update:modelValue',
            modelValue.filter((_, i) => i !== index),
          )
        "
      >
        <AppIcon name="close" :size="17" />
      </button>
    </div>
    <p v-if="error" class="field-error" role="alert">{{ error }}</p>
    <button
      class="text-button add-row"
      type="button"
      @click="emit('update:modelValue', [...modelValue, ''])"
    >
      <AppIcon name="plus" :size="17" />Add a step
    </button>
  </section>
</template>
