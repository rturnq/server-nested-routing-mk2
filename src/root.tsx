import { Scripts } from "solid-start/components";
import { Router, Outlet, RouteDefinition, useRouteParams } from "./router";

function Home() {
  return <h1>Home</h1>;
}

function NotFound() {
  return <h1>Not Found</h1>;
}

function PostsRoute() {
  return (
    <>
      <h1>Posts</h1>
      <Outlet />
    </>
  );
}

function Posts() {
  return <h2>Post List</h2>;
}

function PostRoute() {
  const params = useRouteParams();
  return (
    <>
      <h2>Post {params().id}</h2>
      <Outlet />
    </>
  );
}

function PostDetails() {
  return <h3>Post Details</h3>;
}

function PostComments() {
  return <h3>Post Comments</h3>;
}

const routes: RouteDefinition[] = [
  {
    path: "posts",
    component: PostsRoute,
    children: [
      {
        path: "/",
        component: Posts,
      },
      {
        path: ":id",
        component: PostRoute,
        children: [
          {
            path: "/",
            component: PostDetails,
          },
          {
            path: "comments",
            component: PostComments,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    component: Home,
  },
  {
    path: "*all",
    component: NotFound,
  },
];

export interface AppProps {
  url: string;
  prevUrl?: string;
  context: any;
}

export default function App(props: AppProps) {
  return (
    <Router
      location={props.url}
      prevLocation={props.prevUrl || ""}
      routes={routes}
      context={props.context}
    >
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <nav>
            <a href="/">Home</a>
            {" | "}
            <a href="/posts">Posts</a>
            {" | "}
            <a href="/posts/1">Post 1</a>
            {" | "}
            <a href="/posts/1/comments">Post 1 Comments</a>
            {" | "}
            <a href="/posts/2">Post 2</a>
            {" | "}
            <a href="/posts/2/comments">Post 2 Comments</a>
            {" | "}
            <a href="/nowhere">Nowhere</a>
          </nav>
          <div>Root</div>
          <Outlet />
          <Scripts />
        </body>
      </html>
    </Router>
  );
}
