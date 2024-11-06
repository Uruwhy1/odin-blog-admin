import { useContext, useEffect, useState } from "react";
import styles from "./CreatePost.module.css";
import Loading from "../components/Loading";
import PopupContext from "../contexts/PopupContext";
import LoadingContext from "../contexts/LoadingContext";

import PropTypes from "prop-types";
import Markdown from "react-markdown";

const EditPost = ({ id }) => {
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const token = localStorage.getItem("authToken");

  const [fading, setFading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { showPopup } = useContext(PopupContext);

  // Initial post fetching
  useEffect(() => {
    console.log("Xd");
    setLoading(true);
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/${id}`
        );
        const data = await response.json();

        setPost(data);
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
        setImageLink(data.imageLink);
        setOriginalImage(data.imageLink);
        setShowCarousel(data.showCarousel);
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

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageLink(file);
  };

  const uploadImage = async () => {
    // check if image is new, otherwise do not upload
    if (imageLink && imageLink !== originalImage) {
      const formData = new FormData();
      formData.append("image", imageLink);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed.");
      }

      const data = await response.json();
      return data.imageUrl;
    }
    return originalImage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const imageUrl = await uploadImage();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            summary,
            content,
            imageLink: imageUrl,
            showCarousel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post.");
      }

      showPopup("Post uploaded.", true);
    } catch (err) {
      console.error(err);
      showPopup(err.message, false);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Loading
        style={{ display: loading ? "" : "none", opacity: fading ? "0" : "1" }}
      />
      {post ? (
        <main className={styles.container}>
          <form
            onSubmit={handleSubmit}
            className={formLoading ? styles.disabled : ""}
          >
            {formLoading ? <div className={styles.disabled}></div> : ""}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <label>
              <input
                type="checkbox"
                checked={showCarousel}
                onChange={(e) => setShowCarousel(e.target.checked)}
              />
              Show in Carousel
            </label>
            <button type="submit" disabled={formLoading}>
              {formLoading ? "Updating Post..." : "Update Post"}
            </button>
          </form>

          <div className={styles.content}>
            {imageLink && (
              <img
                src={imageLink}
                alt="Selected file preview"
                className={styles.previewImg}
              />
            )}
            <div className={styles.info}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.subtitle}>{summary}</p>
            </div>
            <div className={styles.markdown}>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        </main>
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
