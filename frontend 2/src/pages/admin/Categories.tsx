import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch, Typography, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Category {
  id: number;
  name: string;
  sku: string;
  parent_category_id: number | null;
  is_active: boolean;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
  
      // Kiểm tra nếu token không tồn tại
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        return; // Dừng việc tải dữ liệu nếu chưa có token
      }
  
      // Thêm token vào headers nếu có
      const response = await axios.get('http://127.0.0.1:8000/api/categories', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm token vào header
        },
      });
  
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      message.error('Lỗi khi tải danh mục.');
      setCategories([]);
      setFilteredCategories([]);
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = categories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase()) ||
      category.sku.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filteredData);
  };

  const handleAdd = () => {
    setCurrentCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
          message.success('Category deleted successfully');
          fetchCategories();
        } catch (error) {
          message.error('Failed to delete category');
        }
      },
    });
  };
  const handleSubmit = async (values: any) => {
    try {
      if (currentCategory) {
        await axios.put(`http://127.0.0.1:8000/api/categories/${currentCategory.id}`, values);
        message.success('Category updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/categories', values);
        message.success('Category created successfully');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('không thể lưu do danh mục đã tồn tại ');
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>STT</span>,
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: Category, index: number) => (
        <strong style={{ fontSize: '16px' }}>{index + 1}</strong>
      ),
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tên danh mục</span>,
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Mã danh mục</span>,
      dataIndex: 'sku',
      key: 'sku',
      align: 'left',
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <span
          style={{
            fontSize: '16px',
            color: active ? '#3f8600' : '#cf1322',
            fontWeight: 'bold',
          }}
        >
          {active ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Actions</span>,
      key: 'actions',
      render: (record: Category) => (
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
            Thêm danh mục
          </Button>

          <Input.Search
            placeholder="Tìm kiếm danh mục theo tên hoặc mã"
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
        <hr />
        <Table
          columns={columns}
          dataSource={filteredCategories}
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
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</span>}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="sku"
            label="Mã danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập mã danh mục' }]}
          >
            <Input placeholder="Nhập mã danh mục" />
          </Form.Item>

          <Form.Item name="is_active" label="Trạng thái" valuePropName="checked">
            <Switch />
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

export default Categories;
