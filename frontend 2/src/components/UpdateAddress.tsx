import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";

const UpdateAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Updated Address:", values);
        setIsModalOpen(false); // Đóng modal sau khi cập nhật
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Đóng modal nếu người dùng hủy
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        Cập nhật
      </Button>
      <Modal
        title="Cập nhật địa chỉ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form} // Kết nối form với useForm
          layout="vertical"
          //   onFinish={handleAddAddress}
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
        </Form>
      </Modal>
    </>
  );
};

export default UpdateAddress;
