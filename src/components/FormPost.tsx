import { SubmitHandler, useForm } from "react-hook-form";
import { createPost, PostBody } from "../api/postApi";
import { useMutation, useQueryClient } from "react-query";

const defaultValues = {
  title: "",
  body: "",
};

function FormPost({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostBody>({
    defaultValues,
  });

  const mutation = useMutation(createPost, {
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: "/posts" });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData("/posts");

      // Optimistically update to the new value
      queryClient.setQueryData("/posts", (old) => {
        return [
          ...(old as Post[]),
          { ...newTodo, dateCreated: new Date().toISOString(), userId: 55 },
        ];
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: "/posts" });
    },
  });

  const onSubmit: SubmitHandler<PostBody> = ({ body, title }) => {
    mutation.mutate({ title, body });
    setPage(1);
  };

  return (
    <section className="mb-10">
      <h1 className="text-xl font-bold pb-5 text-center">Create Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-sm">
        <label className="text-sm text-neutral-300 mb-2">Title</label>
        <input
          {...register("title")}
          className="mb-5 px-3 py-2 rounded-xl bg-transparent focus:outline-none ring-[1px] ring-neutral-600"
        />

        <label className="text-sm text-neutral-300 mb-2">Post</label>
        <textarea
          rows={5}
          {...register("body", { required: true })}
          className="mb-5 px-3 py-2 rounded-xl bg-transparent focus:outline-none ring-[1px] ring-neutral-600"
        />

        <button
          className="rounded-full font-bold py-3 ring-[1px] ring-neutral-600 hover:bg-neutral-800"
          type="submit"
        >
          Add Post
        </button>
      </form>
    </section>
  );
}

export default FormPost;
