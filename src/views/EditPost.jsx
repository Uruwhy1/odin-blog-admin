import { useContext, useEffect, useState } from "react";
import styles from "./EditPost.module.css";
import Loading from "../components/Loading";
import PopupContext from "../contexts/PopupContext";
import LoadingContext from "../contexts/LoadingContext";

import PropTypes from "prop-types";

const EditPost = ({ id }) => {
  const [post, setPost] = useState([]);

  const [fading, setFading] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);

  const { showPopup } = useContext(PopupContext);

  // initial post fetching
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/${id}`
        );
        const data = await response.json();
        console.log(data);
        setPost(data);

        setFading(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching posts:", error);
        showPopup(error.message, false);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {" "}
      <Loading
        style={{ display: loading ? "" : "none", opacity: fading ? "0" : "1" }}
      />
      {post ? (
        <div className={styles.container}>
          <p>{post.title}</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

EditPost.propTypes = {
  id: PropTypes.number.isRequired,
};

export default EditPost;
