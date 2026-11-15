<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import type { FormErrors, RecipeDraft } from '@/types'
import { validateRecipe } from '@/utils/validation'
import { useAuthStore } from '@/stores/auth'
import { useRecipeStore } from '@/stores/recipes'
import AppIcon from '@/components/AppIcon.vue'
import RecipeImagePicker from '@/components/RecipeImagePicker.vue'
import RecipeBasicsForm from '@/components/RecipeBasicsForm.vue'
import IngredientEditor from '@/components/IngredientEditor.vue'
import InstructionEditor from '@/components/InstructionEditor.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const store = useRecipeStore()
const blank = (): RecipeDraft => ({
  title: '',
  khmerTitle: '',
  description: '',
  category: '',
  prepTime: 15,
  cookingTime: 30,
  servings: 4,
  imageUrl: '',
  ingredients: [{ name: '', quantity: '', unit: '' }],
  instructions: [''],
})
const draft = ref<RecipeDraft>(blank())
const errors = ref<FormErrors>({})
const attempted = ref(false)
const error = ref('')
const blocked = ref('')
const ready = ref(false)
const submitting = ref(false)
const imagePending = ref(false)
const original = ref('')
const saved = ref(false)
const isEdit = computed(() => typeof route.params.id === 'string')
const dirty = computed(() => ready.value && JSON.stringify(draft.value) !== original.value)
let imageRequest = 0
async function initialize() {
  ready.value = false
  blocked.value = ''
  error.value = ''
  errors.value = {}
  attempted.value = false
  saved.value = false
  imageRequest++
  imagePending.value = false
  if (isEdit.value) {
    await store.load()
    if (store.error) return
    const recipe = store.recipes.find((item) => item.id === route.params.id)
    if (!recipe) {
      blocked.value = 'This recipe could not be found.'
      return
    }
    if (recipe.userId !== auth.user?.id) {
      blocked.value = 'This recipe belongs to another cook. You can only edit your own recipes.'
      return
    }
    draft.value = JSON.parse(JSON.stringify(recipe)) as RecipeDraft
  } else draft.value = blank()
  original.value = JSON.stringify(draft.value)
  ready.value = true
}
watch(() => route.params.id, initialize, { immediate: true })
watch(
  draft,
  () => {
    if (!attempted.value) return
    errors.value = validateRecipe(draft.value)
    if (!Object.keys(errors.value).length) error.value = ''
  },
  { deep: true },
)
function canLeave() {
  return (
    !submitting.value &&
    (!dirty.value ||
      saved.value ||
      window.confirm('Leave this recipe? Your unsaved changes will be lost.'))
  )
}
onBeforeRouteLeave(canLeave)
onBeforeRouteUpdate(canLeave)
async function selectImage(file: File) {
  const current = ++imageRequest
  imagePending.value = true
  error.value = ''
  const reader = new FileReader()
  reader.onload = async () => {
    const url = String(reader.result)
    const image = new Image()
    image.src = url
    try {
      // A filename and MIME type do not establish that the file is a valid image.
      await image.decode()
      if (current === imageRequest) draft.value.imageUrl = url
    } catch {
      if (current === imageRequest)
        error.value = 'Could not read this image. Please choose another.'
    } finally {
      if (current === imageRequest) imagePending.value = false
    }
  }
  reader.onerror = () => {
    if (current === imageRequest) {
      error.value = 'Could not read this image. Please choose another.'
      imagePending.value = false
    }
  }
  reader.readAsDataURL(file)
}
function clearImage() {
  imageRequest++
  imagePending.value = false
  draft.value.imageUrl = ''
}
async function submit() {
  attempted.value = true
  errors.value = validateRecipe(draft.value)
  error.value = ''
  if (Object.keys(errors.value).length) {
    error.value = 'Please check the highlighted fields before sharing your recipe.'
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
    )
    return
  }
  submitting.value = true
  try {
    const recipe = await store.save(draft.value, isEdit.value ? String(route.params.id) : undefined)
    saved.value = true
    submitting.value = false
    await router.push(`/recipes/${recipe.id}`)
  } catch (cause) {
    error.value =
      cause instanceof Error ? cause.message : 'Could not save your recipe. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <main class="page editor-page">
    <RouterLink to="/my-recipes" class="back-link"
      ><AppIcon name="back" :size="18" />Back to my recipes</RouterLink
    >
    <div class="page-heading">
      <div>
        <span class="eyebrow">GOOD FOOD DESERVES TO BE SHARED</span>
        <h1>{{ isEdit ? 'A little recipe refresh.' : 'Share a taste of your kitchen.' }}</h1>
        <p>
          {{
            isEdit
              ? 'A small change can make a good recipe even better.'
              : 'A family favorite, a new discovery, or your own delicious creation.'
          }}
        </p>
      </div>
    </div>
    <ErrorState
      v-if="store.error && !ready"
      :message="store.error"
      @retry="initialize"
    /><EmptyState v-else-if="blocked" title="We can’t open this recipe" :detail="blocked"
      ><RouterLink to="/my-recipes" class="button">My recipes</RouterLink></EmptyState
    ><LoadingState v-else-if="!ready" message="Getting your recipe ready…" />
    <form v-else class="panel editor-form" novalidate @submit.prevent="submit">
      <fieldset :disabled="submitting">
        <legend class="sr-only">{{ isEdit ? 'Edit recipe' : 'New recipe' }}</legend>
        <div class="editor-top">
          <RecipeImagePicker
            :preview-url="draft.imageUrl"
            @file-selected="selectImage"
            @clear="clearImage"
          /><RecipeBasicsForm v-model="draft" :errors="errors" />
        </div>
        <IngredientEditor
          v-model="draft.ingredients"
          :error="errors.ingredients"
        /><InstructionEditor v-model="draft.instructions" :error="errors.instructions" />
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <div class="form-actions editor-actions">
          <span>* A little essential detail.</span
          ><RouterLink to="/my-recipes" class="button secondary">Cancel</RouterLink
          ><button class="button" type="submit" :disabled="submitting || imagePending">
            <AppIcon name="check" :size="18" />{{
              submitting ? 'Sharing…' : isEdit ? 'Save changes' : 'Publish recipe'
            }}
          </button>
        </div>
      </fieldset>
    </form>
  </main>
</template>
