function Navbar({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <nav className="flex justify-end space-x-5 text-sm mb-10">
      <button
        onClick={() => setPage(0)}
        className="font-semibold rounded-full ring-[1px] bg-neutral-800 ring-slate-500 px-3 py-1 flex items-center gap-3"
      >
        Infinite Scroll
      </button>
      <button
        onClick={() => setPage(1)}
        className="font-semibold rounded-full ring-[1px] bg-neutral-800 ring-slate-500 px-3 py-1 flex items-center gap-3"
      >
        All Posts
      </button>

      <button
        onClick={() => setPage(2)}
        className="font-semibold rounded-full ring-[1px] bg-neutral-800 ring-slate-500 px-3 py-1 flex items-center gap-3"
      >
        Add Post
      </button>
    </nav>
  );
}

export default Navbar;
