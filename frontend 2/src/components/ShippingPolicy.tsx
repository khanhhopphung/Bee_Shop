import React from "react";
import { Layout, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const ShippingPolicy: React.FC = () => {
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
          Chính Sách Giao Hàng
        </Title>

        <Divider />

        <Paragraph>
          Chúng tôi cam kết cung cấp dịch vụ giao hàng nhanh chóng và đáng tin
          cậy. Chính sách này mô tả các điều khoản và quy định liên quan đến
          việc giao hàng.
        </Paragraph>

        <Title level={3}>1. Phạm vi giao hàng</Title>
        <Paragraph>
          Chúng tôi hỗ trợ giao hàng trong phạm vi toàn quốc. Đối với các khu
          vực ngoại thành hoặc vùng sâu, vùng xa, thời gian giao hàng có thể kéo
          dài hơn.
        </Paragraph>

        <Title level={3}>2. Thời gian giao hàng</Title>
        <Paragraph>Thời gian giao hàng dự kiến:</Paragraph>
        <ul>
          <li>Đối với khu vực nội thành: 1-2 ngày làm việc.</li>
          <li>Đối với khu vực ngoại thành: 3-5 ngày làm việc.</li>
          <li>Đối với vùng sâu, vùng xa: 5-7 ngày làm việc.</li>
        </ul>

        <Title level={3}>3. Phí giao hàng</Title>
        <Paragraph>Phí giao hàng sẽ được tính dựa trên:</Paragraph>
        <ul>
          <li>Khoảng cách giao hàng.</li>
          <li>Trọng lượng và kích thước của sản phẩm.</li>
        </ul>
        <Paragraph>
          Các đơn hàng có giá trị từ 500.000 VNĐ trở lên sẽ được miễn phí giao
          hàng trong phạm vi nội thành.
        </Paragraph>

        <Title level={3}>4. Kiểm tra hàng trước khi nhận</Title>
        <Paragraph>
          Khách hàng có quyền kiểm tra tình trạng sản phẩm trước khi nhận hàng.
          Nếu phát hiện sản phẩm bị hư hỏng hoặc không đúng với đơn đặt hàng,
          vui lòng từ chối nhận hàng và liên hệ ngay với chúng tôi để được hỗ
          trợ.
        </Paragraph>

        <Title level={3}>5. Chính sách đổi/trả hàng</Title>
        <Paragraph>
          Trong trường hợp sản phẩm gặp lỗi hoặc không đúng với đơn đặt hàng,
          chúng tôi sẽ hỗ trợ đổi/trả miễn phí trong vòng 7 ngày kể từ ngày nhận
          hàng.
        </Paragraph>

        <Title level={3}>6. Liên hệ</Title>
        <Paragraph>
          Nếu bạn có bất kỳ câu hỏi nào về chính sách giao hàng, vui lòng liên
          hệ qua email:{" "}
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

export default ShippingPolicy;
