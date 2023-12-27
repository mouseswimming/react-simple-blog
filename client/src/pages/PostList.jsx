import React from "react";
import { useLoaderData } from "react-router-dom";
import PostCard from "../component/PostCard";

export default function PostList() {
  const posts = useLoaderData();
  return (
    <>
      <h1 className="page-title">Posts</h1>
      <div className="card-grid">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}
