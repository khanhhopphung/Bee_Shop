import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  review_date: string;
  is_verified: boolean;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [form] = Form.useForm();

  // Fetch reviews from API
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

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter reviews based on search term
  const filteredReviews = reviews.filter((review) => {
    return (
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.rating.toString().includes(searchTerm) ||
      review.review_date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle Add Review
  const handleAdd = () => {
    setCurrentReview(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle Edit Review
  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    form.setFieldsValue(review);
    setIsModalVisible(true);
  };

  // Handle Delete Review
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/reviews/${id}`);
          message.success('Review deleted successfully');
          fetchReviews();
        } catch (error) {
          message.error('Failed to delete review');
        }
      },
    });
  };

  // Handle Submit form
  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        review_date: new Date().toISOString().split('T')[0],
        is_verified: true,
        product_id: 1,
        user_id: 1,
      };

      if (currentReview) {
        await axios.put(`http://127.0.0.1:8000/api/reviews/${currentReview.id}`, data);
        message.success('Review updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/reviews', data);
        message.success('Review created successfully');
      }
      setIsModalVisible(false);
      fetchReviews();
    } catch (error) {
      message.error('Failed to save review');
    }
  };

  // Define columns for the table
  const columns: ColumnsType<Review> = [
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>STT</span>,
      render: (text: any, record: Review, index: number) => (
        <span style={{ fontSize: '16px' }}>{index + 1}</span>
      ),
      key: 'index',
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Rank</span>,
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <span style={{ fontSize: '16px' }}>{rating}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Bình luận</span>,
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => <span style={{ fontSize: '16px' }}>{comment}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Ngày bình luận</span>,
      dataIndex: 'review_date',
      key: 'review_date',
      render: (date: string) => <span style={{ fontSize: '16px' }}>{date}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hoạt động</span>,
      dataIndex: 'is_verified',
      key: 'is_verified',
      render: (is_verified: boolean) => (
        <span
          style={{
            fontSize: '16px',
            color: is_verified ? '#3f8600' : '#cf1322',
            fontWeight: 'bold',
          }}
        >
          {is_verified ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hành động</span>,
      key: 'actions',
      render: (record: Review) => (
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
      align: 'center',
    },
  ];


  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ fontSize: '16px', height: '40px' }}
          >
            Thêm Review
          </Button>

          <Input.Search
            placeholder="Tìm kiếm theo bình luận, xếp hạng hoặc ngày"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={handleSearchChange}
            onSearch={(value) => setSearchTerm(value)}
            style={{
              maxWidth: '600px',
              borderRadius: '8px',
              height: '48px',
            }}
          />
        </div>
        <hr />
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          bordered
          pagination={{ position: ['bottomCenter'], showSizeChanger: true }}
          scroll={{ x: '800' }} 
          style={{
            fontSize: '16px',
            borderRadius: '8px',
            width: '100%', 
          }}
        />
      </div>

      <Modal
        open={isModalVisible}
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentReview ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}</span>}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="product_id" hidden initialValue={1}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="user_id" hidden initialValue={1}>
            <Input type="hidden" />
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

          <Button type="primary" htmlType="submit" block size="large">
            Submit
          </Button>
        </Form>

      </Modal>
    </div>
  );
};

export default Reviews;
