<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getPokemon } from '@/services/example-service'

const offset = ref(Number(localStorage.getItem('offset')) || 0)
const limit = ref(Number(localStorage.getItem('limit')) || 5)

const { data, isFetched, isFetching, isLoading } = useQuery({
  queryKey: ['getPokemon', offset],
  queryFn: () =>
    getPokemon({
      limit: limit.value,
      offset: offset.value,
    }),
})
</script>

<template>
  <h1 class="bg-red-100">Hello Fetching</h1>
  <div v-if="isFetching || isLoading">
    <p>Loading ...</p>
  </div>
  <div v-else-if="isFetched">
    <p>{{ data?.count }}</p>
    <p v-if="data && data?.count < 1">Tidak ada data</p>
    <ul v-else-if="data && data?.count > 0">
      <li v-for="(pokemon, index) in data?.results" :key="index">
        {{ pokemon.name }}
      </li>
    </ul>
  </div><li></li>
</template>
