import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import Heart from "../../components/Heart";

interface List {
  product: {
    id: number;
    name: string;
    sku: string;
    description: string;
    category_id: number;
    stock: number;
    price: number | null;
    is_active: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    price_max: number | null;
    price_min: number | null;
    image_url: string;
    alt_text: string | null;
    product_variants: {
      id: number;
      product_id: number;
      size_id: number;
      color_id: number;
      price: number | null;
      stock: number;
      is_active: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      images: {
        id: number;
        product_id: number;
        variant_id: number;
        alt_text: string | null;
        image_url: string;
        is_active: number;
        created_at: string;
        updated_at: string;
      }[];
    }[];
  };
}

const WishList: React.FC = () => {
  const truncateProductName = (name: string, maxWords: number = 8) => {
    const words = name.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return name;
  };
  const favoriteItems = useSelector(
    (state: RootState) => state.favorites.items
  );
  const [list, setList] = useState<List[]>([]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wishlist`, {
        // Thay đổi URL API của bạn
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Thay đ��i token của bạn
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data: List[] = await response.json();
      setList(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="container">
      <h2 style={{ marginTop: "30px", marginBottom: "20px" }}>
        Danh sách yêu thích
      </h2>
      <div
        className="wishlist-container"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        {list.map((item) => (
          <div
            key={item.product.id}
            className="col-3 p-b-35" // Sử dụng col-3 để có 4 sản phẩm mỗi hàng
          >
            <div className="block2">
              <Link to={`/products/${item.product.id}`}>
                <div className="block2-pic hov-img0">
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.product.image_url}`}
                    alt={`Product: ${item.product.name}`}
                  />
                  <a
                    href="#"
                    className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04"
                  >
                    Mua Ngay
                  </a>
                </div>
              </Link>
              <div className="block2-txt flex-w flex-t p-t-14">
                <div className="block2-txt-child1 flex-col-l">
                  <a
                    href={`/products/${item.product.id}`}
                    className="stext-104 cl4 hov-cl1 trans-04"
                  >
                    {truncateProductName(item.product.name)}
                  </a>
                  <span className="stext-105 cl3">
                    {item.product.price_min
                      ? item.product.price_min.toLocaleString()
                      : ""}
                    ₫
                  </span>
                </div>
                {/* <div className="block2-txt-child2 flex-r p-t-3">
                  <img
                    className="icon-heart1 dis-block trans-04"
                    src="images/icons/icon-heart-02.png" // Update logic nếu cần
                    alt="ICON"
                  />
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WishList;
