import FormPost from "../components/FormPost";

function PostForm({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <section>
      <FormPost setPage={setPage} />
    </section>
  );
}

export default PostForm;
