import React, { useEffect, useState } from "react";

type Props = {};
interface Category {
  id: number;
  name: string;
}
const CategoryPage = (props: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories");

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra nếu có dữ liệu và gán vào state categories
        if (result && result.data && Array.isArray(result.data)) {
          setCategories(result.data);
          console.log(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Chạy chỉ một lần khi component được mount

  return (
    <div>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <a>{category.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
