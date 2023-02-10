import { useState } from "react";
import Navbar from "./components/Navbar";
import InfiniteScroll from "./pages/InfiniteScroll";
import AllPosts from "./pages/AllPosts";
import PostForm from "./pages/PostForm";

function App() {
  const [page, setPage] = useState(0);
  const PAGES = {
    0: <InfiniteScroll />,
    1: <AllPosts />,
    2: <PostForm setPage={setPage} />,
  };
  return (
    <main className="App p-5 max-w-lg mx-auto ">
      <Navbar setPage={setPage} />
      {PAGES[page as keyof typeof PAGES]}
    </main>
  );
}

export default App;
