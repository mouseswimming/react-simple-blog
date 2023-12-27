import React from "react";
import {
  NavLink,
  Outlet,
  ScrollRestoration,
  useNavigation,
} from "react-router-dom";

export default function RootLayout() {
  const { state } = useNavigation();
  const isLoading = state === "loading";

  return (
    <>
      <nav className="top-nav">
        <div className="nav-text-large">My App</div>
        <ul className="nav-list">
          <li>
            <NavLink to={"/posts"}>Posts</NavLink>
          </li>
          <li>
            <NavLink to={"/users"}>Users</NavLink>
          </li>
          <li>
            <NavLink to={"/todos"}>Todos</NavLink>
          </li>
        </ul>
      </nav>
      <ScrollRestoration />
      {isLoading && <div className="loading-spinner"></div>}
      <div className={`container ${isLoading ? "loading" : ""}`}>
        <Outlet />
      </div>
    </>
  );
}
