import SinglePost from "../components/SinglePost";
import { getAllPosts } from "../api/postApi";
import { useQuery } from "react-query";

function AllPosts() {
  const { data: posts } = useQuery<Post[]>("/posts", {
    queryFn: getAllPosts,
    select: (posts) => {
      return posts.sort((a, b) => b.dateCreated?.localeCompare(a?.dateCreated));
    },
  });

  const content = (
    <>
      <h1 className="text-xl font-bold pb-5 text-center">All Posts</h1>
      {posts?.map((post, i) => (
        <SinglePost key={i} {...post} />
      ))}
    </>
  );
  return <section>{content}</section>;
}

export default AllPosts;

//
