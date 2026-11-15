<script setup lang="ts">
import { categories, type RecipeDraft, type FormErrors } from '@/types'
const props = defineProps<{ modelValue: RecipeDraft; errors: FormErrors }>()
const emit = defineEmits<{ 'update:modelValue': [draft: RecipeDraft] }>()
function update(field: keyof RecipeDraft, value: string | number) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
<template>
  <div class="basics-form">
    <div class="field">
      <label for="recipe-title">Recipe title <span>*</span></label
      ><input
        id="recipe-title"
        :value="modelValue.title"
        placeholder="e.g. Fish Amok"
        maxlength="120"
        :aria-invalid="!!errors.title"
        :aria-describedby="errors.title ? 'title-error' : undefined"
        @input="update('title', ($event.target as HTMLInputElement).value)"
      /><span v-if="errors.title" id="title-error" class="field-error">{{ errors.title }}</span>
    </div>
    <div class="field">
      <label for="recipe-khmer">Khmer name <span class="optional">(optional)</span></label
      ><input
        id="recipe-khmer"
        :value="modelValue.khmerTitle"
        lang="km"
        placeholder="ឈ្មោះម្ហូបជាភាសាខ្មែរ"
        maxlength="120"
        @input="update('khmerTitle', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="field">
      <label for="recipe-description">The story of your dish <span>*</span></label
      ><textarea
        id="recipe-description"
        :value="modelValue.description"
        rows="3"
        maxlength="2000"
        placeholder="What makes this recipe special? Tell us about its flavors, its roots, or the person who taught you."
        :aria-invalid="!!errors.description"
        :aria-describedby="errors.description ? 'description-error' : undefined"
        @input="update('description', ($event.target as HTMLTextAreaElement).value)"
      /><span v-if="errors.description" id="description-error" class="field-error">{{
        errors.description
      }}</span>
    </div>
    <div class="basics-numbers">
      <div class="field">
        <label for="recipe-category">Category <span>*</span></label
        ><select
          id="recipe-category"
          :value="modelValue.category"
          :aria-invalid="!!errors.category"
          :aria-describedby="errors.category ? 'category-error' : undefined"
          @change="update('category', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Choose category</option>
          <option v-for="category in categories" :key="category">{{ category }}</option></select
        ><span v-if="errors.category" id="category-error" class="field-error">{{
          errors.category
        }}</span>
      </div>
      <div
        v-for="field in ['prepTime', 'cookingTime', 'servings'] as const"
        :key="field"
        class="field"
      >
        <label :for="`recipe-${field}`"
          >{{
            field === 'prepTime'
              ? 'Prep (min)'
              : field === 'cookingTime'
                ? 'Cook (min)'
                : 'Servings'
          }}
          <span>*</span></label
        ><input
          :id="`recipe-${field}`"
          type="number"
          :value="modelValue[field]"
          :min="field === 'servings' ? 1 : 0"
          max="10000"
          step="1"
          :aria-invalid="!!errors[field]"
          :aria-describedby="errors[field] ? `${field}-error` : undefined"
          @input="update(field, ($event.target as HTMLInputElement).valueAsNumber)"
        /><span v-if="errors[field]" :id="`${field}-error`" class="field-error">{{
          errors[field]
        }}</span>
      </div>
    </div>
  </div>
</template>
