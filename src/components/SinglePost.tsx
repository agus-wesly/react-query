import React, { useState } from "react";
import TrashIcon from "./TrashIcon";
import { formatDistanceToNow, parseISO } from "date-fns";
import { deletePost } from "../api/postApi";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import Modal from "./Modal";

const Page = React.forwardRef<HTMLElement, Post>(
  ({ title, body, userId, dateCreated, id }, ref) => {
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);

    const mutation = useMutation(deletePost, {
      onMutate: async (id) => {
        //Cancel current query
        await queryClient.cancelQueries({ queryKey: "/posts" });

        //Get Prev Data
        const previousTodos = queryClient.getQueryData("/posts");

        //Begin optimistic Update
        queryClient.setQueryData<Post[]>("/posts", (old) => [
          ...(old?.filter((post) => post.id !== id) as any),
        ]);

        return { previousTodos };
      },

      onError: (_, __, context) => {
        queryClient.setQueryData(["posts"], context?.previousTodos);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: "/posts" });
      },
    });

    const handleDeleteClick = () => {
      if (setIsOpen) {
        setIsOpen(true);
      }
    };

    const handleMutation = () => {
      mutation.mutate(id);
      setIsOpen(false);
    };

    const timeDistance = formatDistanceToNow(parseISO(dateCreated));

    const contentBody = (
      <article>
        <h1 className="text-lg capitalize font-bold mb-3">{title}</h1>
        <p className="text-neutral-300 text-sm mb-6">{body}</p>

        {/* Button Container */}
        <div className="flex justify-between items-center text-xs">
          <button
            onClick={handleDeleteClick}
            className="font-semibold bg-neutral-800 rounded-full ring-[1px] ring-slate-500 px-3 py-1 flex items-center gap-3"
          >
            <TrashIcon />
            Delete
          </button>
          <div className="flex items-center text-neutral-400 ">
            <p className="mr-5 font-bold">User {userId} </p>
            <p>{timeDistance} ago</p>
          </div>
        </div>
      </article>
    );

    return (
      <>
        <article
          className="rounded-lg ring-[1px] ring-neutral-600 p-5 mb-5"
          ref={ref ?? undefined}
        >
          {contentBody}
        </article>

        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleMutation={handleMutation}
        />
      </>
    );
  }
);

export default Page;
