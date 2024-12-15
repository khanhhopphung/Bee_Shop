import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Modal, Form, Input, message, Space, Switch } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
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
  username: string;
  is_verified: boolean;
}

interface Product {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<{ [key: number]: string }>({});
  const [users, setUsers] = useState<{ [key: number]: string }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [form] = Form.useForm();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`
      };

      // Fetch reviews, products, and users in parallel
      const [reviewsRes, productsRes, usersRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/reviews', { headers }),
        axios.get('http://127.0.0.1:8000/api/products', { headers }),
        axios.get('http://127.0.0.1:8000/api/users', { headers })
      ]);

      // Set reviews
      setReviews(reviewsRes.data.data || []);

      // Create products lookup object
      const productsMap: { [key: number]: string } = {};
      productsRes.data.data.forEach((product: Product) => {
        productsMap[product.id] = product.name;
      });
      setProducts(productsMap);

      // Create users lookup object
      const usersMap: { [key: number]: string } = {};
      usersRes.data.forEach((user: User) => {
        usersMap[user.id] = user.username;
      });
      setUsers(usersMap);

    } catch (error) {
      message.error('Không thể tải dữ liệu');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle status toggle
  const handleStatusToggle = async (review: Review) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.put(
        `http://127.0.0.1:8000/api/reviews/${review.id}`,
        {
          ...review,
          is_verified: !review.is_verified,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      message.success("Cập nhật trạng thái bình luận thành công");
      fetchData();
    } catch (error) {
      message.error("Cập nhật trạng thái bình luận thất bại");
    }
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter reviews based on search term
  const filteredReviews = reviews.filter((review) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      review.comment.toLowerCase().includes(searchLower) ||
      review.rating.toString().includes(searchTerm) ||
      review.review_date.toLowerCase().includes(searchLower) ||
      products[review.product_id]?.toLowerCase().includes(searchLower) ||
      users[review.user_id]?.toLowerCase().includes(searchLower)
    );
  });

  // Handle Delete Review
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa đánh giá này?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const accessToken = localStorage.getItem("access_token");
          await axios.delete(`http://127.0.0.1:8000/api/reviews/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          message.success('Xóa đánh giá thành công');
          fetchData();
        } catch (error) {
          message.error('Xóa đánh giá thất bại');
        }
      },
    });
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Define columns for the table
  const columns = [
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>STT</span>,
      render: (_: any, __: Review, index: number) => (
        <span style={{ fontSize: '16px' }}>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
      key: 'index',
      align: 'center' as 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Sản phẩm</span>,
      key: 'product_id',
      render: (record: Review) => (
        <span style={{ fontSize: '16px' }}>{products[record.product_id] || 'N/A'}</span>
      ),
      align: 'center' as 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>người dùng</span>,
      key: 'user_id',
      render: (record: Review) => (
        <span style={{ fontSize: '16px' }}>{users[record.user_id] || 'N/A'}</span>
      ),
      align: 'center' as 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Rank</span>,
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <span style={{ fontSize: '16px' }}>{rating}</span>,
      align: 'center' as 'center',
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
      align: 'center' as 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: "is_verified",
      key: "is_verified",
      render: (is_verified: boolean, review: Review) => (
        <Switch
          checked={is_verified}
          onChange={() => handleStatusToggle(review)}
        />
      ),
      align: 'center' as 'center',
    },
    // {
    //   title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hành động</span>,
    //   key: 'actions',
    //   render: (record: Review) => (
    //     <Space>
    //       <Button
    //         type="primary"
    //         danger
    //         size="large"
    //         icon={<DeleteOutlined />}
    //         onClick={() => handleDelete(record.id)}
    //       />
    //     </Space>
    //   ),
    //   align: 'center' as 'center',
    // },
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
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Row>
            <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm đánh giá"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ maxWidth: '400px', marginBottom: '20px' }}
              />
            </Col>
          </Row>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredReviews}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredReviews.length,
            onChange: handlePaginationChange,
          }}
          scroll={{ x: '800' }}
          style={{
            fontSize: '16px',
            borderRadius: '8px',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default Reviews;
