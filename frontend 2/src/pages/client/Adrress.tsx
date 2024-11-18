import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import AddAddress from "../../components/AddAddress";
import { Address } from "cluster";

interface Adrress {
  id: string | number;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
}

const Adrress: React.FC = () => {
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<Adrress[]>([]);
  const token = localStorage.getItem("access_token");
  console.log(token);
  const handleDeleteAddress = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete-address-user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm token nếu cần
          },
          // body: JSON.stringify(address),
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success("Xóa địa chỉ thành công!");
        setAddresses(addresses.filter((addr) => addr.id !== id));
        fetchAddresses();
      } else {
        message.error(data.message || "Xóa địa chỉ thất bại!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xóa địa chỉ!");
    } finally {
      setLoading(false);
    }
  };
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      // Lấy token từ localStorage hoặc từ Redux store

      const response = await fetch(
        `http://127.0.0.1:8000/api/get-adrress-user`, // Đảm bảo URL API đúng
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.data);
      } else {
        console.error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);
  const submit = async () => {
    fetchAddresses();
  };

  return (
    <div className="account-page">
      <div className="account-content">
        <div className="menu">
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="fa-solid fa-circle-user"
              style={{ marginLeft: "5px", fontSize: "40px" }}
            ></i>
            <div className="profile-details" style={{ marginLeft: "10px" }}>
              <h3>Username</h3>

              <p>
                {" "}
                <EditOutlined /> Sửa hồ sơ
              </p>
            </div>
          </div>

          <ul>
            <li>
              <a href="/account">
                <i
                  className="fa-solid fa-user"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Tài khoản của tôi
              </a>
              <ul style={{ marginLeft: "30px" }}>
                <li>
                  <a href="/account">Hồ sơ</a>
                </li>
                <li>
                  <a href="/update-password">Đổi Mật Khẩu</a>
                </li>
                <li>
                  <a href="/adrress">Địa Chỉ</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/order-list">
                <i
                  className="fa-solid fa-clipboard-list"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Đơn mua
              </a>
            </li>

            <li>
              <a href="voucher">
                <i
                  className="fa-solid fa-ticket"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Kho Voucher
              </a>
            </li>
          </ul>
        </div>

        <div className="address-info">
          <div className="adrs-1" style={{ display: "flex" }}>
            <h2>Địa chỉ của tôi </h2>
            <Button style={{ marginLeft: "60%" }}>
              <AddAddress onAddSuccess={submit} />
            </Button>
          </div>

          <div className="address-list">
            {loading ? (
              <p>Đang tải địa chỉ...</p>
            ) : (
              <>
                {Array.isArray(addresses) && addresses.length > 0 ? (
                  addresses.map((address, index) => (
                    <div key={index} className="address-item">
                      <div className="adrs-items" style={{ marginTop: "6px" }}>
                        <p>
                          <b>{address.recipient_name}</b> | {address.phone}
                        </p>
                        <p>
                          {address.address_line} - {address.state} -{" "}
                          {address.city}
                        </p>
                      </div>
                      <div className="address-actions">
                        <div
                          className="adrs-actions"
                          style={{ display: "flex" }}
                        >
                          <Button type="link">Cập nhật</Button>
                          <Popconfirm
                            title="Xóa sản phẩm"
                            description="Bạn có chắc muốn xóa sản phẩm này không?"
                            onConfirm={() =>
                              handleDeleteAddress(Number(address.id))
                            }
                            okText="Có"
                            cancelText="Không"
                          >
                            <Button danger>
                              <DeleteOutlined />
                            </Button>
                          </Popconfirm>
                        </div>
                        <Button style={{ marginBottom: "20px" }}>
                          Thiết lập mặc định
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Không có địa chỉ nào.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adrress;
