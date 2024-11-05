import { useState } from "react";
import PropTypes from "prop-types";

import CreatePost from "../views/CreatePost";
import Header from "../components/Header";

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
    </>
  );
};

Dashboard.propTypes = {
  user: PropTypes.string,
};

export default Dashboard;
