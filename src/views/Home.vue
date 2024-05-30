<template>
  <div class="content">
    <h2 class="content__heading">Danh sách Phim</h2>
    <hr class="content__separator" />
    <div v-if="movies.length > 0">
      <div class="movie-list">
        <div class="header">
          <span>Tên phim</span>
          <span>Thể loại</span>
          <span>Đạo diễn</span>
        </div>
        <div v-for="movie in movies" :key="movie.id" class="movie-item">
          <router-link :to="`detail/${movie.id}`">
            <span>{{ movie.title }}</span>
          </router-link>
          <span>{{ movie.genre }}</span>
          <span>{{ movie.director }}</span>
        </div>
  </div>
      <div class="pagination">
        <button @click.prevent="prevPage" :disabled="currentPage === 1">Previous Page</button>
        <button @click.prevent="nextPage" :disabled="currentPage >= totalPages">Next Page</button>

      </div>
    </div>
    <div v-else>
      <p>Không có phim nào được tìm thấy.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useMovieStore } from '../store';
import { storeToRefs } from 'pinia';



export default defineComponent({
  name: 'MovieList',
  
  setup() {
    const movieStore = useMovieStore();
    const { movies, totalItems } = storeToRefs(movieStore)
    const currentPage = ref(1)
    const moviesPerPage = ref(12) // Set your items per page limit
    const totalPages = computed(() => Math.ceil(totalItems.value / moviesPerPage.value))
    
    const handleGetMovies = async () => {
      await movieStore.fetchMovies(currentPage.value, moviesPerPage.value)
   
    }
    
    const prevPage = async () => {
        currentPage.value -= 1
        await handleGetMovies() 
    }

    const nextPage = async () => {
      currentPage.value += 1
      await handleGetMovies()
    }
    
    watch(currentPage, () => {
      handleGetMovies();
    });

    onMounted(handleGetMovies);
   
    return {
      prevPage,
      nextPage,
      movies,
      moviesPerPage,
      totalPages,
      currentPage,
      handleGetMovies
    };
  }
});
</script>

<style scoped>
.content__heading {
  text-align: center;
  margin-bottom: 1rem;
}
.content__separator {
  border-color: gray;
  margin-bottom: 1rem;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.header {
  display: contents; /* Cho phép các phần tử con tuân theo bố cục của grid container */
  font-weight: bold;
}

.movie-item {
  display: contents; /* Cho phép các phần tử con tuân theo bố cục của grid container */
}

.movie-list span {
  padding: 10px;
  border: 1px solid #ddd;
}

.movie-item router-link {
  text-decoration: none;
  color: inherit;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination button {
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>