import React from "react";
import { useActionData, useLoaderData, useNavigation } from "react-router-dom";
import { PostForm } from "../component/PostForm";

export default function NewPost() {
  const users = useLoaderData();
  const { state } = useNavigation();
  const errors = useActionData();

  const isSubmitting = state === "submitting" || state === "loading";
  return (
    <>
      <h1 className="page-title">New Post</h1>
      <PostForm users={users} errors={errors} isSubmitting={isSubmitting} />
    </>
  );
}
