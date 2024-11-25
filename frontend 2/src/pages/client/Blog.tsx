import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";

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
        const response = await fetch(`http://127.0.0.1:8000/api/blogs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result && result.data && Array.isArray(result.data)) {
          setBlogs(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      {/* Title page */}
      <section
        className="bg-img1 txt-center p-lr-15 p-tb-92"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/42/9c/f2/429cf22bcfc7ec6e658fd617bda18b88.jpg')",
        }}
      >
        <h2 className="ltext-105 cl0 txt-center">Blog</h2>
      </section>

      {/* Blog Section */}
      <section className="bg0 p-t-62 p-b-60">
        <div className="container">
          <div className="row">
            {/* Blog Content */}
            <div className="col-md-8 col-lg-9 p-b-80">
              <div className="p-r-45 p-r-0-lg">
                {blogs.map((blog) => (
                  <div className="p-b-63" key={blog.id}>
                    <a
                      href="blog-detail.html"
                      className="hov-img0 how-pos5-parent"
                    >
                      <img
                        src={`http://127.0.0.1:8000/storage/${blog.image}`}
                        alt={`Blog: ${blog.title}`}
                      />
                    </a>
                    <div className="p-t-32">
                      <h4 className="p-b-15">
                        <a
                          href="blog-detail.html"
                          className="ltext-108 cl2 hov-cl1 trans-04"
                        >
                          {blog.title}
                        </a>
                      </h4>
                      <p className="stext-108 cl6 p-t-10">
                        {blog.content.length > 100
                          ? `${blog.content.substring(0, 100)}...`
                          : blog.content}
                        {blog.content.length > 100 && (
                          <a
                            href="#"
                            className="mtext-102 cl2 hov-cl1 trans-04"
                          >
                            Xem thêm
                          </a>
                        )}
                      </p>
                      <div className="flex-w flex-sb-m p-t-18">
                        <span className="flex-w flex-m stext-111 cl2 p-r-30 m-tb-10">
                          <span>
                            <span className="cl4">By</span> Admin
                            <span className="cl12 m-l-4 m-r-6">|</span>
                          </span>
                          <span>
                            {new Date(blog.created_at).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Pagination */}
                <div className="flex-l-m flex-w w-full p-t-10 m-lr--7">
                  <a
                    href="#"
                    className="flex-c-m how-pagination1 trans-04 m-all-7 active-pagination1"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="flex-c-m how-pagination1 trans-04 m-all-7"
                  >
                    2
                  </a>
                </div>
              </div>
            </div>
            {/* Search Bar */}
            <div className="col-md-4 col-lg-3 p-b-80">
              <div className="side-menu">
                <div className="bor17 of-hidden pos-relative">
                  <input
                    className="stext-103 cl2 plh4 size-116 p-l-28 p-r-55"
                    type="text"
                    name="search"
                    placeholder="Search"
                  />
                  <button className="flex-c-m size-122 ab-t-r fs-18 cl4 hov-cl1 trans-04">
                    <i className="zmdi zmdi-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
