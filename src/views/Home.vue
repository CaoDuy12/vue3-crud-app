<template>
  <div class="content">
    <h2 class="content__heading">Danh sách Phim</h2>
    <hr class="content__separator" />
    <div v-if="movies.length > 0">
      <ol>
        <li v-for="movie in movies" :key="movie.id">
          <router-link :to="`detail/${movie.id}`">
            <h3>{{ movie.title }}</h3>
          </router-link>
          <p><strong>Thể loại:</strong> {{ movie.genre }}</p>
          <p><strong>Đạo diễn:</strong> {{ movie.director }}</p>
        </li>
      </ol>
      <!-- <div class="pagination">
        <button @click="fetchMovies(currentPage - 1)" :disabled="currentPage === 1">Previous Page</button>
        <button @click="fetchMovies(currentPage + 1)" :disabled="!hasMoreMovies">Next Page</button>
      </div> -->
    </div>
    <div v-else>
      <p>Không có phim nào được tìm thấy.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useMovieStore } from '../store';
import { storeToRefs } from 'pinia';



export default defineComponent({
  name: 'MovieList',
  setup() {
    const movieStore = useMovieStore();
    const { movies } = storeToRefs(movieStore)

    const fetchMovie = async() => {
    //  await movieStore.fetchMovies(movieStore.currentPage);
      await movieStore.fetchMovies();
    }

    onMounted(fetchMovie);

    return {
      movies,
      currentPage: movieStore.currentPage,
      hasMoreMovies: movieStore.hasMoreMovies,
      fetchMovies: movieStore.fetchMovies,
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
</style>