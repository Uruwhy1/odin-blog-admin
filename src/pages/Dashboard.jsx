import { useState } from "react";

import CreatePost from "../views/CreatePost";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("create"); // Default to viewing all posts

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <button onClick={() => setActiveView("view")}>View Posts</button>
        <button onClick={() => setActiveView("create")}>Create New Post</button>
      </nav>

      {activeView === "create" && <CreatePost />}
    </div>
  );
};

export default Dashboard;
