import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ProductVariant {
  id: number;
  product_id: number;
  size_id: number;
  color_id: number;
  price: number;
  stock: number;
  is_active: boolean;
}

const ProductVariants: React.FC = () => {
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Thêm state searchTerm
  const [form] = Form.useForm();

  // Fetch product variants, sizes, and colors from API
  const fetchProductVariants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/product-variants');
      setProductVariants(response.data.data || []);
    } catch (error) {
      message.error('Failed to load product variants');
    } finally {
      setLoading(false);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/sizes');
      setSizes(response.data.data || []);
    } catch (error) {
      message.error('Failed to load sizes');
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/colors');
      setColors(response.data.data || []);
    } catch (error) {
      message.error('Failed to load colors');
    }
  };

  useEffect(() => {
    fetchProductVariants();
    fetchSizes();
    fetchColors();
  }, []);

  // Lọc danh sách productVariants dựa trên từ khóa tìm kiếm
  const filteredVariants = productVariants.filter((variant) => {
    const size = sizes.find((s) => s.id === variant.size_id)?.size_name || '';
    const color = colors.find((c) => c.id === variant.color_id)?.color_name || '';
    
    return (
      size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.price.toString().includes(searchTerm) ||
      variant.stock.toString().includes(searchTerm)
    );
  });

  const handleAdd = () => {
    setCurrentVariant(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (variant: ProductVariant) => {
    setCurrentVariant(variant);
    form.setFieldsValue(variant);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/product-variants/${id}`);
      message.success('Product variant deleted successfully');
      fetchProductVariants();
    } catch (error) {
      message.error('Failed to delete product variant');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        product_id: currentVariant ? currentVariant.product_id : 1,
        ...values,
      };

      if (currentVariant) {
        await axios.put(`http://127.0.0.1:8000/api/product-variants/${currentVariant.id}`, data);
        message.success('Product variant updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/product-variants', data);
        message.success('Product variant created successfully');
      }

      setIsModalVisible(false);
      fetchProductVariants();
    } catch (error) {
      message.error('Failed to save product variant');
    }
  };

  // Define table columns with Vietnamese headers
  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Kích Cỡ',
      dataIndex: 'size_id',
      key: 'size_id',
      render: (size_id: number) => {
        const size = sizes.find((s) => s.id === size_id);
        return size ? size.size_name : 'Chưa xác định';
      },
    },
    {
      title: 'Màu Sắc',
      dataIndex: 'color_id',
      key: 'color_id',
      render: (color_id: number) => {
        const color = colors.find((c) => c.id === color_id);
        return color ? color.color_name : 'Chưa xác định';
      },
    },
    { title: 'Giá', dataIndex: 'price', key: 'price' },
    { title: 'Số Lượng', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Hoạt Động',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (is_active ? 'Có' : 'Không'),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (record: ProductVariant) => (
        <>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} style={{ marginRight: 8 }} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
        </>
      ),
    },
  ];

  return (
    <div>
      {/* Ô tìm kiếm */}
      <Input.Search
        placeholder="Tìm kiếm theo kích cỡ, màu, giá hoặc số lượng"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={(value) => setSearchTerm(value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm Mới
      </Button>
      <Table
        columns={columns}
        dataSource={filteredVariants}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        title={currentVariant ? 'Chỉnh Sửa Biến Thể Sản Phẩm' : 'Thêm Biến Thể Sản Phẩm'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="size_id"
            label="Kích Cỡ"
            rules={[{ required: true, message: 'Vui lòng chọn kích cỡ' }]}
          >
            <Select>
              {sizes.map((size) => (
                <Select.Option key={size.id} value={size.id}>
                  {size.size_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="color_id"
            label="Màu Sắc"
            rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
          >
            <Select>
              {colors.map((color) => (
                <Select.Option key={color.id} value={color.id}>
                  {color.color_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stock" label="Số Lượng" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductVariants;
