import { useContext, useEffect, useState } from "react";
import styles from "./ViewPosts.module.css";
import LoadingContext from "../contexts/LoadingContext";
import PopupContext from "../contexts/PopupContext";
import Loading from "../components/loading/Loading";
import PropTypes from "prop-types";

const ViewUsers = ({ setActiveView }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [fading, setFading] = useState(false);

  const { loading, setLoading } = useContext(LoadingContext);
  const { showPopup } = useContext(PopupContext);

  const token = localStorage.getItem("authToken");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));

  const isAdmin = decodedToken.role === "ADMIN";

  const fetchUsers = async () => {
    if (!isAdmin) setActiveView("view"); // only fetch if the user is admin
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showPopup(error.message, false);
    } finally {
      setTimeout(() => setFading(true), 500);
      setTimeout(() => setLoading(false), 900);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let displayedUsers = users;

    if (searchTerm) {
      displayedUsers = displayedUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(displayedUsers);
  }, [searchTerm, users]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "AUTHOR" ? "USER" : "AUTHOR";
    if (currentRole == "ADMIN") return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to change user role.");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      showPopup(`User role changed to ${newRole}.`, true);
    } catch (error) {
      console.error("Error changing user role:", error);
      showPopup(error.message, false);
    }
  };

  return (
    <>
      <Loading
        style={{ display: loading ? "" : "none", opacity: fading ? "0" : "1" }}
      />

      <div className={styles.container}>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.posts}>
          {filteredUsers.length ? (
            filteredUsers.map((user) => (
              <div key={user.id}>
                <div className={styles.post}>
                  <h2>{user.username}</h2>
                  <button
                    className={styles[user.role]}
                    onClick={() => handleRoleToggle(user.id, user.role)}
                  >
                    {user.role}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </>
  );
};

ViewUsers.propTypes = {
  setActiveView: PropTypes.func,
};

export default ViewUsers;
