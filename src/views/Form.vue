<template>
  <div class="content">
    <h2 class="content__heading">Thêm Phim</h2>
    <hr class="content__separator" />
    <div v-if="null">
      <form @submit.prevent="submitForm" >
        <span>Tiêu đề</span>
        <input v-model="formData.title" type="text" name="title" placeholder="Tiêu đề" required> <br>
        <span>Thể loại</span>
        <input v-model="formData.genre" type="text" name="genre" placeholder="Thể loại" required><br>
        <span>Đạo diễn</span>
        <input v-model="formData.director" type="text" name="director" placeholder="Đạo diễn" required><br>
        <span>Năm phát hành</span>
        <input v-model.number="formData.releaseYear" type="number" name="releaseYear" placeholder="Năm phát hành" required><br>
        <span>Đánh giá</span>
        <input v-model.number="formData.rating" type="number" name="rating" placeholder="Đánh giá" required min="0" max="5"><br>
        <label>
          <input v-model="formData.isPopular" type="checkbox" name="isPopular">
          Phim phổ biến
        </label><br>
        <button type="submit">Thêm</button>
      </form>
    </div>
    
    
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { reactive, ref, onMounted, defineComponent } from 'vue';

interface Movie {
  id?: string;
  title: string;
  genre: string;
  director: string;
  releaseYear: number;
  rating: number;
  isPopular: boolean;
}

export default defineComponent({
  name: 'MovieList',
  setup() {
    const formData = reactive<Movie>({
      title: '',
      genre: '',
      director: '',
      releaseYear: 0,
      rating: 0,
      isPopular: false
    });

    
    const movies = ref<Movie[]>([]);

    async function submitForm() {
      try {
        const response = await axios.post<Movie>('https://playground.mockoon.com/movies', formData);
        console.log(response.data);
        // movies.value.push(response.data);
        alert('Movie added successfully!');
        // Gọi lại API để cập nhật danh sách phim sau khi thêm mới
        const updatedResponse = await axios.get<Movie[]>('https://playground.mockoon.com/movies');
        movies.value = updatedResponse.data;
        
      } catch (error) {
        console.error(error);
      }
    }
    
 

    return {
      formData,
      movies,
      submitForm
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