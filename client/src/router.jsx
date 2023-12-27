import { Navigate, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import PostList from "./pages/PostList";
import Post from "./pages/Post";
import UserList from "./pages/UserList";
import User from "./pages/User";
import TodoList from "./pages/TodoList";
import ErrorPage from "./pages/ErrorPage";
import { getComments, getPost, getPosts } from "./api/post";
import { getUser, getUsers } from "./api/users";
import { getTodos } from "./api/todos";

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
                loader: ({ request: { signal } }) => {
                  return getPosts(signal);
                },
              },
              {
                path: ":postId",
                element: <Post />,
                loader: async ({ params: { postId }, request: { signal } }) => {
                  const comments = getComments(postId, signal);
                  const post = await getPost(postId, signal);
                  const user = getUser(post.userId, signal);

                  return { post, user: await user, comments: await comments };
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
