import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Switch, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ProductVariant {
  id: number;
  product_id: number;
  size_id: number;
  color_id: number;
  price: number;
  stock: number;
  is_active: boolean;
  images: { image_url: string }[]; // Mảng hình ảnh từ API
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
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // Modal chi tiết
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]); // Lưu file ảnh mới được upload
  const [searchTerm, setSearchTerm] = useState<string>(''); // Lưu từ khóa tìm kiếm

  // Lấy dữ liệu từ API
  const fetchVariants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/product-variants');
      setVariants(response.data.data || []); // Đảm bảo API trả về danh sách biến thể
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
    setCurrentVariant(null); // Reset currentVariant khi thêm mới
    setIsModalVisible(true);
    setImages([]); // Xóa danh sách ảnh khi thêm mới
  };

  const handleEdit = (variant: ProductVariant) => {
    setCurrentVariant(variant); // Gán dữ liệu hiện tại khi chỉnh sửa
    setIsModalVisible(true);
    setImages([]); // Xóa danh sách ảnh khi chỉnh sửa
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/product-variants/${id}`);
      message.success('Xóa biến thể sản phẩm thành công');
      fetchVariants(); // Reload danh sách sau khi xóa
    } catch (error) {
      message.error('Không thể xóa biến thể sản phẩm');
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

    // Gửi tất cả ảnh mới được upload
    images.forEach((file) => {
      formData.append('images[]', file);
    });

    // Gửi danh sách ảnh cũ nếu đang chỉnh sửa
    if (currentVariant?.images) {
      currentVariant.images.forEach((image) => {
        formData.append('existing_images[]', image.image_url); // Gửi đường dẫn ảnh cũ
      });
    }

    try {
      if (currentVariant) {
        // Cập nhật biến thể sản phẩm
        await axios.post(
          `http://127.0.0.1:8000/api/product-variants/${currentVariant.id}?_method=PUT`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        message.success('Cập nhật biến thể sản phẩm thành công');
      } else {
        // Thêm mới biến thể sản phẩm
        await axios.post('http://127.0.0.1:8000/api/product-variants', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Thêm biến thể sản phẩm thành công');
      }
      setIsModalVisible(false);
      fetchVariants(); // Reload danh sách sau khi thêm/cập nhật
    } catch (error) {
      message.error('Không thể lưu biến thể sản phẩm');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value); // Cập nhật từ khóa tìm kiếm
  };

  const handleViewDetail = (variant: ProductVariant) => {
    setCurrentVariant(variant);
    setIsDetailModalVisible(true);
  };

  const renderImages = (images: { image_url: string }[]) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {images.map((image, index) => (
        <img
          key={index}
          src={`http://127.0.0.1:8000/storage/${image.image_url}`}
          alt={`Hình sản phẩm ${index}`}
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ))}
    </div>
  );

  const filteredVariants = variants.filter(
    (variant) =>
      products.find((p) => p.id === variant.product_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sizes.find((s) => s.id === variant.size_id)?.size_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colors.find((c) => c.id === variant.color_id)?.color_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Sản phẩm', dataIndex: 'product_id', key: 'product_id', render: (id: number) => products.find((p) => p.id === id)?.name || 'N/A' },
    { title: 'Kích thước', dataIndex: 'size_id', key: 'size_id', render: (id: number) => sizes.find((s) => s.id === id)?.size_name || 'N/A' },
    { title: 'Màu sắc', dataIndex: 'color_id', key: 'color_id', render: (id: number) => colors.find((c) => c.id === id)?.color_name || 'N/A' },
    { title: 'Giá', dataIndex: 'price', key: 'price' },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
    { title: 'Hoạt động', dataIndex: 'is_active', key: 'is_active', render: (is_active: boolean) => (is_active ? 'Có' : 'Không') },
    {
      title: 'Hình ảnh',
      key: 'images',
      render: (record: ProductVariant) => renderImages(record.images),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: ProductVariant) => (
        <>
          <Button onClick={() => handleViewDetail(record)} icon={<EyeOutlined />} style={{ marginRight: 8 }} />
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
        <Form
          initialValues={currentVariant || { is_active: true }}
          onFinish={handleSubmit}
        >
          <Form.Item name="product_id" label="Sản phẩm" rules={[{ required: true }]}>
            <Select>{products.map((p) => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="size_id" label="Kích thước" rules={[{ required: true }]}>
            <Select>{sizes.map((s) => <Select.Option key={s.id} value={s.id}>{s.size_name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="color_id" label="Màu sắc" rules={[{ required: true }]}>
            <Select>{colors.map((c) => <Select.Option key={c.id} value={c.id}>{c.color_name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stock" label="Tồn kho" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="is_active" label="Hoạt động" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              multiple
              listType="picture"
              beforeUpload={(file) => {
                setImages((prev) => [...prev, file]);
                return false; // Ngăn upload tự động
              }}
              onRemove={(file) => {
                setImages((prev) => prev.filter((img) => img.name !== file.name));
              }}
              defaultFileList={currentVariant?.images.map((img, index) => ({
                uid: `${index}`, // UID giả cho ảnh API
                name: `Image-${index + 1}`,
                status: 'done',
                url: `http://127.0.0.1:8000/storage/${img.image_url}`,
              }))}
            >
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentVariant ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết biến thể sản phẩm"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {currentVariant && (
          <div>
            <p><strong>Sản phẩm:</strong> {products.find((p) => p.id === currentVariant.product_id)?.name || 'N/A'}</p>
            <p><strong>Kích thước:</strong> {sizes.find((s) => s.id === currentVariant.size_id)?.size_name || 'N/A'}</p>
            <p><strong>Màu sắc:</strong> {colors.find((c) => c.id === currentVariant.color_id)?.color_name || 'N/A'}</p>
            <p><strong>Giá:</strong> {currentVariant.price}</p>
            <p><strong>Tồn kho:</strong> {currentVariant.stock}</p>
            <p><strong>Hoạt động:</strong> {currentVariant.is_active ? 'Có' : 'Không'}</p>
            <p><strong>Hình ảnh:</strong></p>
            {renderImages(currentVariant.images)}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductVariants;