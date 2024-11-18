import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { image } from "../../assets/image";

type Blog = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image: { image_url: string };
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs");

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra nếu có dữ liệu và gán vào state categories
        if (result && result.data && Array.isArray(result.data)) {
          setBlogs(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    // <Layout q={10}>
    <div className="sec-blog bg0 p-t-60 p-b-90">
      <div className="container">
        <div className="p-b-66">
          <h3 className="ltext-105 cl5 txt-center">Bài viết của chúng tôi</h3>
        </div>

        <div className="row">
          {blogs.map((blog) => (
            <div className="col-sm-6 col-md-4 p-b-40">
              <div className="blog-item">
                <div className="hov-img0">
                  <a href="blog-detail.html">
                    <img
                      src={`http://127.0.0.1:8000/storage/${blog.image.image_url}`}
                      alt={`Blog: ${blog.image}`}
                    />
                  </a>
                </div>
                <div className="p-t-15">
                  <h4 className="p-b-5">
                    <a
                      href="blog-detail.html"
                      className="mtext-101 cl2 hov-cl1 trans-04"
                    >
                      {blog.title}
                    </a>
                  </h4>
                  <span className="stext-108 cl6 p-t-10">
                    By Admin on{" "}
                    {new Date(blog.created_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </span>
                  <p className="stext-108 cl6 p-t-10">{blog.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    // </Layout>
  );
};

export default Blogs;
