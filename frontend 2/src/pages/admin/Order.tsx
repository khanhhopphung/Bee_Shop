<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  InputNumber,
  Switch,
  DatePicker,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
=======
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, InputNumber, Switch, DatePicker } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from '../axiosConfig';
import moment from 'moment';
>>>>>>> fix-dev

// Define the types for Order, User, Address, and Promotion
interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  promotion_id: number | null;
  address_id: number;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Promotion {
  id: number;
  code: string;
}

interface User {
  id: number;
  username: string;
}

interface Address {
  id: number;
  address: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [form] = Form.useForm();

  const fetchOrders = async () => {
    setLoading(true);
    try {

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        return;
      }
  
      const response = await axios.get("http://127.0.0.1:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Gửi token trong header Authorization
        },
      });
  

      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
<<<<<<< HEAD
      message.error("Failed to load orders");
=======
      message.error("Lỗi khi tải đơn hàng.");
>>>>>>> fix-dev
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/promotions");
      const data = Array.isArray(response.data) ? response.data : [];
      setPromotions(data);
    } catch (error) {
      message.error("Failed to load promotions");
      setPromotions([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users");
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
    } catch (error) {
      message.error("Failed to load users");
      setUsers([]);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/addresses");
      const data = Array.isArray(response.data) ? response.data : [];
      setAddresses(data);
    } catch (error) {
      message.error("Failed to load addresses");
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPromotions();
    fetchUsers();
    fetchAddresses();
  }, []);

  useEffect(() => {
    const lowerKeyword = searchKeyword.toLowerCase();
    const filtered = orders.filter((order) => {
      const userName =
        users.find((user) => user.id === order.user_id)?.username || "";
      const address =
        addresses.find((addr) => addr.id === order.address_id)?.address || "";
      return (
        userName.toLowerCase().includes(lowerKeyword) ||
        order.status.toLowerCase().includes(lowerKeyword) ||
        address.toLowerCase().includes(lowerKeyword)
      );
    });
    setFilteredOrders(filtered);
  }, [searchKeyword, orders, users, addresses]);

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`);
      message.success("Order deleted successfully");
      fetchOrders(); // Refresh the list
    } catch (error) {
      message.error("Failed to delete order");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentOrder) {
        await axios.put(
          `http://127.0.0.1:8000/api/orders/${currentOrder.id}`,
          values
        );
        message.success("Order updated successfully");
        fetchOrders(); // Refresh orders after updating
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update order");
    }
  };

  const handleViewDetails = (orderId: number) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      Modal.info({
        title: "Order Details",
        content: (
          <div>
            <p>Order ID: {order.id}</p>
            <p>
              User: {users.find((user) => user.id === order.user_id)?.username}
            </p>
            <p>Order Date: {order.order_date}</p>
            <p>Status: {order.status}</p>
            <p>Total Amount: {order.total_amount}</p>
            <p>Shipping Cost: {order.shipping_cost}</p>
            <p>Payment Method: {order.payment_method}</p>
            {order.promotion_id && (
              <p>
                Promotion:{" "}
                {promotions.find((promo) => promo.id === order.promotion_id)
                  ?.code || "N/A"}
              </p>
            )}
            <p>
              Address:{" "}
              {addresses.find((address) => address.id === order.address_id)
                ?.address || "N/A"}
            </p>
            <p>Active: {order.is_active ? "Yes" : "No"}</p>
          </div>
        ),
      });
    }
  };

  const columns = [
    { title: "Stt", dataIndex: "id", key: "id" },
    {
      title: "User Name",
      dataIndex: "user_id",
      key: "user_id",
      render: (userId: number) =>
        users.find((user) => user.id === userId)?.username || "Unknown",
    },
    { title: "Order Date", dataIndex: "order_date", key: "order_date" },
    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Shipping Cost",
      dataIndex: "shipping_cost",
      key: "shipping_cost",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Promotion Code",
      dataIndex: "promotion_id",
      key: "promotion_id",
      render: (promoId: number) => {
        const promo = promotions.find((p) => p.id === promoId);
        return promo ? promo.code : "N/A";
      },
    },
    {
      title: "Address",
      dataIndex: "address_id",
      key: "address_id",
      render: (addressId: number) => {
        const address = addresses.find((address) => address.id === addressId);
        return address ? address.address : "N/A";
      },
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Order) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
          />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            danger
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search orders by user, status, or address"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
      />

      {/* Modal for editing order */}
      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => currentOrder && form.submit()}
      >
        <Form
          form={form}
          initialValues={
            currentOrder
              ? {
                  order_date: moment(currentOrder.order_date),
                  total_amount: currentOrder.total_amount,
                  shipping_cost: currentOrder.shipping_cost,
                  payment_method: currentOrder.payment_method,
                  status: currentOrder.status,
                  promotion_id: currentOrder.promotion_id,
                  address_id: currentOrder.address_id,
                  is_active: currentOrder.is_active,
                }
              : {}
          }
          onFinish={handleSubmit}
        >
          <Form.Item
            name="order_date"
            label="Order Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="total_amount"
            label="Total Amount"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="shipping_cost"
            label="Shipping Cost"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="promotion_id" label="Promotion">
            <Select>
              {promotions.map((promo) => (
                <Select.Option key={promo.id} value={promo.id}>
                  {promo.code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="address_id"
            label="Address"
            rules={[{ required: true }]}
          >
            <Select>
              {addresses.map((address) => (
                <Select.Option key={address.id} value={address.id}>
                  {address.address}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
