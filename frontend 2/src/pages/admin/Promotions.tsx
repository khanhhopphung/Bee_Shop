import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Switch,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface Promotion {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  tier_id?: number;
}

interface Tier {
  id: number;
  tier_name: string;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  // Fetch promotions from API
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/promotions");
      const promotionsData = response.data.data.map((promotion: Promotion) => ({
        ...promotion,
        start_date: dayjs(promotion.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(promotion.end_date).format("YYYY-MM-DD"),
      }));
      setPromotions(promotionsData);
      setFilteredPromotions(promotionsData);
    } catch (error) {
      message.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tiers");
      setTiers(response.data.data || []);
    } catch (error) {
      message.error("Failed to load tiers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchTiers();
  }, []);

  // Handle search and filter
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = promotions.filter((promotion) =>
      promotion.code.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPromotions(filtered);
  };

  const handleDiscountRangeFilter = (range: string | null) => {
    if (range) {
      const [min, max] = range.split("-").map(Number);
      filterPromotions(searchText, min, max);
    } else {
      filterPromotions(searchText);
    }
  };

  const filterPromotions = (text: string, min?: number, max?: number) => {
    const filtered = promotions
      .filter((promotion) => {
        const matchesText =
          promotion.code.toLowerCase().includes(text.toLowerCase()) ||
          promotion.discount_type.toLowerCase().includes(text.toLowerCase()) ||
          promotion.discount_value.toString().includes(text);
        const matchesRange =
          min === undefined ||
          max === undefined ||
          (promotion.discount_value >= min && promotion.discount_value <= max);
        return matchesText && matchesRange;
      })
      .sort((a, b) => a.discount_value - b.discount_value);

    setFilteredPromotions(filtered);
  };

