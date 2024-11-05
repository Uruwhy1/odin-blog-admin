import { useContext, useEffect, useState } from "react";
import styles from "./ViewPosts.module.css";
import LoadingContext from "../contexts/LoadingContext";
import Loading from "../components/Loading";
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

  const getUserRole = () => {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken?.role;
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const role = getUserRole();
      let url = `${import.meta.env.VITE_API_URL}/posts`;

      // if not admin get only user posts
      if (role !== "ADMIN") {
        console.log("xd");
        const userId = JSON.parse(atob(token.split(".")[1]))?.userId; // assuming userId is in the token
        url = `${import.meta.env.VITE_API_URL}/posts/user/:authorId=${userId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPosts(data.posts);
      setFilteredPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      showPopup(error.message, false);
    } finally {
      setTimeout(() => {
        setFading(true);
      }, 200);

      setTimeout(() => {
        setLoading(false);
      }, 700);
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
                className={styles.post}
                onClick={() => handlePostClick(post.id)}
              >
                <h2>{post.title}</h2>
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
