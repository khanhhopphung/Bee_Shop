import React, { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Switch,
  Select,
  Space,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ColumnsType } from 'antd/es/table';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category_id: number;
  stock: number;
  price: number;
  is_active: boolean;
  image: { image_url: string };
  size_id: number;
  color_id: number;
  created_at: string;
  updated_at: string;
}

interface Category {
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

const Products: React.FC = () => {
  const [form] = useForm();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [imageFile, setImageFile] = useState<any | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      message.error("Không thể tải danh mục");
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/sizes");
      setSizes(response.data.data || []);
    } catch (error) {
      message.error("Không thể tải kích thước");
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/colors");
      setColors(response.data.data || []);
    } catch (error) {
      message.error("Không thể tải màu sắc");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (error) {
      message.error("Không thể tải sản phẩm");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSizes();
    fetchColors();
    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) || product.sku.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAdd = () => {
    setCurrentProduct(null);
    setIsModalVisible(true);
    form.resetFields();
    setImageFile(null);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...product,
      image_url: undefined, 
      is_active: product.is_active,
    });
    setImageFile(null); // Reset image file, no preview shown
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      message.success("Sản phẩm đã được xóa");
      fetchProducts();
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (currentProduct) {
        await axios.post(
          `http://127.0.0.1:8000/api/products/${currentProduct.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success("Sản phẩm đã được cập nhật");
      } else {
        await axios.post("http://127.0.0.1:8000/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Sản phẩm đã được tạo");
      }
      setIsModalVisible(false);
      fetchProducts();
      form.resetFields();
      setImageFile(null);
    } catch (error) {
      message.error("Không thể lưu sản phẩm");
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>STT</span>,
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: Product, index: number) => (
        <strong style={{ fontSize: '16px' }}>{index + 1}</strong>
      ),
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tên sản phẩm</span>,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hình ảnh</span>,
      dataIndex: 'image_url',
      key: 'image',
      render: (image: string, record: Product) => (
        <img
          src={record.image?.image_url ? `http://127.0.0.1:8000/storage/${record.image.image_url}` : 'http://127.0.0.1:8000/storage/default-image.jpg'}
          alt="Ảnh sản phẩm"
          style={{ width: '100px', height: 'auto' }}
        />
      ),
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Mã sản phẩm</span>,
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Mô tả</span>,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Danh mục</span>,
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'N/A';
      },
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Số lượng</span>,
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Giá</span>,
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <strong style={{ fontSize: '16px' }}>{price.toLocaleString()}₫</strong>
      ),
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Kích thước</span>,
      dataIndex: 'size_id',
      key: 'size_id',
      render: (sizeId: number) => {
        const size = sizes.find((s) => s.id === sizeId);
        return size ? size.size_name : 'N/A';
      },
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Màu sắc</span>,
      dataIndex: 'color_id',
      key: 'color_id',
      render: (colorId: number) => {
        const color = colors.find((c) => c.id === colorId);
        return color ? color.color_name : 'N/A';
      },
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái hoạt động</span>,
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
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Thao tác</span>,
      key: 'actions',
      render: (record: Product) => (
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
            Thêm sản phẩm
          </Button>
          
          <Input.Search
            value={searchText}
            onChange={handleSearchChange}
            size="large"
            allowClear
            placeholder="Tìm kiếm theo tên, SKU, hoặc mô tả"
            enterButton={<SearchOutlined />}

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
          dataSource={filteredProducts}
          rowKey="id"
          bordered
          pagination={{ position: ['bottomCenter'], showSizeChanger: true }}
          style={{
            fontSize: '16px',
            borderRadius: '8px',
          }}
        />
      </div>
      <Modal
        open={isModalVisible}
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</span>}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mã sản phẩm"
            name="sku"
            rules={[{ required: true, message: "Vui lòng nhập SKU!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category_id"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Kích thước" name="size_id">
            <Select>
              {sizes.map((size) => (
                <Select.Option key={size.id} value={size.id}>
                  {size.size_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Màu sắc" name="color_id">
            <Select>
              {colors.map((color) => (
                <Select.Option key={color.id} value={color.id}>
                  {color.color_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="stock"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Kích hoạt" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="image_url">
            <Upload
              listType="picture-card"
              beforeUpload={(file) => {
                setImageFile(file);
                return false;
              }}
              fileList={
                imageFile
                  ? [
                    {
                      uid: '-1', // Mã định danh duy nhất
                      name: imageFile.name,
                      status: 'done',
                      url: URL.createObjectURL(imageFile), // Hiển thị ảnh đã chọn
                    },
                  ]
                  : currentProduct?.image // Hiển thị ảnh đã lưu khi chỉnh sửa
                    ? [
                      {
                        uid: '-2',
                        name: 'Current Image',
                        status: 'done',
                        url: `http://127.0.0.1:8000/storage/${currentProduct.image.image_url}`,
                      },
                    ]
                    : []
              }
              showUploadList={{
                showRemoveIcon: false,
              }}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
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

export default Products;