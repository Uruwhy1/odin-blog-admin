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
      <div>
        <h1>Dashboard</h1>

        {activeView === "create" && <CreatePost />}
      </div>
    </>
  );
};

Dashboard.propTypes = {
  user: PropTypes.string,
};

export default Dashboard;
