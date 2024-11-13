import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Chính Sách Bảo Mật
      </h1>
      <p className="text-lg mb-6 leading-relaxed">
        Chúng tôi cam kết bảo mật thông tin cá nhân của bạn. Trang này giải
        thích các loại thông tin cá nhân mà chúng tôi thu thập và cách chúng tôi
        sử dụng thông tin đó.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Thu Thập Thông Tin</h2>
        <p className="mb-3">
          Chúng tôi thu thập thông tin cá nhân mà bạn cung cấp trực tiếp khi bạn
          đăng ký tài khoản, mua sắm, và khi liên hệ với chúng tôi. Các thông
          tin này bao gồm tên, địa chỉ email, số điện thoại, địa chỉ giao hàng,
          và thông tin thanh toán.
        </p>
        <p>
          Ngoài ra, chúng tôi cũng có thể thu thập thông tin tự động qua cookie
          và các công nghệ theo dõi khác khi bạn sử dụng trang web của chúng
          tôi.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Sử Dụng Thông Tin</h2>
        <p className="mb-3">
          Thông tin thu thập được sẽ được sử dụng để cung cấp dịch vụ, xử lý đơn
          hàng, cải thiện trải nghiệm người dùng, và liên hệ khi cần thiết.
        </p>
        <p>
          Chúng tôi có thể sử dụng thông tin của bạn cho các mục đích tiếp thị,
          nhưng chỉ khi bạn đã đồng ý nhận thông tin quảng cáo từ chúng tôi.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Bảo Mật Thông Tin</h2>
        <p className="mb-3">
          Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin
          cá nhân của bạn khỏi truy cập, sử dụng hoặc tiết lộ trái phép. Tuy
          nhiên, không có phương thức truyền tải nào trên Internet hoặc phương
          thức lưu trữ nào là hoàn toàn an toàn.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Quyền Lợi Của Bạn</h2>
        <p className="mb-3">
          Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình.
          Nếu bạn có bất kỳ câu hỏi nào về quyền riêng tư hoặc muốn cập nhật
          thông tin của mình, vui lòng liên hệ với chúng tôi.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Thay Đổi Chính Sách</h2>
        <p>
          Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Bất
          kỳ thay đổi nào sẽ được đăng trên trang này, và khi tiếp tục sử dụng
          dịch vụ, bạn đồng ý với các thay đổi đó.
        </p>
      </section>

      <footer className="mt-10 text-center">
        <p>
          Nếu bạn có câu hỏi hoặc quan ngại nào về chính sách bảo mật, vui lòng{" "}
          <a href="/contact" className="text-blue-500 hover:underline">
            liên hệ với chúng tôi
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
