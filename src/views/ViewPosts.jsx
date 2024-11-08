import { useContext, useEffect, useState } from "react";
import styles from "./ViewPosts.module.css";
import LoadingContext from "../contexts/LoadingContext";
import Loading from "../components/loading/Loading";
import PopupContext from "../contexts/PopupContext";
import PropTypes from "prop-types";

const ViewPosts = ({ handlePostClick }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fading, setFading] = useState(false);

  const { loading, setLoading } = useContext(LoadingContext);
  const { showPopup } = useContext(PopupContext);

  const token = localStorage.getItem("authToken");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));

  const getUserRole = () => {
    return decodedToken.role;
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const role = await getUserRole();
      let url = `${import.meta.env.VITE_API_URL}/posts/all`;

      // if not admin get only user posts
      if (role !== "ADMIN") {
        const userId = JSON.parse(atob(token.split(".")[1])).id;
        url = `${import.meta.env.VITE_API_URL}/posts/user/${userId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setPosts(data.posts);
      setFilteredPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      showPopup(error.message, false);
    } finally {
      setTimeout(() => {
        setFading(true);
      }, 500);

      setTimeout(() => {
        setLoading(false);
      }, 900);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let displayedPosts = posts;

    if (searchTerm) {
      displayedPosts = displayedPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(displayedPosts);
  }, [searchTerm, posts]);

  const handleDelete = async (event, postID) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${postID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the post.");
      }

      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postID));
      setFilteredPosts((prevPosts) => prevPosts.filter((p) => p.id !== postID));

      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post: " + error.message);
    }
  };

  const handleTogglePublish = async (event, postId, currentStatus) => {
    event.stopPropagation();
    console.log(currentStatus);
    const newStatus = !currentStatus;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ published: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update post status.");

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, published: newStatus } : post
        )
      );
      setFilteredPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, published: newStatus } : post
        )
      );

      showPopup(
        `Post ${newStatus ? "published" : "unpublished"} successfully.`,
        true
      );
    } catch (error) {
      console.error("Error updating post status:", error);
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
            placeholder="Search by title or summary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.posts}>
          {filteredPosts.length ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`${
                  decodedToken.role === "ADMIN" &&
                  decodedToken.id === post.userId
                    ? styles.ownPost
                    : ""
                }`}
              >
                <div
                  className={`${styles.post} }`}
                  onClick={() => handlePostClick(post.id)}
                >
                  <h2>{post.title}</h2>
                  <button
                    className={`${
                      post.published ? styles.published : styles.unpublished
                    }`}
                    onClick={(e) => {
                      handleTogglePublish(e, post.id, post.published);
                    }}
                  >
                    {post.published ? "Published" : "Unpublished"}
                  </button>
                </div>
                <button
                  onClick={(event) => handleDelete(event, post.id)}
                  className={styles.delete}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line
                      className={styles.animate}
                      x1="8"
                      y1="1"
                      x2="16"
                      y2="1"
                    />

                    <line
                      className={styles.animate}
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="5"
                    />
                    <line
                      className={styles.animate}
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="5"
                    />
                    <path d="M19 7v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />
                    <polyline className={styles.animate} points="3 6 21 6" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
    </>
  );
};

ViewPosts.propTypes = {
  handlePostClick: PropTypes.func.isRequired,
};

export default ViewPosts;
