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
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.sku.toLowerCase().includes(value.toLowerCase()) ||
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
      image_url: undefined, // Remove image_url to prevent form from trying to bind it
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

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: Product, index: number) => index + 1,
    },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    {
      title: 'Hình ảnh',
      dataIndex: 'image_url',
      key: 'image',
      render: (image: string, record: Product) => (
        <img
          src={record.image?.image_url ? `http://127.0.0.1:8000/storage/${record.image.image_url}` : 'http://127.0.0.1:8000/storage/default-image.jpg'}
          alt="Ảnh sản phẩm"
          style={{ width: '100px', height: 'auto' }}
        />
      )
    },
    { title: 'Mã sản phẩm', dataIndex: 'sku', key: 'sku' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      key: "category_id",
      render: (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "N/A";
      },
    },
    { title: "Số lượng", dataIndex: "stock", key: "stock" },
    { title: "Giá", dataIndex: "price", key: "price", render: (price: number) => `${price.toLocaleString()}₫` },
    {
      title: "Kích thước",
      dataIndex: "size_id",
      key: "size_id",
      render: (sizeId: number) => {
        const size = sizes.find((s) => s.id === sizeId);
        return size ? size.size_name : "N/A";
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "color_id",
      key: "color_id",
      render: (colorId: number) => {
        const color = colors.find((c) => c.id === colorId);
        return color ? color.color_name : "N/A";
      },
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (active ? "Có" : "Không"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (record: Product) => (
        <>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            danger
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên, SKU, hoặc mô tả"
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredProducts} rowKey="id" />

      <Modal
  open={isModalVisible}
  title={currentProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
>
  <Form form={form} onFinish={handleSubmit}>
    <Form.Item
      label="Tên sản phẩm "
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
        listType="picture"
        beforeUpload={(file) => {
          setImageFile(file);
          return false;
        }}
        onRemove={() => setImageFile(null)}
      >
        <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
      </Upload>
      {currentProduct && currentProduct.image && (
        <img
          src={`http://127.0.0.1:8000/storage/${currentProduct.image.image_url}`}
          alt="Ảnh sản phẩm"
          style={{ width: "100px", height: "auto", marginTop: "10px" }}
        />
      )}
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Lưu
      </Button>
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
};

export default Products;