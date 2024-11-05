import { useContext, useEffect, useState } from "react";
import styles from "./ViewPosts.module.css";
import LoadingContext from "../contexts/LoadingContext";
import Loading from "../components/Loading";
import PopupContext from "../contexts/PopupContext";

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [fading, setFading] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);

  const { showPopup } = useContext(PopupContext);

  // initial post fetching
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
        const data = await response.json();
        setPosts(data.posts);
        setFilteredPosts(data.posts);

        setFading(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        console.log(posts, filteredPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        showPopup(error.message, false);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filtering with text input
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
              <div key={post.id} className={styles.post}>
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

export default ViewPosts;
