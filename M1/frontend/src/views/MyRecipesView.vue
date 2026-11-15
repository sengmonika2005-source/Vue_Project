<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRecipeStore } from '@/stores/recipes'
import AppIcon from '@/components/AppIcon.vue'
import RecipeSearch from '@/components/RecipeSearch.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'
const auth = useAuthStore()
const store = useRecipeStore()
const search = ref('')
const status = ref('all')
const page = ref(1)
const target = ref('')
const pending = ref(false)
const error = ref('')
const message = ref('')
const ownRecipes = computed(() => store.recipes.filter((recipe) => recipe.userId === auth.user?.id))
const filtered = computed(() =>
  status.value === 'draft'
    ? []
    : ownRecipes.value.filter((recipe) =>
        `${recipe.title} ${recipe.khmerTitle}`
          .toLowerCase()
          .includes(search.value.trim().toLowerCase()),
      ),
)
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / 6)))
const shown = computed(() =>
  filtered.value.slice(
    (Math.min(page.value, pageCount.value) - 1) * 6,
    Math.min(page.value, pageCount.value) * 6,
  ),
)
const deletingRecipe = computed(() => ownRecipes.value.find((recipe) => recipe.id === target.value))
onMounted(() => store.load())
async function remove() {
  pending.value = true
  error.value = ''
  message.value = ''
  try {
    const name = deletingRecipe.value?.title
    await store.remove(target.value)
    target.value = ''
    message.value = `${name} has been deleted.`
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not delete the recipe.'
  } finally {
    pending.value = false
  }
}
function requestDelete(id: string) {
  target.value = id
  error.value = ''
}
function clearFilters() {
  search.value = ''
  status.value = 'all'
  page.value = 1
}
</script>
<template>
  <main class="page my-recipes-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">YOUR LITTLE CORNER OF THE KITCHEN</span>
        <h1>My Khmer recipes</h1>
        <p>The recipes you’ve shared. The stories you’re still cooking.</p>
      </div>
      <RouterLink to="/recipes/new" class="button"><AppIcon name="plus" />Add a recipe</RouterLink>
    </div>
    <div class="summary-grid">
      <div class="summary-card">
        <span class="summary-icon"><AppIcon name="book" :size="25" /></span>
        <div>
          <span>Total recipes</span><strong>{{ ownRecipes.length }}</strong>
        </div>
      </div>
      <div class="summary-card">
        <span class="summary-icon green"><AppIcon name="check" :size="25" /></span>
        <div>
          <span>Published</span><strong>{{ ownRecipes.length }}</strong>
        </div>
      </div>
      <div class="summary-card">
        <span class="summary-icon cream"><AppIcon name="edit" :size="25" /></span>
        <div><span>Drafts</span><strong>0</strong></div>
      </div>
    </div>
    <div class="my-recipes-toolbar">
      <RecipeSearch
        v-model="search"
        placeholder="Search your recipes…"
        label="Search my recipes"
        @update:model-value="page = 1"
      /><label class="status-select"
        ><span class="sr-only">Recipe status</span
        ><select v-model="status" @change="page = 1">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select></label
      >
    </div>
    <p v-if="message" class="success-message" role="status">{{ message }}</p>
    <LoadingState v-if="store.loading" /><ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="store.load()"
    /><EmptyState
      v-else-if="!shown.length"
      :title="
        status === 'draft'
          ? 'No draft recipes'
          : search
            ? 'No recipes match your search'
            : 'Your kitchen story starts here'
      "
      :detail="
        status === 'draft'
          ? 'Your published recipes are in the Published tab.'
          : search
            ? 'Try a different recipe name.'
            : 'Share your first recipe with the community.'
      "
      ><RouterLink v-if="!search && status !== 'draft'" to="/recipes/new" class="button"
        >Share a recipe</RouterLink
      ><button v-else class="text-button" @click="clearFilters">
        Show all my recipes
      </button></EmptyState
    >
    <div v-else class="recipe-grid owned-grid">
      <RecipeCard
        v-for="recipe in shown"
        :key="recipe.id"
        :recipe="recipe"
        show-owner-actions
        @delete="requestDelete"
      />
    </div>
    <nav v-if="pageCount > 1" class="pagination" aria-label="Recipe pages">
      <button :disabled="page <= 1" @click="page--">Previous</button
      ><button
        v-for="number in pageCount"
        :key="number"
        :aria-current="page === number ? 'page' : undefined"
        @click="page = number"
      >
        {{ number }}</button
      ><button :disabled="page >= pageCount" @click="page++">Next</button>
    </nav>
    <DeleteConfirmDialog
      :open="!!target"
      :recipe-title="deletingRecipe?.title || ''"
      :pending="pending"
      :error="error"
      @cancel="target = ''"
      @confirm="remove"
    />
  </main>
</template>
