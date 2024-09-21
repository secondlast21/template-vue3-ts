<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getPokemon } from '@/services/example-service'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()
const offset = ref(Number(route.query.offset) || 0)
const limit = ref(Number(route.query.limit) || 5)

const { data, isFetched, isFetching, isLoading } = useQuery({
  queryKey: ['getPokemon', offset],
  queryFn: () =>
    getPokemon({
      limit: limit.value,
      offset: offset.value,
    }),
})

const prevPageClicked = () => {
  offset.value -= limit.value
  router.push({
    path: '/example',
    query: {
      offset: offset.value,
      limit: limit.value,
    },
  })
}

const nextPageClicked = () => {
  offset.value += limit.value
  router.push({
    path: '/example',
    query: {
      offset: offset.value,
      limit: limit.value,
    },
  })
}

const currentPage = computed(() => offset.value / limit.value + 1)

const isPrevDisabled = computed(() => offset.value <= 0)
const isNextDisabled = computed(() => {
  if (data.value) {
    const totalCount = data.value.count
    return offset.value + limit.value >= totalCount
  }
  return false
})

const goToPage = (page: number) => {
  const newSkip = (page - 1) * limit.value
  offset.value = newSkip
  localStorage.setItem('offset', String(newSkip))
}

console.log(route.query.limit)
console.log(route.query.offset)
</script>

<template>
  <h1 class="bg-red-100">Hello Fetching</h1>
  <div v-if="isFetching || isLoading">
    <span className="loading loading-ring loading-lg text-primary"></span>
  </div>
  <div v-else-if="isFetched">
    <p>{{ data?.count }}</p>
    <p v-if="data && data?.count < 1">Tidak ada data</p>
    <ul v-else-if="data && data?.count > 0">
      <li
        v-for="(pokemon, index) in data?.results"
        :key="index"
      >
        {{ pokemon.name }}
      </li>
    </ul>
    <Pagination
      :current-page="currentPage"
      :total-pages="Math.ceil((data?.count ?? 0) / limit)"
      :prev-page-clicked="prevPageClicked"
      :next-page-clicked="nextPageClicked"
      :is-prev-disabled="isPrevDisabled"
      :is-next-disabled="isNextDisabled"
      :go-to-page="goToPage"
    />
  </div>
</template>
