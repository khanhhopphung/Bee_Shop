import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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
  image_url: string; // assuming you need image_url in the product object
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<any>(null); // To store selected image

  // Fetch products and categories from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data.data || []);
    } catch (error) {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      message.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setCurrentProduct(null); // Reset form for new product
    setIsModalVisible(true);
    setImage(null); // Reset selected image
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
    setImage(null); // No need to reset if editing but include for clarity
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      message.success('Product deleted successfully');
      fetchProducts(); // Refresh products list
    } catch (error) {
      message.error('Failed to delete product');
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
    formData.append('name', values.name);
    formData.append('sku', values.sku);
    formData.append('description', values.description);
    formData.append('category_id', values.category_id);
    formData.append('stock', values.stock);
    formData.append('price', values.price);
    formData.append('is_active', values.is_active ? '1' : '0');
    
    if (image) {
      formData.append('image', image); // Append the image to the form data
    }

    try {
      if (currentProduct) {
        // Update product
        await axios.put(`http://127.0.0.1:8000/api/products/${currentProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Product updated successfully');
      } else {
        // Add new product
        await axios.post('http://127.0.0.1:8000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Product created successfully');
      }
      setIsModalVisible(false);
      fetchProducts(); // Refresh products list
    } catch (error) {
      message.error('Failed to save product');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Category ID', dataIndex: 'category_id', key: 'category_id' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: (is_active: boolean) => (is_active ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Product) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
          />
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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        title={currentProduct ? 'Edit Product' : 'Add Product'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentProduct || { name: '', sku: '', category_id: '', price: 0, stock: 0, is_active: false }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter product name' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}>
            <Select>
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter stock' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="image"
            label="Product Image"
            valuePropName="fileList"
            getValueFromEvent={handleImageUpload}>
            <Input type="file" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
