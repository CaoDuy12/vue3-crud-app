<template>
  <div class="content">
    
    
    <h2 class="content__heading">Danh sách Phim</h2>
    <hr class="content__separator" />
    <div v-if="movies.length > 0">
      <ol>
        <li v-for="movie in movies" :key="movie.id">
          <!-- <h3>{{ movie.title }}</h3> -->
          <router-link :to="`detail/${movie.id}`">
            <h3>{{ movie.title }}</h3>
          </router-link> 
          <p><strong>Thể loại:</strong> {{ movie.genre }}</p>
          <p><strong>Đạo diễn:</strong> {{ movie.director }}</p>

        </li>
      </ol>
    </div>
   
    <div v-else>
      <p>Không có phim nào được tìm thấy.</p>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { reactive, ref, onMounted, defineComponent } from 'vue';

interface Movie {
  id: string;
  title: string;
  genre: string;
  director: string;

}

export default defineComponent({
  name: 'MovieList',
  setup() {
    const formData = reactive<Movie>({
      id: '',
      title: '',
      genre: '',
      director: '',
    
    });

    const movies = ref<Movie[]>([]);

    onMounted(async () => {
      try {
        const response = await axios.get<Movie[]>('https://playground.mockoon.com/movies'); 
        movies.value = response.data;
      } catch (error) {
        console.error(error);
      }
    });

    return {
      formData,
      movies,
      
    };
  }
});
</script>

<style scoped>
.content {
  padding: 7rem 2rem;
}
.content__heading {
  text-align: center;
  margin-bottom: 1rem;
}
.content__separator {
  border-color: gray;
  margin-bottom: 1rem;
}
</style>
