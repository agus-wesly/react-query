import { getPosts, deletePost } from "../api/postApi";
import { useRef, useCallback, Key } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import SinglePost from "../components/SinglePost";

function InfiniteScroll() {
  const queryClient = useQueryClient();
  const {
    data,
    isFetching,
    isFetchingNextPage,
    error,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery(
    "/post-infinite",
    ({ pageParam = 1 }) => getPosts(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    }
  );

  const mutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("/post-infinite");
    },
  });

  //Setting Up Intersection Observer
  const intersecObserver = useRef<IntersectionObserver | null>(null);
  const pageRef = useCallback(
    (page: HTMLElement) => {
      if (isLoading) return;
      if (intersecObserver.current) intersecObserver.current.disconnect();

      intersecObserver.current = new IntersectionObserver((entry) => {
        if (entry[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (page) {
        intersecObserver.current.observe(page);
      }
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  let content;

  if (error) content = <p>Error.</p>;
  if (isFetching) content = <p>Loading...</p>;
  if (isSuccess) {
    content = (
      <>
        <h1 className="text-xl font-bold pb-5 text-center">Infinite Scroll</h1>
        {data?.pages?.map((pages) => {
          return pages.map((pg: Post, i: Key) => {
            if (i === pages.length - 1) {
              return (
                <SinglePost
                  key={i}
                  ref={pageRef}
                  title={pg.title}
                  body={pg.body}
                  userId={pg.userId}
                  dateCreated={pg.dateCreated}
                  id={pg.id}
                />
              );
            }
            return (
              <>
                <SinglePost
                  id={pg.id}
                  dateCreated={pg.dateCreated}
                  title={pg.title}
                  body={pg.body}
                  userId={pg.userId}
                />
              </>
            );
          });
        })}
      </>
    );
  }

  return (
    <section>
      <button onClick={() => mutation.mutate(11)}>Invalidate !</button>
      {content}
      {!hasNextPage && hasNextPage !== undefined && <h1>End </h1>}
      {isFetchingNextPage && <p className="font-bold">Loading Next Post...</p>}
    </section>
  );
}

export default InfiniteScroll;
