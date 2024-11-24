import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";

type Blog = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image: { image_url: string };
};

const BlogDetail = () => {
  const [blogDetail, setBlogDetail] = useState<Blog | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}`);
        console.log(id);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.data) {
          setBlogDetail(result.data);
          console.log(setBlogDetail);
        } else {
          console.error("Data is not valid:", result);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlogDetail();
  }, [id]);

  if (!blogDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-detail-container">
      <h1>{blogDetail.title}</h1>
      <img
        src={`http://127.0.0.1:8000/storage/${blogDetail.image}`}
        alt={blogDetail.title}
      />
      <p>{blogDetail.content}</p>{" "}
      <p>Tạo lúc: {new Date(blogDetail.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default BlogDetail;
