import { Form, Input, DatePicker, Select, Button, Typography } from "antd";
import {
  CalendarOutlined, UserOutlined, SwapOutlined,
  BoxPlotOutlined, SaveOutlined, ArrowRightOutlined
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const units = [
  "tonnes", "litres", "kWh (Net CV)", "kWh (Gross CV)",
  "cubic metres", "gj", "kg", "kwh"
];

const EditDataForm = ({ form, isReadOnly, loading, navigating, onSubmit }) => (
  <Form
    form={form}
    onFinish={onSubmit}
    layout="vertical"
    disabled={loading || isReadOnly}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Form.Item name="username" label={<Text>Username</Text>}>
        <Input prefix={<UserOutlined />} disabled />
      </Form.Item>

      <Form.Item
        name="date"
        label={<Text>Date</Text>}
        rules={[{ required: true, message: "Please select date" }]}
      >
        <DatePicker className="w-full" suffixIcon={<CalendarOutlined />} />
      </Form.Item>

      <Form.Item
        name="shift"
        label={<Text>Shift</Text>}
        rules={[{ required: true, message: "Select shift" }]}
      >
        <Select suffixIcon={<SwapOutlined />}>
          <Option value="1">Shift 1</Option>
          <Option value="2">Shift 2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="goodsProduced"
        label={<Text>Goods Produced</Text>}
        rules={[{ required: true, message: "Enter production" }]}
      >
        <Input type="number" prefix={<BoxPlotOutlined />} />
      </Form.Item>

      <Form.Item
        name="goodsUnit"
        label={<Text>Units</Text>}
        rules={[{ required: true, message: "Select unit" }]}
      >
        <Select>
          {units.map((unit) => (
            <Option key={unit} value={unit}>{unit}</Option>
          ))}
        </Select>
      </Form.Item>
    </div>

    {!isReadOnly && (
      <div className="flex justify-end mt-6">
        <Button
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={loading || navigating}
        >
          {navigating ? "Navigating..." : "Update Data"} <ArrowRightOutlined />
        </Button>
      </div>
    )}
  </Form>
);

export default EditDataForm;
