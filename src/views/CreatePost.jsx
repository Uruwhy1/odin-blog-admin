import { useContext, useState, useEffect } from "react";
import PopupContext from "../contexts/PopupContext";

import styles from "./createPost.module.css";
import Markdown from "react-markdown";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);

  const [loading, setLoading] = useState(false);
  const { showPopup } = useContext(PopupContext);

  const token = localStorage.getItem("authToken");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token);
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
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
      });

      if (!response.ok) {
        throw new Error("Failed to create post.");
      }

      setTitle("");
      setSummary("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setShowCarousel(false);
    } catch (err) {
      console.error(err);
      showPopup("err", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clean up the preview URL when the component is unmounted or when imageFile changes
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile]);

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit}>
        {loading ? <div className={styles.loading}></div> : ""}
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
        <button type="submit" disabled={loading}>
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>

      <div className={styles.content}>
        {imagePreview && (
          <img
            src={imagePreview}
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
  );
};

export default CreatePost;
