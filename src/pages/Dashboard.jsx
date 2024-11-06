import { useState } from "react";
import PropTypes from "prop-types";

import CreatePost from "../views/CreatePost";
import Header from "../components/Header";
import ViewPosts from "../views/ViewPosts";
import EditPost from "../views/EditPost";

const Dashboard = ({ user, setActiveView, activeView }) => {
  const [currentPost, setCurrentPost] = useState(null);

  const handlePostClick = (id) => {
    setCurrentPost(id);
    setActiveView("edit");
  };

  return (
    <>
      <Header
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      {activeView === "create" && <CreatePost />}
      {activeView === "view" && <ViewPosts handlePostClick={handlePostClick} />}
      {activeView === "edit" && <EditPost id={currentPost} />}
    </>
  );
};

Dashboard.propTypes = {
  user: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
};

export default Dashboard;
