import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Switch } from 'antd';
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
  image_url: string;
}

interface Product {
  id: number;
  name: string;
}

interface Size {
  id: number;
  size_name: string;
}

interface Color {
  id: number;
  color_name: string;
}

const ProductVariants: React.FC = () => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Lấy dữ liệu từ API
  const fetchVariants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/product-variants');
      setVariants(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách biến thể sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/sizes');
      setSizes(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách kích thước');
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/colors');
      setColors(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách màu sắc');
    }
  };

  useEffect(() => {
    fetchVariants();
    fetchProducts();
    fetchSizes();
    fetchColors();
  }, []);

  const handleAdd = () => {
    setCurrentVariant(null);
    setIsModalVisible(true);
    setImage(null);
  };

  const handleEdit = (variant: ProductVariant) => {
    setCurrentVariant(variant);
    setIsModalVisible(true);
    setImage(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/product-variants/${id}`);
      message.success('Xóa biến thể sản phẩm thành công');
      fetchVariants();
    } catch (error) {
      message.error('Không thể xóa biến thể sản phẩm');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('product_id', values.product_id);
    formData.append('size_id', values.size_id);
    formData.append('color_id', values.color_id);
    formData.append('price', values.price);
    formData.append('stock', values.stock);
    formData.append('is_active', values.is_active ? '1' : '0');
    if (image) {
      formData.append('image', image);
    }

    try {
      if (currentVariant) {
        await axios.put(`http://127.0.0.1:8000/api/product-variants/${currentVariant.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Cập nhật biến thể sản phẩm thành công');
      } else {
        await axios.post('http://127.0.0.1:8000/api/product-variants', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Thêm biến thể sản phẩm thành công');
      }
      setIsModalVisible(false);
      fetchVariants();
    } catch (error) {
      message.error('Không thể lưu biến thể sản phẩm');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredVariants = variants.filter(variant =>
    products.find(p => p.id === variant.product_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sizes.find(s => s.id === variant.size_id)?.size_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colors.find(c => c.id === variant.color_id)?.color_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Sản phẩm', dataIndex: 'product_id', key: 'product_id', render: (id: number) => products.find(p => p.id === id)?.name || 'N/A' },
    { title: 'Kích thước', dataIndex: 'size_id', key: 'size_id', render: (id: number) => sizes.find(s => s.id === id)?.size_name || 'N/A' },
    { title: 'Màu sắc', dataIndex: 'color_id', key: 'color_id', render: (id: number) => colors.find(c => c.id === id)?.color_name || 'N/A' },
    { title: 'Giá', dataIndex: 'price', key: 'price' },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
    { title: 'Hoạt động', dataIndex: 'is_active', key: 'is_active', render: (is_active: boolean) => (is_active ? 'Có' : 'Không') },
    {
      title: 'Hình ảnh',
      key: 'image',
      render: (record: ProductVariant) => (
        <img
          src={record.image_url ? `http://127.0.0.1:8000/storage/${record.image_url}` : ''}
          alt="Hình sản phẩm"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Hành động',
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
      <Input.Search
        placeholder="Tìm kiếm sản phẩm, kích thước, hoặc màu sắc"
        onSearch={handleSearch}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm biến thể sản phẩm
      </Button>
      <Table columns={columns} dataSource={filteredVariants} rowKey="id" loading={loading} />
      <Modal open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form initialValues={currentVariant || {}} onFinish={handleSubmit}>
          <Form.Item name="product_id" label="Sản phẩm" rules={[{ required: true }]}>
            <Select>{products.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="size_id" label="Kích thước" rules={[{ required: true }]}>
            <Select>{sizes.map(s => <Select.Option key={s.id} value={s.id}>{s.size_name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="color_id" label="Màu sắc" rules={[{ required: true }]}>
            <Select>{colors.map(c => <Select.Option key={c.id} value={c.id}>{c.color_name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stock" label="Tồn kho" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="is_active" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            {currentVariant && currentVariant.image_url ? (
              <img
                src={`http://127.0.0.1:8000/storage/${currentVariant.image_url}`}
                alt="Hình hiện tại"
                style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }}
              />
            ) : (
              <p>Chưa có hình ảnh</p>
            )}
            <input type="file" onChange={handleImageUpload} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductVariants;
