import css from "./App.module.css";
import { useCallback, useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

const notify = () => toast("No movies found for your request.");

export default function App() {
  const [text, setText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", text, pageNumber],
    queryFn: () => fetchMovies(text, pageNumber),
    enabled: text !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      toast.error("Щось пішло не так. Спробуй ще раз.");
    }
  }, [isError]);

  function handleSelect(movie: Movie) {
    setSelectedMovie(movie);
  }
  const handleClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);
  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={setText} setPage={setPageNumber} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleSelect} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }: { selected: number }) =>
            setPageNumber(selected + 1)
          }
          forcePage={pageNumber - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </div>
  );
}
