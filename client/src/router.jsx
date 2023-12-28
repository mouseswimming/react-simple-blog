import { Navigate, createBrowserRouter, redirect } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import PostList from "./pages/PostList";
import Post from "./pages/Post";
import UserList from "./pages/UserList";
import User from "./pages/User";
import TodoList from "./pages/TodoList";
import ErrorPage from "./pages/ErrorPage";
import {
  getComments,
  getPost,
  getPosts,
  newPost,
  updatePost,
} from "./api/post";
import { getUser, getUsers } from "./api/users";
import { getTodos } from "./api/todos";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import { postFormValidator } from "./component/PostForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        // if there is any error happens to children below, error will be rendered out
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to="/posts" /> },
          {
            path: "posts",
            children: [
              {
                index: true,
                element: <PostList />,
                loader: async ({ request: { signal, url } }) => {
                  const searchParams = new URL(url).searchParams;
                  const query = searchParams.get("query");
                  const userId = searchParams.get("userId");
                  const filterParams = { q: query };
                  if (userId !== "") filterParams.userId = userId;

                  const posts = getPosts({
                    signal,
                    params: filterParams,
                  });
                  const users = getUsers({ signal });

                  return {
                    posts: await posts,
                    users: await users,
                    searchParams: { query, userId },
                  };
                },
              },
              {
                path: ":postId",

                children: [
                  {
                    index: true,
                    element: <Post />,
                    loader: async ({
                      params: { postId },
                      request: { signal },
                    }) => {
                      const comments = getComments(postId, signal);
                      const post = await getPost(postId, signal);
                      const user = getUser(post.userId, signal);

                      return {
                        post,
                        user: await user,
                        comments: await comments,
                      };
                    },
                  },
                  {
                    path: "edit",
                    element: <EditPost />,
                    loader: async ({
                      params: { postId },
                      request: { signal },
                    }) => {
                      const post = getPost(postId, signal);
                      const users = getUsers({ signal });

                      return { post: await post, users: await users };
                    },
                    action: async ({ request, params: { postId } }) => {
                      // we get submitted form data via below
                      const formData = await request.formData();
                      const title = formData.get("title");
                      const body = formData.get("body");
                      const userId = formData.get("userId");

                      const errors = postFormValidator({ userId, title, body });

                      if (Object.keys(errors).length) {
                        return errors;
                      }

                      await updatePost(
                        postId,
                        {
                          title,
                          body,
                          userId,
                        },
                        { signal: request.signal }
                      );

                      return redirect(`/posts/${postId}`);
                    },
                  },
                ],
              },
              {
                path: "new",
                element: <NewPost />,
                loader: ({ request: { signal } }) => {
                  return getUsers({ signal });
                },
                action: async ({ request }) => {
                  // we get submitted form data via below
                  const formData = await request.formData();
                  const title = formData.get("title");
                  const body = formData.get("body");
                  const userId = formData.get("userId");

                  const errors = postFormValidator({ userId, title, body });

                  if (Object.keys(errors).length) {
                    return errors;
                  }

                  const post = await newPost(
                    {
                      title,
                      body,
                      userId,
                    },
                    { signal: request.signal }
                  );

                  return redirect(`/posts/${post.id}`);
                },
              },
            ],
          },
          {
            path: "users",
            children: [
              {
                index: true,
                element: <UserList />,
                loader: ({ request: { signal } }) => {
                  return getUsers(signal);
                },
              },
              {
                path: ":userId",
                element: <User />,
                loader: async ({ params: { userId }, request: { signal } }) => {
                  const user = getUser(userId, signal);
                  const posts = getPosts({ signal, params: { userId } });
                  const todos = getTodos({ signal, params: { userId } });

                  return {
                    user: await user,
                    posts: await posts,
                    todos: await todos,
                  };
                },
              },
            ],
          },
          {
            path: "todos",
            element: <TodoList />,
            loader: ({ request: { signal } }) => {
              return getTodos(signal);
            },
          },
          { path: "*", element: <h1>404 - Page Not Found</h1> },
        ],
      },
    ],
  },
]);
