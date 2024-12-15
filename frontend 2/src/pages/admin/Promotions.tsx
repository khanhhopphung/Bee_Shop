import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, message, Switch, Select, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, } from "@ant-design/icons";
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
      message.error("không thể tải bảng tier");
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
      title: "Bạn có chắc chắn muốn ngừng hoạt động khuyến mãi này không?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          // Gửi yêu cầu PUT để thay đổi trạng thái của khuyến mãi thành ngừng hoạt động
          await axios.put(`http://127.0.0.1:8000/api/promotions/${id}`, { is_active: 0 });

          message.success("Khuyến mãi đã được ngừng hoạt động");
          fetchPromotions(); // Tải lại danh sách khuyến mãi sau khi thay đổi
        } catch (error) {
          message.error("Ngừng hoạt động khuyến mãi thất bại");
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      message.error("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    try {
      if (currentPromotion) {
        // Update promotion
        await axios.put(
          `http://127.0.0.1:8000/api/promotions/${currentPromotion.id}`,
          values
        );
        message.success("sửa thành công khuyến mãi");
      } else {
        // Add new promotion
        await axios.post("http://127.0.0.1:8000/api/promotions", values);
        message.success("tạo thành công khuyến mãi");
      }
      setIsModalVisible(false);
      fetchPromotions();
    } catch (error) {
      message.error("không thể lưu khuyến mãi");
    }
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };
  const columns: ColumnsType<Promotion> = [
    {
      title: <span style={{ fontSize: "18px" }}>STT</span>,
      key: "stt",
      render: (_: any, __: any, index: number) => (
        <strong style={{ fontSize: "16px" }}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </strong>
      ),
      align: "center",
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
            placeholder="tìm kiếm bàng tên mã giảm giá hoặc  giá trị mã giảm giá "
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
          placeholder="lọc bằng giá trị giảm giá"
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
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: promotions.length,
            onChange: handlePaginationChange,
          }}
          scroll={{ x: '800' }}
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
            label="Mã khuyến mãi"
            rules={[{ required: true, message: 'Please enter promotion code' }]}
          >
            <Input placeholder="Enter promotion code" />
          </Form.Item>

          <Form.Item
            name="discount_type"
            label="kiểu khuyến mãi"
            rules={[{ required: true, message: 'Please select discount type' }]}
          >
            <Select>
              <Select.Option value="percentage">Percentage</Select.Option>
              <Select.Option value="money">money</Select.Option>
              <Select.Option value="shipping">shipping</Select.Option>

            </Select>
          </Form.Item>

          <Form.Item
            name="discount_value"
            label="giá trị khuyến mãi"
            rules={[{ required: true, message: 'Please enter discount value' }]}
          >
            <Input type="number" placeholder="Enter discount value" />
          </Form.Item>

          <Form.Item
            name="usage_limit"
            label="số lần sử dụng "
            rules={[{ required: true, message: 'Please enter usage limit' }]}
          >
            <Input type="number" placeholder="Enter usage limit" />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="ngày bắt đầu"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="ngày kết thúc"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Kích hoạt" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="tier_id"
            label="cấp bậc sử dụng được khuyến mãi "
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
