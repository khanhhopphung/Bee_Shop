import React, { useEffect, useState } from "react";
import axios from "axios";
import {Table, Button, Modal, Form, Input, message, Switch, Select, Space} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined,} from "@ant-design/icons";
import dayjs from "dayjs";
import { ColumnsType } from 'antd/es/table';

interface Promotion {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  tier_id?: number;
}

interface Tier {
  id: number;
  tier_name: string;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  // Fetch promotions from API
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
  
      // Kiểm tra nếu token không tồn tại
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        return; // Dừng việc tải dữ liệu nếu chưa có token
      }
  
      // Thêm token vào headers nếu có
      const response = await axios.get("http://127.0.0.1:8000/api/promotions", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm token vào header
        },
      });
  
      const promotionsData = response.data.data.map((promotion: Promotion) => ({
        ...promotion,
        start_date: dayjs(promotion.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(promotion.end_date).format("YYYY-MM-DD"),
      }));
      
      setPromotions(promotionsData);
      setFilteredPromotions(promotionsData);
    } catch (error) {
      message.error("Không thể tải khuyến mãi");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tiers");
      setTiers(response.data.data || []);
    } catch (error) {
      message.error("Failed to load tiers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchTiers();
  }, []);

  // Handle search and filter
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = promotions.filter((promotion) =>
      promotion.code.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPromotions(filtered);
  };

  const handleDiscountRangeFilter = (range: string | null) => {
    if (range) {
      const [min, max] = range.split("-").map(Number);
      filterPromotions(searchText, min, max);
    } else {
      filterPromotions(searchText);
    }
  };

  const filterPromotions = (text: string, min?: number, max?: number) => {
    const filtered = promotions
      .filter((promotion) => {
        const matchesText =
          promotion.code.toLowerCase().includes(text.toLowerCase()) ||
          promotion.discount_type.toLowerCase().includes(text.toLowerCase()) ||
          promotion.discount_value.toString().includes(text);
        const matchesRange =
          min === undefined ||
          max === undefined ||
          (promotion.discount_value >= min && promotion.discount_value <= max);
        return matchesText && matchesRange;
      })
      .sort((a, b) => a.discount_value - b.discount_value);

    setFilteredPromotions(filtered);
  };

  const handleAdd = () => {
    setCurrentPromotion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (promotion: Promotion) => {
    const formattedPromotion = {
      ...promotion,
      start_date: dayjs(promotion.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(promotion.end_date).format("YYYY-MM-DD"),
    };
    setCurrentPromotion(formattedPromotion);
    form.setFieldsValue(formattedPromotion);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Promotion?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/promotions/${id}`);

          message.success("Promotion deleted successfully");
          fetchPromotions();
        } catch (error) {
          message.error("Failed to delete promotion");
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentPromotion) {
        // Update promotion
        await axios.put(
          `http://127.0.0.1:8000/api/promotions/${currentPromotion.id}`,
          values
        );
        message.success("Promotion updated successfully");
      } else {
        // Add new promotion
        await axios.post("http://127.0.0.1:8000/api/promotions", values);
        message.success("Promotion created successfully");
      }
      setIsModalVisible(false);
      fetchPromotions();
    } catch (error) {
      message.error("Failed to save promotion");
    }
  };

  const columns: ColumnsType<Promotion> = [
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>ID</span>,
      dataIndex: 'id',
      key: 'id',
      render: (text: number) => <strong style={{ fontSize: '16px' }}>{text}</strong>,
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tên mã giảm giá</span>,
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Loại giảm giá</span>,
      dataIndex: 'discount_type',
      key: 'discount_type',
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Giá trị giảm gía</span>,
      dataIndex: 'discount_value',
      key: 'discount_value',
      render: (text: number) => <span style={{ fontSize: '16px' }}>{text}</span>,
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Số lần sử dụng</span>,
      dataIndex: 'usage_limit',
      key: 'usage_limit',
      render: (text: number) => <span style={{ fontSize: '16px' }}>{text}</span>,
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Ngày áp dụng</span>,
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Ngày kết thúc</span>,
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Cấp bậc </span>,
      dataIndex: 'tier_id',
      key: 'tier_id',
      render: (tierId: number) => {
        const tier = tiers.find((t) => t.id === tierId);
        return tier ? (
          <span style={{ fontSize: '16px' }}>{tier.tier_name}</span>
        ) : (
          <span style={{ fontSize: '16px', color: '#cf1322' }}>N/A</span>
        );
      },
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <span
          style={{
            fontSize: '16px',
            color: is_active ? '#3f8600' : '#cf1322',
            fontWeight: 'bold',
          }}
        >
          {is_active ? 'Hoạt động' : 'Không hoạt dộng'}
        </span>
      ),
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Actions</span>,
      key: 'actions',
      render: (record: Promotion) => (
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          />
          <Button
            type="primary"
            danger
            size="large"
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
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
            Thêm khuyến mãi
          </Button>
  
          <Input.Search
            placeholder="Search promotion by code or discount type"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{
              maxWidth: '600px',
              borderRadius: '8px',
              height: '48px',
            }}
          />
        </div>
        <Select
          placeholder="Filter by Discount Value"
          allowClear
          style={{
            width: 250,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          onChange={(value) => handleDiscountRangeFilter(value)}
        >
          <Select.Option value="5-15">Mã giảm giá 5% - 15%</Select.Option>
          <Select.Option value="15-30">Mã giảm giá 15% - 30%</Select.Option>
          <Select.Option value="30-45">Mã giảm giá 30% - 45%</Select.Option>
          <Select.Option value="45-60">Mã giảm giá 45% - 60%</Select.Option>
        </Select>
        <hr />
        <Table
          columns={columns}
          dataSource={filteredPromotions}
          rowKey="id"
          bordered
          pagination={{ position: ['bottomCenter'], showSizeChanger: true }}
          scroll={{ x: '800' }} 
          style={{
            fontSize: '16px',
            borderRadius: '8px',
            width: '100%', 
          }}
          loading={loading}
        />
      </div>
  
      <Modal
        open={isModalVisible}
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentPromotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi'}</span>}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          
        >
          <Form.Item
            name="code"
            label="Promotion Code"
            rules={[{ required: true, message: 'Please enter promotion code' }]}
          >
            <Input placeholder="Enter promotion code" />
          </Form.Item>
  
          <Form.Item
            name="discount_type"
            label="Discount Type"
            rules={[{ required: true, message: 'Please select discount type' }]}
          >
            <Select>
              <Select.Option value="percentage">Percentage</Select.Option>
             
            </Select>
          </Form.Item>
  
          <Form.Item
            name="discount_value"
            label="Discount Value"
            rules={[{ required: true, message: 'Please enter discount value' }]}
          >
            <Input type="number" placeholder="Enter discount value" />
          </Form.Item>
  
          <Form.Item
            name="usage_limit"
            label="Usage Limit"
            rules={[{ required: true, message: 'Please enter usage limit' }]}
          >
            <Input type="number" placeholder="Enter usage limit" />
          </Form.Item>
  
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <Input type="date" />
          </Form.Item>
  
          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <Input type="date" />
          </Form.Item>
  
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
  
          <Form.Item
            name="tier_id"
            label="Tier"
            rules={[{ required: true, message: 'Please select a tier' }]}
          >
            <Select placeholder="Select a tier">
              {tiers.map((tier) => (
                <Select.Option key={tier.id} value={tier.id}>
                  {tier.tier_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
  
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
  
};
export default Promotions;
