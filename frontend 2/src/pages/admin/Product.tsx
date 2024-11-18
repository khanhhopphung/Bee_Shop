import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch, Select, Space, Upload, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
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
  image_url: string; 

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
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null); 

  const [form] = Form.useForm();

  // Fetch categories, sizes, colors, and products
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

  // Handle search input change
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
    setFileList([]); 
  };


  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
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
  
      // Add form values to formData, setting undefined or '' for missing fields
      for (const key in values) {
        if (values[key] === undefined || values[key] === '') {
          formData.append(key, '');  // Set fields without data to empty string
        } else if (key !== 'image') {
          formData.append(key, values[key]);
        }
      }
  
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      } else {
        formData.append('image', '');  // Set image to empty string if no image uploaded
      }
  
      // Send the data to the backend (POST or PUT depending on whether it's a new product or update)
      if (currentProduct) {
        // Update product
        await axios.put(`http://127.0.0.1:8000/api/products/${currentProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Product updated successfully');
      } else {
        // Create new product
        await axios.post('http://127.0.0.1:8000/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Product created successfully');
      }
  
      setIsModalVisible(false);

      fetchProducts(); // Refresh the list of products

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
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
    { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at' },
    {
      title: 'Image',
      key: 'image',
      render: (record: Product) => (
        record.image_url ? <img src={record.image_url} alt={record.name} style={{ width: 50, height: 50 }} /> : 'No Image'
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Product) => (
        <Space>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search products by name, sku, or description"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearchChange}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
      />

      <Modal
        title={currentProduct ? 'Edit Product' : 'Add Product'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        footer={null}
      >
        <Form
          form={form}
          initialValues={currentProduct || { is_active: true }}
          onFinish={handleSubmit}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input product name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Please input SKU!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="category_id" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input stock quantity!' }]}>
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input price!' }]}>
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item name="size_id" label="Size">
            <Select>
              {sizes.map((size) => (
                <Select.Option key={size.id} value={size.id}>
                  {size.size_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="color_id" label="Color">
            <Select>
              {colors.map((color) => (
                <Select.Option key={color.id} value={color.id}>
                  {color.color_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              fileList={fileList}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              listType="picture-card"
            >
              {fileList.length === 0 && '+ Upload'}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {currentProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;