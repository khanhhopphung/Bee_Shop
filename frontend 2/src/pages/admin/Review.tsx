import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  review_date: string;  // Thêm trường review_date
  is_verified: boolean; // Thêm trường is_verified
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách reviews từ API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reviews');
      setReviews(response.data.data || []);
    } catch (error) {
      message.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Xử lý khi nhấn nút "Add Review"
  const handleAdd = () => {
    setCurrentReview(null); // Reset form
    setIsModalVisible(true);
  };

  // Xử lý khi nhấn nút "Edit"
  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setIsModalVisible(true);
  };

  // Xử lý khi nhấn nút "Delete"
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${id}`);
      message.success('Review deleted successfully');
      fetchReviews(); // Refresh danh sách review
    } catch (error) {
      message.error('Failed to delete review');
    }
  };

  // Xử lý khi submit form
  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        review_date: new Date().toISOString().split('T')[0],  // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
        is_verified: false,  // Mặc định là chưa được xác minh, có thể thay đổi sau
      };

      if (currentReview) {
        // Cập nhật review
        await axios.put(`http://127.0.0.1:8000/api/reviews/${currentReview.id}`, data);
        message.success('Review updated successfully');
      } else {
        // Thêm review mới
        await axios.post('http://127.0.0.1:8000/api/reviews', data);
        message.success('Review created successfully');
      }
      setIsModalVisible(false);
      fetchReviews(); // Refresh danh sách review
    } catch (error) {
      message.error('Failed to save review');
    }
  };

  // Cấu hình các cột cho bảng
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Product ID', dataIndex: 'product_id', key: 'product_id' },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
    { title: 'Comment', dataIndex: 'comment', key: 'comment' },
    { title: 'Review Date', dataIndex: 'review_date', key: 'review_date' }, // Cột review_date
    { title: 'Verified', dataIndex: 'is_verified', key: 'is_verified', render: (is_verified: boolean) => (is_verified ? 'Yes' : 'No') }, // Cột is_verified
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Review) => (
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
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Review
      </Button>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        title={currentReview ? 'Edit Review' : 'Add Review'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentReview || { product_id: '', user_id: '', rating: 0, comment: '', review_date: '', is_verified: false }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="product_id"
            label="Product ID"
            rules={[{ required: true, message: 'Please enter product ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="user_id"
            label="User ID"
            rules={[{ required: true, message: 'Please enter user ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please enter rating' }]}
          >
            <Input type="number" min={1} max={5} />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: 'Please enter a comment' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Reviews;
