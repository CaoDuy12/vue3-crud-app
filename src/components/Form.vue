<template>
  <div class="content">
    <h2 class="content__heading">{{ isEditing ? 'Chỉnh sửa Phim' : 'Thêm Phim' }}</h2>
    <hr class="content__separator" />
    <form @submit.prevent="handleSubmit">
      <label>
        Tiêu đề:
        <input type="text" v-model="formData.title" required />
      </label><br>
      <label>
        Thể loại:
        <input type="text" v-model="formData.genre" required />
      </label><br>
      <label>
        Đạo diễn:
        <input type="text" v-model="formData.director" required />
      </label><br>
      <label>
        Năm phát hành:
        <input type="number" v-model="formData.releaseYear" required />
      </label><br>
      <label>
        Đánh giá:
        <input type="number" v-model="formData.rating" required min="0" max="5" />
      </label><br>
      <label>
        Phổ biến:
        <input type="checkbox" v-model="formData.isPopular" />
      </label><br>
      <button type="submit">{{ isEditing ? 'Lưu' : 'Thêm' }}</button>
      <button type="button" @click="cancelEdit" v-if="isEditing">Hủy</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '../store';

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
  name: 'MovieForm',
  props: {
    movie: {
      type: Object as () => Movie | null,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const movieStore = useMovieStore();
    const router = useRouter();
    
    const formData = reactive<Movie>({
      title: '',
      genre: '',
      director: '',
      releaseYear: new Date().getFullYear(),
      rating: 0,
      isPopular: false
    });

    watch(() => props.movie, (newMovie) => {
      if (newMovie) {
        Object.assign(formData, newMovie);
      }
    }, { immediate: true });

    const handleSubmit = async () => {
      try {
        if (props.isEditing && props.movie?.id) {
          await movieStore.updateMovie(formData);
          emit('updateMovie', formData);
        } else {
          await movieStore.addMovie(formData);
          emit('addMovie', formData);
        }
        router.push('home'); // Redirect to Home page
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    const cancelEdit = () => {
      emit('cancelEdit');
      router.push('/home'); // Redirect to Home page on cancel
    };

    return {
      formData,
      handleSubmit,
      cancelEdit
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
