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
  review_date: string;
  is_verified: boolean;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

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
    setIsModalVisible(true);
  };

  // Handle Edit Review
  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setIsModalVisible(true);
  };

  // Handle Delete Review
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${id}`);
      message.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      message.error('Failed to delete review');
    }
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
  const columns = [
    {
      title: 'STT',
      render: (text: any, record: Review, index: number) => index + 1,
      key: 'index',
    },
    { title: 'Rank', dataIndex: 'rating', key: 'rating' },
    { title: 'Bình luận', dataIndex: 'comment', key: 'comment' },
    { title: 'Ngày bình luận', dataIndex: 'review_date', key: 'review_date' },
    { title: 'Hoạt động', dataIndex: 'is_verified', key: 'is_verified', render: (is_verified: boolean) => (is_verified ? 'Có' : 'Không') },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: Review) => (
        <>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} style={{ marginRight: 8 }} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
        </>
      ),
    },
  ];

  return (
    <div>
      {/* Search Bar */}
      <Input.Search
        placeholder="Tìm kiếm theo bình luận, xếp hạng hoặc ngày"
        value={searchTerm}
        onChange={handleSearchChange}
        onSearch={(value) => setSearchTerm(value)}
        style={{ width: 300, marginBottom: 16 }}
      />

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
        dataSource={filteredReviews}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        open={isModalVisible}
        title={currentReview ? 'Edit Review' : 'Add Review'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentReview || { rating: 0, comment: '', review_date: '', is_verified: true }}
          onFinish={handleSubmit}
        >
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Reviews;
