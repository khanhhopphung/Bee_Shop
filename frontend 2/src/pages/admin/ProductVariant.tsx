import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Switch,
  Upload,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { RcFile } from "antd/es/upload";

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
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [images, setImages] = useState<File[]>([]); // Lưu file ảnh mới được upload
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [form] = Form.useForm();
  // Lấy dữ liệu từ API
  const fetchVariants = async () => {
    setLoading(true); // Đặt trạng thái loading trước khi bắt đầu
    try {
      const accessToken = localStorage.getItem("access_token");

      // Kiểm tra nếu không có token (nghĩa là người dùng chưa đăng nhập)
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        setLoading(false); // Dừng trạng thái loading và thoát
        return;
      }

      // Thêm token vào header của yêu cầu
      const response = await axios.get(
        "http://127.0.0.1:8000/api/product-variants",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Thêm token vào header
          },
        }
      );

      setVariants(response.data.data || []); // Cập nhật danh sách biến thể sản phẩm vào state
    } catch (error) {
      message.error("Không thể tải danh sách biến thể sản phẩm");
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(response.data.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách sản phẩm");
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/sizes");
      setSizes(response.data.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách kích thước");
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/colors");
      setColors(response.data.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách màu sắc");
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
    form.resetFields();

    setIsModalVisible(true);
    setImages([]); // Xóa danh sách ảnh khi thêm mới
  };

  const handleEdit = (variant: ProductVariant) => {
    setCurrentVariant(variant);
    form.setFieldsValue(variant);

    setIsModalVisible(true);
    setImages([]); // Xóa danh sách ảnh khi chỉnh sửa
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product variant?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(
            `http://127.0.0.1:8000/api/product-variants/${id}`
          );
          message.success("Xóa biến thể sản phẩm thành công");
          fetchVariants(); // Reload danh sách sau khi xóa
        } catch (error) {
          message.error("Không thể xóa biến thể sản phẩm");
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    formData.append("product_id", values.product_id);
    formData.append("size_id", values.size_id);
    formData.append("color_id", values.color_id);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("is_active", values.is_active ? "1" : "0");

    // Gửi tất cả ảnh mới được upload
    images.forEach((file) => {
      formData.append("images[]", file);
    });

    // Gửi danh sách ảnh cũ nếu đang chỉnh sửa
    if (currentVariant?.images) {
      currentVariant.images.forEach((image) => {
        formData.append("existing_images[]", image.image_url); // Gửi đường dẫn ảnh cũ
      });
    }

    try {
      if (currentVariant) {
        // Cập nhật biến thể sản phẩm
        await axios.post(
          `http://127.0.0.1:8000/api/product-variants/${currentVariant.id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        message.success("Cập nhật biến thể sản phẩm thành công");
      } else {
        // Thêm mới biến thể sản phẩm
        await axios.post(
          "http://127.0.0.1:8000/api/product-variants",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success("Thêm biến thể sản phẩm thành công");
      }
      setIsModalVisible(false);
      fetchVariants(); // Reload danh sách sau khi thêm/cập nhật
    } catch (error) {
      message.error("Không thể lưu biến thể sản phẩm");
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

  const filteredVariants = variants.filter(
    (variant) =>
      products
        .find((p) => p.id === variant.product_id)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sizes
        .find((s) => s.id === variant.size_id)
        ?.size_name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      colors
        .find((c) => c.id === variant.color_id)
        ?.color_name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<ProductVariant> = [
    {
      title: <span style={{ fontSize: "18px", fontWeight: "bold" }}>STT</span>,
      key: "stt",
      render: (_: any, __: any, index: number) => (
        <strong style={{ fontSize: "16px" }}>{index + 1}</strong>
      ),
      align: "center",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Sản phẩm</span>
      ),
      dataIndex: "product_id",
      key: "product_id",
      render: (id: number) => (
        <span style={{ fontSize: "16px" }}>
          {products.find((p) => p.id === id)?.name || "N/A"}
        </span>
      ),
      align: "left",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Kích thước</span>
      ),
      dataIndex: "size_id",
      key: "size_id",
      render: (id: number) => (
        <span style={{ fontSize: "16px" }}>
          {sizes.find((s) => s.id === id)?.size_name || "N/A"}
        </span>
      ),
      align: "left",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Màu sắc</span>
      ),
      dataIndex: "color_id",
      key: "color_id",
      render: (id: number) => (
        <span style={{ fontSize: "16px" }}>
          {colors.find((c) => c.id === id)?.color_name || "N/A"}
        </span>
      ),
      align: "left",
    },
    {
      title: <span style={{ fontSize: "18px", fontWeight: "bold" }}>Giá</span>,
      dataIndex: "price",
      key: "price",
      render: (text: string) => (
        <span style={{ fontSize: "16px" }}>{text}</span>
      ),
      align: "right",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Tồn kho</span>
      ),
      dataIndex: "stock",
      key: "stock",
      render: (text: string) => (
        <span style={{ fontSize: "16px" }}>{text}</span>
      ),
      align: "right",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Hoạt động</span>
      ),
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean) => (
        <span
          style={{
            fontSize: "16px",
            color: is_active ? "#3f8600" : "#cf1322",
            fontWeight: "bold",
          }}
        >
          {is_active ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
      align: "center",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Hình ảnh</span>
      ),
      key: "images",
      render: (record: ProductVariant) => renderImages(record.images),
      align: "center",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Hành động</span>
      ),
      key: "actions",
      render: (record: ProductVariant) => (
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
          />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            type="primary"
            danger
            size="large"
          />
          <Button
            size="large"
            onClick={() => handleViewDetail(record)}
            icon={<EyeOutlined />}
            style={{ marginRight: 8 }}
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ fontSize: "16px", height: "40px" }}
          >
            Thêm biến thể sản phẩm
          </Button>

          <Input.Search
            placeholder="Tìm kiếm sản phẩm, kích thước, hoặc màu sắc"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{
              maxWidth: "600px",
              borderRadius: "8px",
              height: "48px",
            }}
          />
        </div>
        <hr />
        <Table
          columns={columns}
          dataSource={filteredVariants}
          rowKey="id"
          bordered
          pagination={{ position: ["bottomCenter"], showSizeChanger: true }}
          scroll={{ x: "800" }}
          style={{
            fontSize: "16px",
            borderRadius: "8px",
            width: "100%",
          }}
        />
      </div>

      <Modal
        open={isModalVisible}
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            {currentVariant ? "Chỉnh sửa biến thể" : "Thêm biến thể"}
          </span>
        }
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="product_id"
            label="Sản phẩm"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
          >
            <Select>
              {products.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="size_id"
            label="Kích thước"
            rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
          >
            <Select>
              {sizes.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.size_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="color_id"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
          >
            <Select>
              {colors.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.color_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <Input type="number" placeholder="Nhập giá" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Tồn kho"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng tồn kho" },
            ]}
          >
            <Input type="number" placeholder="Nhập tồn kho" />
          </Form.Item>

          <Form.Item name="is_active" label="Hoạt động" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="image_url">
            <Upload
              listType="picture-card"
              beforeUpload={(file) => {
                setImages((prev) => [...prev, file]);
                return false;
              }}
              onRemove={(file) => {
                setImages((prev) =>
                  prev.filter((img) => img.name !== file.name)
                );
              }}
              defaultFileList={currentVariant?.images.map((img, index) => ({
                uid: `${index}`,
                name: `Image-${index + 1}`,
                status: "done",
                url: `http://127.0.0.1:8000/storage/${img.image_url}`,
              }))}
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

      <Modal
        title="Chi tiết biến thể sản phẩm"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {currentVariant && (
          <div>
            <p>
              <strong>Sản phẩm:</strong>{" "}
              {products.find((p) => p.id === currentVariant.product_id)?.name ||
                "N/A"}
            </p>
            <p>
              <strong>Kích thước:</strong>{" "}
              {sizes.find((s) => s.id === currentVariant.size_id)?.size_name ||
                "N/A"}
            </p>
            <p>
              <strong>Màu sắc:</strong>{" "}
              {colors.find((c) => c.id === currentVariant.color_id)
                ?.color_name || "N/A"}
            </p>
            <p>
              <strong>Giá:</strong> {currentVariant.price}
            </p>
            <p>
              <strong>Tồn kho:</strong> {currentVariant.stock}
            </p>
            <p>
              <strong>Hoạt động:</strong>{" "}
              {currentVariant.is_active ? "Có" : "Không"}
            </p>
            <p>
              <strong>Hình ảnh:</strong>
            </p>
            {renderImages(currentVariant.images)}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductVariants;