  const handleAdd = () => {
    setCurrentPromotion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (promotion: Promotion) => {
    const formattedPromotion = {
      ...promotion,
      start_date: dayjs(promotion.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(promotion.end_date).format("YYYY-MM-DD"),
    };
    setCurrentPromotion(formattedPromotion);
    form.setFieldsValue(formattedPromotion);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Promotion?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/promotions/${id}`);

          message.success("Promotion deleted successfully");
          fetchPromotions();
        } catch (error) {
          message.error("Failed to delete promotion");
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentPromotion) {
        // Update promotion
        await axios.put(
          `http://127.0.0.1:8000/api/promotions/${currentPromotion.id}`,
          values
        );
        message.success("Promotion updated successfully");
      } else {
        // Add new promotion
        await axios.post("http://127.0.0.1:8000/api/promotions", values);
        message.success("Promotion created successfully");
      }
      setIsModalVisible(false);
      fetchPromotions();
    } catch (error) {
      message.error("Failed to save promotion");
    }
  };

  const columns = [
    // <<<<<<< HEAD
    //     { title: "ID", dataIndex: "id", key: "id" },
    //     { title: "Code", dataIndex: "code", key: "code" },
    //     {
    //       title: "Discount Type",
    //       dataIndex: "discount_type",
    //       key: "discount_type",
    //     },
    //     {
    //       title: "Discount Value",
    //       dataIndex: "discount_value",
    //       key: "discount_value",
    //     },
    //     { title: "Usage Limit", dataIndex: "usage_limit", key: "usage_limit" },
    //     { title: "Start Date", dataIndex: "start_date", key: "start_date" },
    //     { title: "End Date", dataIndex: "end_date", key: "end_date" },
    //     {
    //       title: "Tier",
    //       dataIndex: "tier_id",
    //       key: "tier_id",
    //       render: (tierId: number) => {
    //         const tier = tiers.find((t) => t.id === tierId);
    //         return tier ? tier.tier_name : "N/A";
    //       },
    //     },
    //     {
    //       title: "Active",
    //       dataIndex: "is_active",
    //       key: "is_active",
    //       render: (is_active: boolean) => (is_active ? "Yes" : "No"),
    //     },
    //     {
    //       title: "Actions",
    //       key: "actions",
    //       render: (record: Promotion) => (
    // =======
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: Promotion, index: number) => index + 1,
    },
    { title: "Tên mã giảm giá", dataIndex: "code", key: "code" },
    {
      title: "Loại giảm giá ",
      dataIndex: "discount_type",
      key: "discount_type",
    },
    {
      title: "Giá trị giảm gía",
      dataIndex: "discount_value",
      key: "discount_value",
    },
    { title: "Số lần sử dụng", dataIndex: "usage_limit", key: "usage_limit" },
    {
      title: "Loại cấp bậc",
      dataIndex: "tier_id",
      key: "tier_id",
      render: (tierId: number) => {
        const tier = tiers.find((t) => t.id === tierId);
        return tier ? tier.tier_name : "N/A";
      },
    },
    { title: "Ngày áp dụng", dataIndex: "start_date", key: "start_date" },
    { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date" },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (active ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Promotion) => (
        // >>>>>>> fix-dev
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 17,
        }}
      >
        <Select
          placeholder="Filter by Discount Value"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => handleDiscountRangeFilter(value)}
        >
          <Select.Option value="5-15">Mã giảm giá 5% - 15%</Select.Option>
          <Select.Option value="15-30">Mã giảm giá 15% - 30%</Select.Option>
          <Select.Option value="30-45">Mã giảm giá 30% - 45%</Select.Option>
          <Select.Option value="45-60">Mã giảm giá 45% - 60%</Select.Option>
        </Select>

        <Input
          placeholder="Search by code "
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 600 }}
        />
      </div>

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
        dataSource={filteredPromotions}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalVisible}
        // <<<<<<< HEAD
        //         title={currentPromotion ? "Edit Promotion" : "Add Promotion"}
        //         onCancel={() => setIsModalVisible(false)}
        //         footer={null}
        //       >
        //         <Form
        //           initialValues={
        //             currentPromotion || {
        //               code: "",
        //               discount_type: "",
        //               discount_value: 0,
        //               usage_limit: 0,
        //               start_date: "",
        //               end_date: "",
        //               is_active: false,
        //               tier_id: undefined,
        //             }
        //           }
        //           onFinish={handleSubmit}
        //         >
        //           <Form.Item
        //             name="code"
        //             label="Promotion Code"
        //             rules={[{ required: true, message: "Please enter promotion code" }]}
        //           >
        // =======
        title={currentPromotion ? "Edit Promotion" : "Add Promotion"}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields(); // Reset form fields when closing the modal
        }}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            code: "",
            discount_type: "",
            discount_value: 0,
            usage_limit: 0,
            start_date: "",
            end_date: "",
            is_active: false,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="code"
            label="Promotion Code"
            rules={[{ required: true, message: "Please enter promotion code" }]}
          >
            {/* >>>>>>> fix-dev */}
            <Input />
          </Form.Item>

          <Form.Item
            name="discount_type"
            label="Discount Type"
            rules={[{ required: true, message: "Please select discount type" }]}
          >
            <Select>
              <Select.Option value="percentage">Percentage</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount_value"
            label="Discount Value"
            // <<<<<<< HEAD
            //             rules={[{ required: true, message: "Please enter discount value" }]}
            //           >
            //             <Input type="number" />
            //           </Form.Item>
            //           <Form.Item
            //             name="usage_limit"
            //             label="Usage Limit"
            //             rules={[{ required: true, message: "Please enter usage limit" }]}
            //           >
            //             <Input type="number" />
            //           </Form.Item>
            //           <Form.Item
            //             name="start_date"
            //             label="Start Date"
            //             rules={[{ required: true, message: "Please select start date" }]}
            //           >
            //             <Input type="date" />
            //           </Form.Item>
            //           <Form.Item
            //             name="end_date"
            //             label="End Date"
            //             rules={[{ required: true, message: "Please select end date" }]}
            //           >
            //             <Input type="date" />
            //           </Form.Item>
            // =======
            rules={[
              { required: true, message: "Please enter discount value" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Discount value must be a non-negative number"
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="usage_limit"
            label="Usage Limit"
            rules={[
              { required: true, message: "Please enter usage limit" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Usage limit must be a non-negative number"
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <Input type="date" />
          </Form.Item>

          {/* >>>>>>> fix-dev */}
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          {/* <<<<<<< HEAD
          <Form.Item
            name="tier_id"
            label="Tier"
            rules={[{ required: true, message: "Please select a tier" }]}
          >
======= */}
          <Form.Item
            name="tier_id"
            label="Tier"
            rules={[{ required: true, message: "Please select a tier" }]}
          >
            {/* >>>>>>> fix-dev */}
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
