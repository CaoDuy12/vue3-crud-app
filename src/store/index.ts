// store/movies.ts
import type { Movie } from "@/types";
import axios from "axios";
import { defineStore } from "pinia";

export const useMovieStore = defineStore("movie", {
  state: () => ({
    movies: <Movie[]>[],
    currentPage: 1,
    hasMoreMovies: true,
  }),
  actions: {
    // async fetchMovies(page: number) {
    //   try {
    //     const response = await axios.get<Movie[]>(
    //       `https://playground.mockoon.com/movies`,
    //       {
    //         params: { page },
    //       }
    //     );

    //     if (response.data.length > 0) {
    //       this.movies = response.data;
    //       this.currentPage = page;
    //       this.hasMoreMovies = response.data.length > 0;
    //     } else {
    //       this.hasMoreMovies = false;
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

    async fetchMovies() {
      try {
        const response = await axios.get(
          "https://playground.mockoon.com/movies"
        );
        this.movies = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchMovie(id: string) {
      const response = await axios.get<Movie>(
        `https://playground.mockoon.com/movies/${id}`
      );
      return response.data;
    },

    async addMovie(movie: Movie) {
      try {
        const response = await axios.post<Movie>(
          "https://playground.mockoon.com/movies",
          movie
        );
        this.movies.push(response.data);
      } catch (error) {
        console.error("Error adding movie:", error);
      }
    },
    async updateMovie(movie: Movie) {
      try {
        await axios.put(
          `https://playground.mockoon.com/movies/${movie.id}`,
          movie
        );
        const index = this.movies.findIndex((m) => m.id === movie.id);
        if (index !== -1) {
          this.movies.splice(index, 1, movie);
        }
      } catch (error) {
        console.error("Error updating movie:", error);
      }
    },
    async deleteMovie(id: string) {
      await axios.delete(`https://playground.mockoon.com/movies/${id}`);
      this.movies = this.movies.filter((movie: any) => movie.id !== id);
    },
  },
});
