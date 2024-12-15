import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Spin, Row, Col, Statistic, message, Typography, DatePicker, Button, Modal } from 'antd';
import { DollarCircleOutlined, ShoppingCartOutlined, UserOutlined, AlertOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';
import dayjs from 'dayjs';

const { Title } = Typography;

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        setLoading(false);
        return;
      }

      const params: any = {};
      if (startDate && endDate) {
        params.start_date = startDate.format('YYYY-MM-DD');
        params.end_date = endDate.format('YYYY-MM-DD');
      }
      if (selectedYear) {
        params.year = selectedYear;
      }
      if (selectedMonth) {
        params.month = selectedMonth;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/statistics/dashboard', {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setStatistics(response.data);
    } catch (err) {
      message.error('Không thể tải thống kê.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const handleCardClick = (type: string) => {
    let content = null;
    
    switch (type) {
      case 'revenue':
        content = statistics.sold_products.map((order: any) => ({
          key: order.id,
          productName: order.name,
          quantity: order.total_sold,
          revenue: formatCurrency(order.total_revenue),
        }));
        break;
      case 'orders':
        content = `Tổng đơn hàng: ${statistics.total_orders}`;
        break;
        case 'km':
        content = `Tăng trưởng doanh thu nhờ khuyến mãi : ${statistics.promotion_revenue_growth}`;
        break;
      
      case 'low_stock':
       
        content = `Sản phẩm sắp hết hàng: ${statistics.low_stock_products.count}`;
        break;
      default:
        content = null;
    }
    
    setModalContent(content);
    setModalVisible(true);
  };
  useEffect(() => {
    fetchStatistics();
  }, [startDate, endDate, selectedYear, selectedMonth]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statistics) return null;

  const topSellingColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Lượt bán', dataIndex: 'total_sold', key: 'total_sold' },
  ];

  const promotionColumns = [
    { title: 'Tên khuyến mãi', dataIndex: 'code', key: 'code' },
    { title: 'Lượt sử dụng', dataIndex: 'usage_count', key: 'usage_count' },
  ];

  const lowStockColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Mã sản phẩm', dataIndex: 'sku', key: 'sku' },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (text: number) => formatCurrency(text) },
  ];

  const paymentMethodConfig = {
    appendPadding: 10,
    data: statistics.payment_method_stats,
    angleField: 'count',
    colorField: 'payment_method',
    radius: 0.8,
    interactions: [{ type: 'element-active' }],
  };

  const shippingStatusConfig = {
    data: statistics.shipping_stats,
    xField: 'status',
    yField: 'count',
    color: 'blue',
    label: {
      position: 'top',
      style: {
        fill: '#fff',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      status: {
        alias: 'Shipping Status',
      },
      count: {
        alias: 'Number of Orders',
      },
    },
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#fafafa' }}>
      {/* Header with Logout */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
        <Col>
          <Button type="primary" icon={<PoweroffOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Col>
      </Row>

      {/* Date Pickers */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }} align="middle">
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            picker="year"
            style={{ width: '100%' }}
            placeholder="Chọn năm"
            onChange={(date) => {
              setSelectedYear(date?.year());
              setSelectedMonth(null);
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            picker="month"
            style={{ width: '100%' }}
            placeholder="Chọn tháng"
            onChange={(date) => {
              setSelectedMonth(date?.month() + 1);
              setSelectedYear(null);
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Chọn ngày bắt đầu"
            onChange={(date) => setStartDate(date)}
            value={startDate}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Chọn ngày kết thúc"
            onChange={(date) => setEndDate(date)}
            value={endDate}
          />
        </Col>
      </Row>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
            onClick={() => handleCardClick('revenue')}
          >
            <Title level={4} style={{ color: '#2c3e50' }}>Tổng doanh thu</Title>
            <Statistic
              value={formatCurrency(statistics.total_revenue)}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
            onClick={() => handleCardClick('orders')}
          >
            <Title level={4} style={{ color: '#2c3e50' }}>Tổng đơn hàng</Title>
            <Statistic
              value={statistics.total_orders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#ff7f50' }}
            />
          </Card>
        </Col>
        
        
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
            onClick={() => handleCardClick('low_stock')}
          >
            <Title level={4} style={{ color: '#2c3e50' }}>Sản phẩm sắp hết hàng</Title>
            <Statistic
              value={statistics.low_stock_products.count}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#e74c3c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal for showing detail */}
      <Modal
  title="Thông tin chi tiết"
  visible={modalVisible}
  onCancel={() => setModalVisible(false)}
  footer={null}
>
  {Array.isArray(modalContent) ? (
    <Table
      dataSource={modalContent}
      columns={[
        { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue' },
      ]}
      pagination={false}
    />
  ) : (
    <p>{modalContent}</p>
  )}
</Modal>

      {/* Top Selling Products and Promotions */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={8} md={8}>
          <Card
            title={<Title level={4} style={{ color: '#2c3e50' }}>Sản phẩm bán chạy</Title>}
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
          >
            <Table
              columns={topSellingColumns}
              dataSource={statistics.top_selling_products}
             pagination={{ pageSize: 5 }}
              rowKey="id"
              size="small"
              
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card
            title={<Title level={4} style={{ color: '#2c3e50' }}>Khuyến mãi</Title>}
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
          >
            <Table
              columns={promotionColumns}
              dataSource={statistics.promotion_usage_stats}
              pagination={{ pageSize: 3 }}
              rowKey="code"
              bordered
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card
            title={<Title level={4} style={{ color: '#2c3e50' }}>sản phẩm sắp hết hàng </Title>}
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
          >
            <Table
              columns={lowStockColumns}
              dataSource={statistics.low_stock_products.products}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Methods and Shipping Status */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card
            title={<Title level={4} style={{ color: '#2c3e50' }}> Các Phương thức thanh toán</Title>}
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
          >
            <Pie {...paymentMethodConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<Title level={4} style={{ color: '#2c3e50' }}> Thống kê theo Trạng thái</Title>}
            style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
          >
            <Column {...shippingStatusConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;