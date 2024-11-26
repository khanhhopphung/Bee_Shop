import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch, Select, Upload, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';

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
    setImageFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
      category_id: blog.category_id,
      is_active: blog.is_active,
    });
    setImageFile(null); // reset file input to prevent accidental re-upload
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

      if (currentBlog) {
        await axios.post(`http://127.0.0.1:8000/api/blogs/${currentBlog.id}/update`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Blog updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Blog created successfully');
      }

      setIsModalVisible(false);
      fetchBlogs();
    } catch (error) {
      message.error('Failed to save blog');
    }
  };

  const handleImageUpload = (file: RcFile) => {
    setImageFile(file);
    return false;
  };

  const columns: ColumnsType<Blog> = [

    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>STT</span>,
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: Blog, index: number) => (
        <strong style={{ fontSize: '16px' }}>{index + 1}</strong>
      ),
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tiêu đề</span>,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hình ảnh</span>,
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img
          src={image ? `http://127.0.0.1:8000/storage/${image}` : '/admin/default-image.jpg'}
          alt="Blog Image"
          style={{ width: '100px', height: 'auto' }}
        />
      ),
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Loại danh mục</span>,
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId: number) => {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : 'N/A';
      },
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <span
          style={{
            fontSize: '16px',
            color: active ? '#3f8600' : '#cf1322',
            fontWeight: 'bold',
          }}
        >
          {active ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Actions</span>,
      key: 'actions',
      render: (record: Blog) => (
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          />
          <Button
            type="primary"
            danger
            size="large"
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
      align: 'center',
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ fontSize: '16px', height: '40px' }}
          >
            Thêm bài viết
          </Button>

          <Input.Search
            placeholder="Tìm kiếm bài viết theo tiêu đề..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{
              maxWidth: '600px',
              borderRadius: '8px',
              height: '48px',
            }}
          />
        </div>
        <Select
          placeholder="Filter by category"
          allowClear
          style={{
            width: 250,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          onChange={handleCategoryFilter}
        >
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
        <hr />
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          bordered
          pagination={{ position: ['bottomCenter'], showSizeChanger: true }}
          style={{
            fontSize: '16px',
            borderRadius: '8px',
          }}
        />
      </div>
      {/* Modal */}
      <Modal
        open={isModalVisible}
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}</span>}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Select a category">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
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
                      uid: '-1', // Mã định danh duy nhất
                      name: imageFile.name,
                      status: 'done',
                      url: URL.createObjectURL(imageFile), // Hiển thị ảnh đã chọn
                    },
                  ]
                  : currentBlog?.image 
                    ? [
                      {
                        uid: '-2',
                        name: 'Current Image',
                        status: 'done',
                        url: `http://127.0.0.1:8000/storage/${currentBlog.image}`, 
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
            <Button type="primary" htmlType="submit" block size="large">
              Lưu
            </Button>
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  );
};

export default Blogs;
