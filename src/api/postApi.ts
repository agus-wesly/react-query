export async function getAllPosts() {
  const resp = await fetch(`http://localhost:3500/post`);
  const posts = await resp.json();

  return posts;
}

export async function getPosts(pageNum = 1) {
  const resp = await fetch(
    `http://localhost:3500/post?_page=${pageNum}&_limit=10`
  );
  const posts = await resp.json();

  return posts.map((post: Post) => {
    if (!post.dateCreated) {
      return { ...post, dateCreated: new Date().toISOString() };
    }
    return post;
  });
}

export type PostBody = Omit<Post, "userId" | "dateCreated" | "id">;

export async function createPost({
  title,
  body,
}: Omit<Post, "userId" | "dateCreated" | "id">) {
  const resp = await fetch("http://localhost:3500/post", {
    method: "POST",
    body: JSON.stringify({
      userId: 55,
      title,
      body,
      dateCreated: new Date().toISOString(),
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  const newPost = await resp.json();
  return newPost;
}

export async function deletePost(id: number) {
  const resp = await fetch(`http://localhost:3500/post/${id}`, {
    method: "DELETE",
    body: JSON.stringify({
      id,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  const newPost = await resp.json();
  return newPost;
}
