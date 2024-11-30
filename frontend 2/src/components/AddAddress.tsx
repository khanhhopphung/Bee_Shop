import { Button, Form, Input, Modal, message } from "antd";
import React, { useState } from "react";

interface Address {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  is_default: number;
}
interface AddAddressProps {
  onAddSuccess: () => void; // Khai báo hàm nhận từ props
}

const AddAddress: React.FC<AddAddressProps> = ({ onAddSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");
  const [form] = Form.useForm(); // Khai báo form với hook useForm

  const handleAddAddress = async (address: Address) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/post-address-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm token nếu cần
          },
          body: JSON.stringify(address),
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success("Thêm địa chỉ mới thành công!");
        setIsModalOpen(false);
        onAddSuccess();
        form.resetFields(); // Sử dụng form.resetFields() thay vì Form.resetFields()
      } else {
        message.error(data.message || "Thêm địa chỉ thất bại!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thêm địa chỉ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        className="add-new-address-button"
        style={{
          justifyItems: "center",
          alignSelf: "center",
          padding: "8px 20px",
          borderRadius: "5px",
          fontWeight: "600",
          backgroundColor: "#666",
          color: "white",
          // transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = "#7280e0";
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLButtonElement;
          // target.style.backgroundColor = "#666";
        }}
        onClick={() => setIsModalOpen(true)}
      >
        Thêm Địa Chỉ Mới
      </Button>
      <Modal
        title="Thêm Địa Chỉ Mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form} // Kết nối form với useForm
          layout="vertical"
          onFinish={handleAddAddress}
          initialValues={{
            recipient_name: "",
            phone: "",
            address_line: "",

            state: "",
            city: "",
          }}
        >
          <Form.Item
            name="recipient_name"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số Điện Thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="address_line"
            label="Địa Chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            name="state"
            label="Quận/Huyện"
            rules={[{ required: true, message: "Vui lòng nhập quận/huyện!" }]}
          >
            <Input placeholder="Nhập quận/huyện" />
          </Form.Item>
          <Form.Item
            name="city"
            label="Thành Phố"
            rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
          >
            <Input placeholder="Nhập thành phố" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={loading}
          >
            Thêm Địa Chỉ
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AddAddress;
