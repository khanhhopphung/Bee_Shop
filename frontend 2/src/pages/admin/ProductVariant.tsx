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
  const [sizes, setSizes] = useState<any[]>([]); // Sizes list
  const [colors, setColors] = useState<any[]>([]); // Colors list

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

  const handleAdd = () => {
    setCurrentVariant(null); // Reset form
    setIsModalVisible(true);
  };

  const handleEdit = (variant: ProductVariant) => {
    setCurrentVariant(variant);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/product-variants/${id}`);
      message.success('Product variant deleted successfully');
      fetchProductVariants(); // Refresh product variants list
    } catch (error) {
      message.error('Failed to delete product variant');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentVariant) {
        // Update product variant
        await axios.put(`http://127.0.0.1:8000/api/product-variants/${currentVariant.id}`, values);
        message.success('Product variant updated successfully');
      } else {
        // Add new product variant
        await axios.post('http://127.0.0.1:8000/api/product-variants', values);
        message.success('Product variant created successfully');
      }
      setIsModalVisible(false);
      fetchProductVariants(); // Refresh product variants list
    } catch (error) {
      message.error('Failed to save product variant');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Product ID', dataIndex: 'product_id', key: 'product_id' },
    { title: 'Size ID', dataIndex: 'size_id', key: 'size_id' },
    { title: 'Color ID', dataIndex: 'color_id', key: 'color_id' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: (is_active: boolean) => (is_active ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ProductVariant) => (
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
        Add Product Variant
      </Button>
      <Table
        columns={columns}
        dataSource={productVariants}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        title={currentVariant ? 'Edit Product Variant' : 'Add Product Variant'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentVariant || { product_id: '', size_id: '', color_id: '', price: 0, stock: 0, is_active: false }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="product_id"
            label="Product ID"
            rules={[{ required: true, message: 'Please enter product ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="size_id"
            label="Size"
            rules={[{ required: true, message: 'Please select a size' }]}
          >
            <Select>
              {sizes.map(size => (
                <Select.Option key={size.id} value={size.id}>
                  {size.size_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="color_id"
            label="Color"
            rules={[{ required: true, message: 'Please select a color' }]}
          >
            <Select>
              {colors.map(color => (
                <Select.Option key={color.id} value={color.id}>
                  {color.color_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter stock' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductVariants;
