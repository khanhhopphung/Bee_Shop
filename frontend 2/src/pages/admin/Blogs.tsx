import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch, Select, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RcFile } from 'antd/es/upload';

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
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [form] = Form.useForm();
  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/blogs');
      setBlogs(response.data.data || []);
      setFilteredBlogs(response.data.data || []);
    } catch (error) {
      message.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      message.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Search and filter logic
  const handleSearch = (value: string) => {
    setSearchText(value);
    filterBlogs(value, selectedCategory);
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    filterBlogs(searchText, categoryId);
  };

  const filterBlogs = (text: string, categoryId: number | null) => {
    const filtered = blogs.filter((blog) => {
      const matchesText =
        blog.title.toLowerCase().includes(text.toLowerCase()) ||
        blog.content.toLowerCase().includes(text.toLowerCase());
      const matchesCategory = categoryId === null || blog.category_id === categoryId;
      return matchesText && matchesCategory;
    });
    setFilteredBlogs(filtered);
  };

  const handleAdd = () => {
    setCurrentBlog(null);
    form.resetFields(); // Reset form fields for adding new data
    setIsModalVisible(true);
  };

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    form.setFieldsValue(blog);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this blog?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}`);
          message.success('Blog deleted successfully');
          fetchBlogs();
        } catch (error) {
          message.error('Failed to delete blog');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('category_id', values.category_id);
      formData.append('is_active', values.is_active ? '1' : '0');
      if (imageFile) formData.append('image', imageFile);

      let response;
      if (currentBlog) {
        // Update blog
        response = await axios.put(`http://127.0.0.1:8000/api/blogs/${currentBlog.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Blog updated successfully');
      } else {
        // Add new blog
        response = await axios.post('http://127.0.0.1:8000/api/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Blog created successfully');
      }

      console.log('API Response:', response.data);  // Log response for debugging

      setIsModalVisible(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      message.error('Failed to save blog');
    }
  };

  const handleImageUpload = (file: RcFile) => {
    setImageFile(file);
    return false;
  };

  // Table columns
  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: Blog, index: number) => index + 1,
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    {
      title: 'Hình ảnh', dataIndex: 'image', key: 'image', render: (image: string) => (
        <img
          src={image ? `http://127.0.0.1:8000/storage/${image}` : '/admin/default-image.jpg'}
          alt="Blog Image"
          style={{ width: '100px', height: 'auto' }}
        />

      ),
    },
    {
      title: 'Loại danh mục',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId: number) => {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : 'N/A';
      },
    },
    { title: 'Trạng thái', dataIndex: 'is_active', key: 'is_active', render: (active: boolean) => (active ? 'Yes' : 'No') },
    {
      title: 'Actions', key: 'actions', render: (record: Blog) => (
        <>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} style={{ marginRight: 8 }} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 17 }}>
        <Select
          placeholder="Filter by category"
          allowClear
          style={{ width: 200, }}
          onChange={handleCategoryFilter}
        >
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>

        <Input
          placeholder="Search by title or content"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 600 }}
        />
      </div>

      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Blog
      </Button>

      <Table columns={columns} dataSource={filteredBlogs} rowKey="id" loading={loading} />

      <Modal
        open={isModalVisible}
        title={currentBlog ? 'Edit Blog' : 'Add Blog'}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          initialValues={currentBlog || { title: '', content: '', image: '', is_active: false, category_id: undefined }}
          onFinish={handleSubmit}
        >
          <Form.Item name="title" label="Blog Title" rules={[{ required: true, message: 'Please enter blog title' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content" rules={[{ required: true, message: 'Please enter content' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload beforeUpload={handleImageUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            {imageFile && <div>Selected Image: {imageFile.name}</div>}
          </Form.Item>

          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="category_id" label="Category" rules={[{ required: true, message: 'Please select a category' }]}
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
export default Blogs 