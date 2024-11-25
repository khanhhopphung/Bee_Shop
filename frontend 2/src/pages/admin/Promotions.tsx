import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';


interface Promotion {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  tier_id?: number; // Thêm trường tier_id để liên kết với bảng tiers
}

interface Tier {
  id: number;
  tier_name: string;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]); // Sử dụng kiểu Tier
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch promotions from API
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/promotions');
      setPromotions(response.data.data || []);
    } catch (error) {
      message.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tiers from API
  const fetchTiers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tiers');
      setTiers(response.data.data || []); 
    } catch (error) {
      message.error('Failed to load tiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchTiers(); 
  }, []);

  const handleAdd = () => {
    setCurrentPromotion(null); 
    setIsModalVisible(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this Promotion?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/promotions/${id}`);
          message.success('Promotion deleted successfully');
          fetchPromotions(); // Refresh the list
        } catch (error) {
          message.error('Failed to delete promotion');
        }
      },
    });
  };


  const handleSubmit = async (values: any) => {
    try {
      if (currentPromotion) {
        // Update promotion
        await axios.put(`http://127.0.0.1:8000/api/promotions/${currentPromotion.id}`, values);
        message.success('Promotion updated successfully');
      } else {
        // Add new promotion
        await axios.post('http://127.0.0.1:8000/api/promotions', values);
        message.success('Promotion created successfully');
      }
      setIsModalVisible(false);
      fetchPromotions(); // Refresh danh sách khuyến mãi
    } catch (error) {
      message.error('Failed to save promotion');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Discount Type', dataIndex: 'discount_type', key: 'discount_type' },
    { title: 'Discount Value', dataIndex: 'discount_value', key: 'discount_value' },
    { title: 'Usage Limit', dataIndex: 'usage_limit', key: 'usage_limit' },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date' },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Tier',
      dataIndex: 'tier_id',
      key: 'tier_id',
      render: (tierId: number) => {
        const tier = tiers.find((t) => t.id === tierId); 
        return tier ? tier.tier_name : 'N/A'; 
      },
    },
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: (is_active: boolean) => (is_active ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Promotion) => (
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
        Add Promotion
      </Button>
      <Table
        columns={columns}
        dataSource={promotions}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        title={currentPromotion ? 'Edit Promotion' : 'Add Promotion'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentPromotion || { code: '', discount_type: '', discount_value: 0, usage_limit: 0, start_date: '', end_date: '', is_active: false, tier_id: undefined }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="code"
            label="Promotion Code"
            rules={[{ required: true, message: 'Please enter promotion code' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discount_type"
            label="Discount Type"
            rules={[{ required: true, message: 'Please select discount type' }]}
          >
            <Select>
              <Select.Option value="percentage">Percentage</Select.Option>
              <Select.Option value="fixed">Fixed Amount</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="discount_value"
            label="Discount Value"
            rules={[{ required: true, message: 'Please enter discount value' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="usage_limit"
            label="Usage Limit"
            rules={[{ required: true, message: 'Please enter usage limit' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* Thêm trường chọn tier */}
          <Form.Item
            name="tier_id"
            label="Tier"
            rules={[{ required: true, message: 'Please select a tier' }]}
          >
            <Select>
              {tiers.map((tier) => (
                <Select.Option key={tier.id} value={tier.id}>
                  {tier.tier_name}
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

export default Promotions;
