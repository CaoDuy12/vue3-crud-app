<template>
  <div class="content">
    <h2 class="content__heading">Thông tin Phim</h2>
    <hr class="content__separator" />
    <div v-if="movie" :key="movie.id">
      <div v-if="!isEditing">
        <h3>{{ movie.title }}</h3>
        <p><strong>Thể loại:</strong> {{ movie.genre }}</p>
        <p><strong>Đạo diễn:</strong> {{ movie.director }}</p>
        <p><strong>Năm phát hành:</strong> {{ movie.releaseYear }}</p>
        <p><strong>Đánh giá:</strong> {{ movie.rating }}</p>
        <p><strong>Phổ biến:</strong> {{ movie.isPopular ? 'Có' : 'Không' }}</p>
        <button @click="editMovie">Edit</button>
        <button @click="deleteMovie">Delete</button>
      </div>
      
      <div v-else>
        <form @submit.prevent="updateMovie">
          <label>
            Tiêu đề:
            <input type="text" v-model="editableMovie.title" required />
          </label><br>
          <label>
            Thể loại:
            <input type="text" v-model="editableMovie.genre" required />
          </label><br>
          <label>
            Đạo diễn:
            <input type="text" v-model="editableMovie.director" required />
          </label><br>
          <label>
            Năm phát hành:
            <input type="number" v-model="editableMovie.releaseYear" required />
          </label><br>
          <label>
            Đánh giá:
            <input type="number" v-model="editableMovie.rating" required />
          </label><br>
          <label>
            Phổ biến:
            <input type="checkbox" v-model="editableMovie.isPopular" />
          </label><br>
          <button type="submit">Save</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
      
    </div>
    
    <div v-else>
      <p>Không có thông tin phim nào được tìm thấy.</p>
    </div>
  </div>
</template>

<script lang="ts">

import axios from 'axios';
import { reactive, ref, onMounted, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Movie {
  id: string;
  title: string;
  genre: string;
  director: string;
  releaseYear: number;
  rating: number;
  isPopular: boolean;
}

export default defineComponent({

  setup() {
    const movie = ref<Movie | null>(null);
    const isEditing = ref(false);
    const editableMovie = reactive<Movie>({
      id: '',
      title: '',
      genre: '',
      director: '',
      releaseYear: new Date().getFullYear(),
      rating: 0,
      isPopular: false
    });
    const route = useRoute()
    
    const fetchMovie: any = async (id: string) => {
      const response = await axios.get<Movie>(`https://playground.mockoon.com/movies/${id}`);
      movie.value = response.data;
      Object.assign(editableMovie, response.data);
    }

    const fetchMovieItem = () => {
      const fetchedMovieItem = fetchMovie(route.params.id)
      movie.value = fetchedMovieItem
    }

    const editMovie = () => {
      isEditing.value = true;
    };

    const updateMovie = async () => {
      if (movie.value) {
        try {
          await axios.put(`https://playground.mockoon.com/movies/${movie.value.id}`, editableMovie);

          // For this example, we'll just update the local state
          Object.assign(movie.value, editableMovie);
          isEditing.value = false;
        } catch (error) {
          console.error("Error updating movie data:", error);
        }
      }
    };

    const cancelEdit = () => {
      Object.assign(editableMovie, movie.value);
      isEditing.value = false;
    };
    const router= useRouter();
    const deleteMovie = async (id : string) => {
      if (movie.value) {
        try {
          
          await axios.delete(`https://playground.mockoon.com/movies/${movie.value.id}`);
          // Clear movie data after deletion
          movie.value = null;
          // isEditing.value = false;
          // router.push('/home');
        } catch (error) {
          console.error("Error deleting movie:", error);
        }
      }
    };

    onMounted(fetchMovieItem);

    return {
      movie,
      isEditing,
      editableMovie,
      editMovie,
      updateMovie,
      cancelEdit,
      deleteMovie,
      
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
