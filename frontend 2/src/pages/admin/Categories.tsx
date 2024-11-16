import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

import axios from 'axios';

interface Category {
  id: number;
  name: string;
  sku: string;
  parent_category_id: number | null;
  is_active: boolean;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setCategories(data);
      setFilteredCategories(data); // Set initial filtered data
    } catch (error) {
      message.error('Failed to load categories');
      setCategories([]);
      setFilteredCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = categories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase()) ||
      category.sku.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filteredData);
  };

  const handleAdd = () => {
    setCurrentCategory(null);
    setIsModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
          message.success('Category deleted successfully');
          fetchCategories(); // Refresh the list
        } catch (error) {
          message.error('Failed to delete category');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentCategory) {
        await axios.put(`http://127.0.0.1:8000/api/categories/${currentCategory.id}`, values);
        message.success('Category updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/categories', values);
        message.success('Category created successfully');
      }
      setIsModalVisible(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      message.error('Failed to save category');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: (active: boolean) => (active ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Category) => (
        <>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Category
        </Button>
        <Input
          placeholder="Search by name or SKU"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredCategories} rowKey="id" />

      <Modal
        open={isModalVisible}
        title={currentCategory ? 'Edit Category' : 'Add Category'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentCategory || { name: '', sku: '', is_active: false }}
          onFinish={handleSubmit}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Please enter an SKU' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
