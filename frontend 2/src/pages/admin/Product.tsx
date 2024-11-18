import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch, Select, Space, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category_id: number;
  stock: number;
  price: number;
  is_active: boolean;
  image_url?: string;
  size_id?: number;
  color_id?: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<any | null>(null); // Define the state for the selected file

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      message.error('Failed to load categories');
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (error) {
      message.error('Failed to load products');
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

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.sku.toLowerCase().includes(value.toLowerCase()) ||
      product.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAdd = () => {
    setCurrentProduct(null);
    setIsModalVisible(true);
    setFileList([]);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
    setFileList([]);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (currentProduct) {
        await axios.put(`http://127.0.0.1:8000/api/products/${currentProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Product updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Product created successfully');
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Failed to save product');
    }
  };

  const columns = [
    { title: 'STT', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'N/A';
      },
    },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Size',
      dataIndex: 'size_id',
      key: 'size_id',
      render: (sizeId: number) => {
        const size = sizes.find((s) => s.id === sizeId);
        return size ? size.size_name : 'N/A';
      },
    },
    {
      title: 'Color',
      dataIndex: 'color_id',
      key: 'color_id',
      render: (colorId: number) => {
        const color = colors.find((c) => c.id === colorId);
        return color ? color.color_name : 'N/A';
      },
    },
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: (active: boolean) => (active ? 'Yes' : 'No') },
    {
      title: 'Hình ảnh', dataIndex: 'image_url', key: 'image', render: (image: string) => (
        <img
          src={image ? 'http://127.0.0.1:8000/storage/${image}' : 'http://127.0.0.1:8000/storage/${image}'}
          alt="Product Image"
          style={{ width: '100px', height: 'auto' }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Product) => (
        <>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
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
          placeholder="Search by name, SKU, or description"
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Product</Button>
      </Space>

      <Table columns={columns} dataSource={filteredProducts} rowKey="id" />

      <Modal
        open={isModalVisible}
        title={currentProduct ? 'Edit Product' : 'Add Product'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentProduct || { name: '', sku: '', description: '', category_id: '', stock: 0, price: 0, size_id: '', color_id: '', is_active: true }}
          onFinish={handleSubmit}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input product name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="SKU" name="sku" rules={[{ required: true, message: 'Please input SKU!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Category" name="category_id" rules={[{ required: true, message: 'Please select category!' }]}>
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Size" name="size_id">
            <Select>
              {sizes.map((size) => (
                <Select.Option key={size.id} value={size.id}>
                  {size.size_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Color" name="color_id">
            <Select>
              {colors.map((color) => (
                <Select.Option key={color.id} value={color.id}>
                  {color.color_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Stock" name="stock">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={(file) => { setImageFile(file); return false; }} // Update the imageFile state
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            {imageFile && <div>Selected Image: {imageFile.name}</div>}  {/* Display file name */}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
