<template>
  <div class="content">
    <h2 class="content__heading" v-if="!isEditing">Thông tin Phim</h2>
    <hr class="content__separator" v-if="!isEditing" />
    <div v-if="movie" :key="movie.id">
      <div v-if="!isEditing">
        <h3>{{ movie.title }}</h3>
        <p><strong>Thể loại:</strong> {{ movie.genre }}</p>
        <p><strong>Đạo diễn:</strong> {{ movie.director }}</p>
        <p><strong>Năm phát hành:</strong> {{ movie.releaseYear }}</p>
        <p><strong>Đánh giá:</strong> {{ movie.rating }}</p>
        <p><strong>Phổ biến:</strong> {{ movie.isPopular ? 'Có' : 'Không' }}</p>
        <button @click="editMovie">Edit</button>
        <button @click="deleteMovie" >Delete</button>
      </div>
      
      <Form 
        v-else 
        :movie="editableMovie" 
        :isEditing="isEditing" 
        @updateMovie="handleUpdateMovie" 
        @cancelEdit="cancelEdit"
      />
      
    </div>
    
    <div v-else>
      <p>Không có thông tin phim nào được tìm thấy.</p>
      <Form @addMovie="handleAddMovie" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '../store';
import Form from '../components/Form.vue';
import axios from 'axios';
import type { Movie } from '../types';



export default defineComponent({
  components: { Form },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const movieStore = useMovieStore();
    
    const movie = ref<Movie | null>(null);
    const isEditing = ref(false);
    const editableMovie = ref<Movie | null>(null);
    
    
    const fetchMovieItem = async() => {
      const fetchedMovie = await movieStore.fetchMovie(route.params.id as string);
      movie.value = fetchedMovie
    };

    const editMovie = () => {
      if (movie.value) {
        isEditing.value = true;
        editableMovie.value = { ...movie.value };
      }
    };

    const handleUpdateMovie = (updatedMovie: Movie) => {
      if (movie.value) {
        Object.assign(movie.value, updatedMovie);
        isEditing.value = false;
      }
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editableMovie.value = null;
    };

    const deleteMovie = async() => {
      if (movie.value) {
        try {
          await movieStore.deleteMovie(movie.value.id!);
           
          router.push('home');
        } catch (error) {
          console.error("Error deleting movie:", error);
        }
      }
    };
    // const deleteMovie = async () => {
   
    //   if (movie.value) {
    //     await movieStore.deleteMovie(movie.value.id!)
    //     router.push('home')
    //   }
    // }

    

    const handleAddMovie = (newMovie: Movie) => {
      console.log('Movie added:', newMovie);
      // Optionally, you can update local state or redirect
    };

    onMounted(fetchMovieItem);

    return {
      movie,
      isEditing,
      editableMovie,
      editMovie,
      handleUpdateMovie,
      cancelEdit,
      deleteMovie,
      handleAddMovie,
   
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
