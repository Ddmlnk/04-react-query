import styles from "./SearchBar.module.css";
import toast from "react-hot-toast";
interface SearchBarProps {
  onSubmit: (query: string) => void;
  setPage: (x: number) => void;
}

const notify = () => toast("Please enter your search query.");

export default function SearchBar({ onSubmit, setPage }: SearchBarProps) {
  const submitHandle = (formData: FormData) => {
    const query = formData.get("query") as string;
    if (query.length === 0) {
      notify();
      return;
    }
    console.log(query);
    onSubmit(query);
    setPage(1);
  };
  return (
    <>
      <header className={styles.header}>
        {" "}
        <div className={styles.container}>
          {" "}
          <a
            className={styles.link}
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by TMDB{" "}
          </a>{" "}
          <form className={styles.form} action={submitHandle}>
            {" "}
            <input
              className={styles.input}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
            />{" "}
            <button className={styles.button} type="submit">
              Search{" "}
            </button>{" "}
          </form>{" "}
        </div>
      </header>
    </>
  );
}
