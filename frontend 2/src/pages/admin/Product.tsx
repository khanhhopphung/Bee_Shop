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
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ColumnsType } from "antd/es/table";

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category_id: number;
  stock: number;
  is_active: boolean;
  image: { image_url: string };
  size_id: number;
  color_id: number;
  created_at: string;
  updated_at: string;
}

interface ProductVariant {
  id: number;
  product_id: number;
  size_id: number;
  color_id: number;
  price: number;
  stock: number;
  is_active: boolean;
  images: { image_url: string }[]; 
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
  const [variants, setVariants] = useState<any[]>([]);
  const [isVariantModalVisible, setIsVariantModalVisible] = useState(false);
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
  const renderImages = (images: { image_url: string }[]) => (
    <div style={{ display: "flex", gap: "8px" }}>
      {images.map((image, index) => (
        <img
          key={index}
          src={`http://127.0.0.1:8000/storage/${image.image_url}`}
          alt={`Hình sản phẩm ${index}`}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ))}
    </div>
  );

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
      const accessToken = localStorage.getItem("access_token");

      // Kiểm tra nếu token không tồn tại
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        return; // Dừng việc tải dữ liệu nếu chưa có token
      }

      // Thêm token vào headers nếu có
      const response = await axios.get("http://127.0.0.1:8000/api/products", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm token vào header
        },
      });

      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm.");
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const fetchVariants = async (productId: number) => {
    try {
      const response =
        await axios.get(`http://127.0.0.1:8000/api/products/${productId}/variants
        `);
      let formattedVariants: any[] = [];

      if (Array.isArray(response.data.data)) {
        formattedVariants = response.data.data;
      } else if (response.data.data) {
        formattedVariants = [response.data.data];
      }

      if (formattedVariants.length === 0) {
        message.warning("Không có biến thể nào cho sản phẩm này.");
      }

      setVariants(formattedVariants);
      setIsVariantModalVisible(true);
    } catch (error) {
      message.error("Không thể tải biến thể sản phẩm");
    }
  };

  const handleViewDetails = (product: Product) => {
    fetchVariants(product.id);
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
    const accessToken = localStorage.getItem("access_token");
  
    if (!accessToken) {
      message.error("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.");
      return;
    }
  
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
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        message.success("Sản phẩm đã được cập nhật");
      } else {
        await axios.post("http://127.0.0.1:8000/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
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
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: Product, index: number) => (
        <strong>{index + 1}</strong>
      ),
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      key: "image",
      render: (image: string, record: Product) => (
        <img
          src={
            record.image?.image_url
              ? `http://127.0.0.1:8000/storage/${record.image.image_url}`
              : "http://127.0.0.1:8000/storage/default-image.jpg"
          }
          alt="Ảnh sản phẩm"
          style={{ width: "100px", height: "auto" }}
        />
      ),
    },
    { title: "Mã sản phẩm", dataIndex: "sku", key: "sku" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      key: "category_id",
      render: (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "N/A";
      },
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (
        <span
          style={{ color: active ? "#3f8600" : "#cf1322", fontWeight: "bold" }}
        >
          {active ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (record: Product) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          />
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "16px 24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm sản phẩm
          </Button>

          <Input.Search
            value={searchText}
            onChange={handleSearchChange}
            size="large"
            allowClear
            placeholder="Tìm kiếm theo tên, SKU, hoặc mô tả"
            enterButton={<SearchOutlined />}
            style={{ maxWidth: "600px" }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          bordered
          pagination={{ position: ["bottomCenter"], showSizeChanger: true }}
        />
      </div>
      <Modal
        open={isModalVisible}
        title={currentProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
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
                        uid: "-1",
                        name: imageFile.name,
                        status: "done",
                        url: URL.createObjectURL(imageFile),
                      },
                    ]
                  : currentProduct?.image
                  ? [
                      {
                        uid: "-2",
                        name: "Current Image",
                        status: "done",
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
            <Button type="primary" htmlType="submit" block>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={isVariantModalVisible}
        title="Biến thể sản phẩm"
        onCancel={() => setIsVariantModalVisible(false)}
        footer={null}
        centered
      >
        <Table
          columns={[
            {
              title: <span style={{ fontSize: "18px" }}>STT</span>,
              key: "stt",
              render: (_: any, __: any, index: number) => (
                <strong style={{ fontSize: "16px" }}>{index + 1}</strong>
              ),
              align: "center",
            },
            {
              title: "Color",
              dataIndex: "color_id",
              key: "color_id",
              render: (colorId) => {
                const color = colors.find((c) => c.id === colorId);
                return color ? color.color_name : "N/A";
              },
            },
            {
              title: "size",
              dataIndex: "size_id",
              key: "size_id",
              render: (sizeId) => {
                const size = sizes.find((s) => s.id === sizeId);
                return size ? size.size_name : "N/A";
              },
            },
            { title: "Stock", dataIndex: "stock", key: "stock" },
            { title: "price", dataIndex: "price", key: "price" },
            {
              title: (
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>Hình ảnh</span>
              ),
              key: "images",
              render: (record: ProductVariant) => renderImages(record.images),
              align: "center",
            },
            
          ]}
          dataSource={variants}
          rowKey="id"
          pagination={{ position: ["bottomCenter"] }}
        />
      </Modal>
    </div>
  );
};

export default Products;