import { useState } from "react";
import PropTypes from "prop-types";

import CreatePost from "../views/CreatePost";
import Header from "../components/Header";
import ViewPosts from "../views/ViewPosts";

const Dashboard = ({ user }) => {
  const [activeView, setActiveView] = useState("create"); // Default to viewing all posts

  return (
    <>
      <Header
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      {activeView === "create" && <CreatePost />}
      {activeView === "view" && <ViewPosts />}
    </>
  );
};

Dashboard.propTypes = {
  user: PropTypes.string,
};

export default Dashboard;
