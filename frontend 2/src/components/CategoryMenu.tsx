import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  sku: string;
  parent_category_id: null | number;
  is_active: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

const CategoryMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/categories`);
        const result = await response.json();
        setCategories(result.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-menu">
      <h6
        className="ltext-105 cl5 txt-center respon1"
        // style={{ marginBottom: "-10px", marginTop: "-110px" }}
      >
        Danh Mục
      </h6>
      <div className="categories">
        {categories.map((category, index) => (
          <div className="category-item" key={index}>
            <img
              src={category.image_url || "default-image-path.jpg"}
              alt={category.name}
            />
            <p style={{ fontFamily: "Poppins-Regular" }}>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
