import React from "react";
import { Layout, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const ReturnRefundPolicy: React.FC = () => {
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
          Chính Sách Đổi Trả và Hoàn Tiền
        </Title>

        <Divider />

        <Paragraph>
          Chúng tôi cam kết mang đến chính sách đổi trả và hoàn tiền rõ ràng và
          thuận tiện cho khách hàng. Dưới đây là các điều khoản và quy định mà
          bạn cần biết.
        </Paragraph>

        <Title level={3}>1. Điều kiện đổi trả</Title>
        <Paragraph>Các sản phẩm đủ điều kiện đổi trả bao gồm:</Paragraph>
        <ul>
          <li>Sản phẩm chưa qua sử dụng, còn nguyên bao bì.</li>
          <li>Sản phẩm bị lỗi do nhà sản xuất.</li>
        </ul>

        <Title level={3}>2. Quy trình đổi trả</Title>
        <Paragraph>Bạn có thể thực hiện đổi trả theo các bước sau:</Paragraph>
        <ol>
          <li>
            Liên hệ với bộ phận dịch vụ khách hàng để thông báo về lý do đổi
            trả.
          </li>
          <li>Chuẩn bị sản phẩm để trả lại.</li>
          <li>Gửi sản phẩm về địa chỉ đổi trả của cửa hàng.</li>
        </ol>

        <Title level={3}>3. Thời gian xử lý và hoàn tiền</Title>
        <Paragraph>
          Thời gian xử lý đổi trả và hoàn tiền mất khoảng 7-10 ngày làm việc.
        </Paragraph>

        <Title level={3}>4. Phí đổi trả</Title>
        <Paragraph>
          Phí đổi trả có thể được áp dụng tùy thuộc vào sản phẩm và lý do đổi
          trả.
        </Paragraph>

        <Title level={3}>5. Điều kiện hoàn tiền</Title>
        <Paragraph>
          Bạn sẽ được hoàn tiền nếu sản phẩm bị lỗi hoặc không đúng với đơn hàng
          đã đặt.
        </Paragraph>

        <Title level={3}>6. Kiểm tra hàng trước khi nhận</Title>
        <Paragraph>
          Khách hàng có quyền kiểm tra sản phẩm trước khi nhận hàng và từ chối
          nhận nếu sản phẩm bị hư hỏng.
        </Paragraph>

        <Title level={3}>8. Liên hệ</Title>
        <Paragraph>
          Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ qua
          email:
          <a href="mailto:support@yourwebsite.com">beeshop@gmail.com</a> hoặc số
          điện thoại: 0968249852.
        </Paragraph>

        <Divider />

        <Paragraph style={{ textAlign: "center", marginTop: 24 }}>
          © {new Date().getFullYear()} BeeShop. Tất cả các quyền được bảo lưu.
        </Paragraph>
      </Content>
    </Layout>
  );
};

export default ReturnRefundPolicy;
