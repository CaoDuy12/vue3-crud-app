<template>
  <div class="content">
    <h2 class="content__heading">{{ isEditing ? 'Chỉnh sửa Phim' : 'Thêm Phim' }}</h2>
    <hr class="content__separator" />
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <input v-model="title" placeholder="Tiêu đề" type="text" class="form-input" />
        <ErrorMessage name="title" class="form-error" />
      </div>
      <div class="form-group">
        <input v-model="genre" placeholder="Thể loại" type="text" class="form-input" />
        <ErrorMessage name="genre" class="form-error" />
      </div>
      <div class="form-group">
        <input v-model="director" placeholder="Đạo diễn" type="text" class="form-input" />
        <ErrorMessage name="director" class="form-error" />
      </div>
      <div class="form-group">
        <input v-model="releaseYear" placeholder="Năm phát hành" type="number" class="form-input" />
        <ErrorMessage name="releaseYear" class="form-error" />
      </div>
      <div class="form-group">
        <input v-model="rating" placeholder="Đánh giá" type="number" step="0.1" class="form-input" />
        <ErrorMessage name="rating" class="form-error" />
      </div>
      <div class="form-group form-checkbox">
        <label>
          Phổ biến:
          <input v-model="isPopular" type="checkbox" />
        </label>
      </div><br>
      <button type="submit">{{ isEditing ? 'Lưu' : 'Thêm' }}</button>
      <button type="button" @click="cancelEdit" v-if="isEditing">Hủy</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMovieStore } from '../store';
import { useForm, useField, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { Movie } from '../types';

export default defineComponent({
  name: 'MovieForm',
  components: { ErrorMessage },
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
    const route = useRoute();
    const id = route.params.id as string;

    const schema = yup.object({
      title: yup.string().required('Tiêu đề là bắt buộc'),
      genre: yup.string().required('Thể loại là bắt buộc'),
      director: yup.string().required('Đạo diễn là bắt buộc'),
      releaseYear: yup.number().required('Năm phát hành là bắt buộc')
        .min(1888, 'Năm phải sau 1888')
        .max(new Date().getFullYear(), 'Năm phải bằng hoặc trước năm hiện tại'),
      rating: yup.number().required('Đánh giá là bắt buộc')
        .min(0, 'Đánh giá phải ít nhất là 0')
        .max(10, 'Đánh giá phải nhiều nhất là 10'),
      isPopular: yup.boolean()
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: {
        title: '',
        genre: '',
        director: '',
        releaseYear: new Date().getFullYear(),
        rating: 0,
        isPopular: false
      }
    });

    const { value: title } = useField('title');
    const { value: genre } = useField('genre');
    const { value: director } = useField('director');
    const { value: releaseYear } = useField('releaseYear');
    const { value: rating } = useField('rating');
    const { value: isPopular } = useField('isPopular');

    const fetchMovie = async () => {
      if (props.isEditing) {
        try {
          const fetchedMovie = await movieStore.fetchMovie(id);
          if (fetchedMovie) {
            resetForm({
              values: {
                title: fetchedMovie.title,
                genre: fetchedMovie.genre,
                director: fetchedMovie.director,
                releaseYear: fetchedMovie.releaseYear,
                rating: fetchedMovie.rating,
                isPopular: fetchedMovie.isPopular
              }
            });
          }
        } catch (error) {
          console.error('Failed to fetch movie', error);
        }
      }
    };

    onMounted(fetchMovie);

    const submitForm = handleSubmit(async (values) => {
      try {
        if (props.isEditing && props.movie?.id) {
          await movieStore.updateMovie({ id: props.movie.id, ...values });
          emit('updateMovie', values);
        } else {
          await movieStore.addMovie(values);
          emit('addMovie', values);
        }
        router.push('home');
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    });

    const cancelEdit = () => {
      emit('cancelEdit');
      router.push('home');
    };

    return {
      title,
      genre,
      director,
      releaseYear,
      rating,
      isPopular,
      submitForm,
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
.form-group {
  margin-bottom: 1rem;
}
.form-input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
.form-error {
  color: red;
  font-size: 0.875rem;
}
.form-checkbox {
  display: flex;
  align-items: center;
}
</style>
