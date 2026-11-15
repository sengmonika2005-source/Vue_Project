<script setup lang="ts">
import type { Ingredient } from '@/types'
import AppIcon from './AppIcon.vue'
const props = defineProps<{ modelValue: Ingredient[]; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [ingredients: Ingredient[]] }>()
function update(index: number, field: keyof Ingredient, value: string) {
  emit(
    'update:modelValue',
    props.modelValue.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
  )
}
function add() {
  emit('update:modelValue', [...props.modelValue, { name: '', quantity: '', unit: '' }])
}
</script>
<template>
  <section class="editor-section">
    <div class="panel-heading">
      <span class="section-number">01</span>
      <div>
        <h2>Ingredients</h2>
        <p>Everything that goes into something good.</p>
      </div>
    </div>
    <div class="ingredient-column-labels" aria-hidden="true">
      <span>Ingredient</span><span>Quantity</span><span>Unit</span><span />
    </div>
    <div v-for="(ingredient, index) in modelValue" :key="index" class="ingredient-editor-row">
      <input
        :aria-label="`Ingredient ${index + 1} name`"
        :value="ingredient.name"
        placeholder="e.g. Coconut milk"
        :aria-invalid="!!error && !ingredient.name.trim()"
        maxlength="120"
        @input="update(index, 'name', ($event.target as HTMLInputElement).value)"
      /><input
        :aria-label="`Ingredient ${index + 1} quantity`"
        :value="ingredient.quantity"
        placeholder="400"
        :aria-invalid="!!error && !ingredient.quantity.trim()"
        maxlength="40"
        @input="update(index, 'quantity', ($event.target as HTMLInputElement).value)"
      /><input
        :aria-label="`Ingredient ${index + 1} unit`"
        :value="ingredient.unit"
        placeholder="ml"
        maxlength="40"
        @input="update(index, 'unit', ($event.target as HTMLInputElement).value)"
      /><button
        type="button"
        class="icon-button"
        :aria-label="`Remove ingredient ${index + 1}`"
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
    <button class="text-button add-row" type="button" @click="add">
      <AppIcon name="plus" :size="17" />Add ingredient
    </button>
  </section>
</template>
