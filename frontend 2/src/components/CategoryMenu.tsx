import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setSearchRedux } from "../store/searchSlice";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const searchkey = (name: string) => {
    // navigate(`/search?q=${key}`);

    dispatch(setSearchRedux(name));
  };

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
          <Link to={"/products"}>
            <div
              className="category-item"
              key={index}
              onClick={() => searchkey(category.name)}
            >
              <img
                src={category.image_url || "default-image-path.jpg"}
                alt={category.name}
              />
              <p style={{ fontFamily: "Poppins-Regular" }}>{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
