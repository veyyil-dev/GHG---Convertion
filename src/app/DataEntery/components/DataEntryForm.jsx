"use client"
import React ,{useEffect}from 'react';
import { Form, Input, Button, DatePicker, Select, Typography } from "antd";
import { 
  UserOutlined,
  CalendarOutlined,
  SwapOutlined,
  BoxPlotOutlined,
  ArrowRightOutlined,
  SaveOutlined
} from "@ant-design/icons";
import "../styles.css"
const { Option } = Select;
const { Text } = Typography;

const DataEntryForm = ({ loading, navigating, handleFormSubmit, user_Id }) => {
  const [form] = Form.useForm();

    useEffect(() => {
    form.setFieldsValue({ username: user_Id });
  }, [form, user_Id]);

  return (
    
    <Form
      form={form}
      onFinish={handleFormSubmit}
      layout="vertical"
      className="custom-form bg-white w-full p-9 mt-10 rounded-lg shadow-lg"
      disabled={loading}
    >
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label={<Text className="form-label block mb-1">Username</Text>}
          name="username"
          initialValue={user_Id}
          className="col-span-1 md:col-span-2" // Span full width on small, two columns on medium+
        >
          <Input
            prefix={<UserOutlined className="text-gray-400 mr-2" />}
            placeholder="Enter Username"
            disabled
          />
        </Form.Item>

        <Form.Item
          label={<Text className="form-label block mb-1">Date</Text>}
          name="date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker
            className="w-full"
            suffixIcon={<CalendarOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          label={<Text className="form-label block mb-1">Shift</Text>}
          name="shift"
          rules={[{ required: true, message: "Select shift" }]}
        >
          <Select
            suffixIcon={<SwapOutlined className="text-gray-400" />}
          >
            <Option value="1">Shift 1</Option>
            <Option value="2">Shift 2</Option>
            <Option value="3">Shift 3</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<Text className="form-label block mb-1">Goods Produced</Text>}
          name="goodsProduced"
          rules={[{ required: true, message: "Enter production" }]}
        >
          <Input
            type="number"
            prefix={<BoxPlotOutlined className="text-gray-400 mr-2" />}
          />
        </Form.Item>

        <Form.Item
          label={<Text className="form-label block mb-1">Units</Text>}
          name="goodsUnit"
          rules={[{ required: true, message: "Select unit" }]}
        >
          <Select>
            {["pcs","kg","tonnes", "litres"].map((unit) => (
              <Option key={unit} value={unit}>{unit}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          className="custom-button custom-button-primary"
          loading={loading || navigating}
        >
          {navigating ? "Navigating..." : "Save Data And Go to ScopeOne"} <ArrowRightOutlined />
        </Button>
      </div>
    </Form>
  );
};

export default DataEntryForm;
