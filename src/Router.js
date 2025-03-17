import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import About from "./routes/About";
import Community from "./routes/Community";
import CommunityDetail from "./routes/CommunityDetail";
import Jobs from "./routes/Jobs";
import JobsDetail from "./routes/JobsDetail";
import Login from "./routes/Login";
import CommunityMakeQuestion from "./routes/CommunityMakeQuestion";
import JobsApply from "./routes/JobsApply";
import SignUp from "./routes/SignUp";
import ChatBot from "./routes/ChatBot";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "jobs/jobsdetail/:id",
        element: <JobsDetail />,
      },
      {
        path: "jobs/apply/:id",
        element: <JobsApply />,
      },
      {
        path: "community",
        element: <Community />,
      },
      {
        path: "community/make_question",
        element: <CommunityMakeQuestion />,
      },
      {
        path: "community/communitydetail/:id",
        element: <CommunityDetail />,
      },
      {
        path: "chatbot",
        element: <ChatBot />,
      },
    ],
  },
]);

export default router;
