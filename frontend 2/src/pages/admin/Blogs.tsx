import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Blog {
  id: number;
  category_id: number;
  title: string;
  content: string;
  image: string;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/blogs');
      setBlogs(response.data.data || []);
    } catch (error) {
      message.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      message.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories(); 
  }, []);

  const handleAdd = () => {
    setCurrentBlog(null); 
    setIsModalVisible(true);
  };

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this blogs?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}`);
          message.success('Blog deleted successfully');
          fetchBlogs(); // Refresh the list
        } catch (error) {
          message.error('Failed to delete blogs');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentBlog) {
        // Update blog
        await axios.put(`http://127.0.0.1:8000/api/blogs/${currentBlog.id}`, values);
        message.success('Blog updated successfully');
      } else {
        // Add new blog
        await axios.post('http://127.0.0.1:8000/api/blogs', values);
        message.success('Blog created successfully');
      }
      setIsModalVisible(false);
      fetchBlogs(); 
    } catch (error) {
      message.error('Failed to save blog');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { 
      title: 'Image', 
      dataIndex: 'image', 
      key: 'image', 
      render: (image: string) => (
        <img src={image} alt="Blog Image" style={{ width: 100, height: 100, objectFit: 'cover' }} />
      ),
    },
    { title: 'Category', dataIndex: 'category_id', key: 'category_id', render: (categoryId: number) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'N/A';
    }},
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: (is_active: boolean) => (is_active ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Blog) => (
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
        Add Blog
      </Button>
      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        title={currentBlog ? 'Edit Blog' : 'Add Blog'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentBlog || { title: '', content: '', image: '', is_active: false, category_id: undefined }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Blog Title"
            rules={[{ required: true, message: 'Please enter blog title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* Add category select */}
          <Form.Item
            name="category_id"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Blogs;
