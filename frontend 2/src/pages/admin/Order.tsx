import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, DatePicker, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  promotion_id: number | null;
  status: string;
  address_id: number;
  payment_method: string;
  shipping_cost: number;
}

interface Promotion {
  id: number;
  code: string;
}

interface User {
  id: number;
  username: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/orders');
      setOrders(response.data || []);
    } catch (error) {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch promotions from API
  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/promotions');
      if (Array.isArray(response.data)) {
        setPromotions(response.data);
      } else {
        console.error('Promotions data is not an array:', response.data);
      }
    } catch (error) {
      message.error('Failed to load promotions');
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users');
      setUsers(response.data || []);
    } catch (error) {
      message.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPromotions();
    fetchUsers();
  }, []);

  // Handle editing order
  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
  };

  // Handle deleting order
  const handleDelete = async (orderId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/${orderId}`);
      message.success('Order deleted successfully');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      message.error('Failed to delete order');
    }
  };

  // Handle submitting updated order details
  const handleSubmit = async (values: any) => {
    try {
      if (currentOrder) {
        await axios.put(`http://127.0.0.1:8000/api/orders/${currentOrder.id}`, values);
        message.success('Order updated successfully');
      }
      setIsModalVisible(false);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      message.error('Failed to update order');
    }
  };

  // View order details
  const handleViewDetails = (orderId: number) => {
    // Fetch and show the details of the order
    Modal.info({
      title: 'Order Details',
      content: (
        <div>
          <p>Order ID: {orderId}</p>
          <p>User: {users.find((user) => user.id === currentOrder?.user_id)?.username}</p>
          {/* Add more order details here */}
        </div>
      ),
    });
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Order Date', dataIndex: 'order_date', key: 'order_date' },
    { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
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
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        title="Edit Order"
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentOrder || { status: '', total_amount: 0, shipping_cost: 0 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="user_id"
            label="User"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select>
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="order_date"
            label="Order Date"
            rules={[{ required: true, message: 'Please select an order date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="promotion_id"
            label="Promotion"
            rules={[{ required: false }]}
          >
            <Select>
              {Array.isArray(promotions) &&
                promotions.map((promo) => (
                  <Select.Option key={promo.id} value={promo.id}>
                    {promo.code}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select order status' }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="total_amount"
            label="Total Amount"
            rules={[{ required: true, message: 'Please enter total amount' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="shipping_cost"
            label="Shipping Cost"
            rules={[{ required: true, message: 'Please enter shipping cost' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please enter payment method' }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
