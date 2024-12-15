import React from "react";
import { Layout, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Content
        style={{
          padding: "24px 48px",
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 8,
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Chính Sách Bảo Mật
        </Title>

        <Divider />

        <Paragraph>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và đảm bảo rằng
          thông tin của bạn được bảo mật. Chính sách này giải thích cách chúng
          tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.
        </Paragraph>

        <Title level={3}>1. Thông tin chúng tôi thu thập</Title>
        <Paragraph>
          Khi sử dụng dịch vụ của chúng tôi, chúng tôi có thể thu thập các loại
          thông tin sau:
        </Paragraph>
        <ul>
          <li>Thông tin cá nhân: Họ tên, địa chỉ email, số điện thoại.</li>
          <li>
            Thông tin hoạt động: Lịch sử mua hàng, các tương tác với dịch vụ của
            chúng tôi.
          </li>
        </ul>

        <Title level={3}>2. Mục đích sử dụng thông tin</Title>
        <Paragraph>Chúng tôi sử dụng thông tin của bạn để:</Paragraph>
        <ul>
          <li>Cung cấp và quản lý dịch vụ.</li>
          <li>Liên hệ hỗ trợ khi cần thiết.</li>
          <li>Nâng cao trải nghiệm người dùng.</li>
          <li>Tuân thủ các yêu cầu pháp lý.</li>
        </ul>

        <Title level={3}>3. Bảo mật thông tin</Title>
        <Paragraph>
          Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin
          của bạn khỏi mất mát, truy cập trái phép hoặc tiết lộ không hợp lệ.
        </Paragraph>

        <Title level={3}>4. Quyền của bạn</Title>
        <Paragraph>Bạn có quyền:</Paragraph>
        <ul>
          <li>Truy cập và chỉnh sửa thông tin cá nhân của mình.</li>
          <li>Yêu cầu chúng tôi xóa thông tin của bạn.</li>
          <li>Hạn chế hoặc từ chối việc xử lý thông tin cá nhân của mình.</li>
        </ul>

        <Title level={3}>5. Liên hệ</Title>
        <Paragraph>
          Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi, vui
          lòng liên hệ qua email:{" "}
          <a href="mailto:support@yourwebsite.com">beeshop@gmail.com</a>.
        </Paragraph>

        <Divider />

        <Paragraph style={{ textAlign: "center", marginTop: 24 }}>
          © {new Date().getFullYear()} BeeShop. Tất cả các quyền được bảo lưu.
        </Paragraph>
      </Content>
    </Layout>
  );
};

export default PrivacyPolicy;
