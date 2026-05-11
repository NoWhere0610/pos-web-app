<h3 align="center">Hệ Thống Bán Lẻ POS</h3>
Đây là hệ thống POS đơn giản, cho phép người dùng quản lý sản phẩm, tạo đơn hàng và thanh toán trực tiếp tại quầy.
<p></p>
<details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#tính-năng-của-hệ-thống">Tính năng của hệ thống</a>
    </li>
    <li>
      <a href="#hướng-dẫn-cài-đặt">Hướng dẫn cài đặt</a>
      <ul>
        <li><a href="#điều-kiện-tiên-quyết">Điều kiện tiên quyết</a></li>
        <li><a href="#cài-đặt">Cài đặt</a></li>
      </ul>
    </li>
    <li><a href="#cách-sử-dụng">Cách sử dụng</a></li>
  </ol>
</details>

## Tính năng của hệ thống

Quản lý sản phẩm: Hiển thị danh sách sản phẩm theo dạng bảng kèm phân trang.

Bán hàng:
<ul>
<li>Thêm sản phẩm bằng cách click chuột hoặc nhập mã Id.</li>
<li>Điều chỉnh số lượng (+/-) và xóa sản phẩm.</li>
<li>Tự động tính toán Tạm tính, Thuế VAT (10%) và Tổng tiền.</li>
</ul>

Thanh toán:
<ul>
<li>Nhập số tiền khách đưa và tự động tính tiền thừa trả khách.</li>
<li>Trừ tồn kho: Sau khi thanh toán thành công, số lượng sản phẩm trong kho sẽ tự động giảm xuống.</li>
</ul>

Quản lý đơn hàng:
<ul>
  <li>Xem danh sách đơn hàng đã hoàn thành</li>
  <li>Xem chi tiết từng đơn hàng (danh sách sản phẩm, tổng tiền, thời gian)</li>
  <li>Lọc đơn hàng theo ngày</li>
</ul>

Dashboard báo cáo:
<ul>
  <li>Xem doanh thu hôm nay</li>
  <li>Xem số đơn hàng hôm nay</li>
  <li>Xem 5 sản phẩm bán chạy nhất trong tháng</li>
  <li>Biểu đồ doanh thu theo ngày trong 7 ngày gần nhất</li>
</ul>


## Ngôn ngữ sử dụng
- Backend: node.js, express, prisma, MySQL
- Frontend: React(Vite) + Typescript, Tailwing CSS

## Hướng dẫn cài đặt

### Điều kiện tiên quyết

Node.js: Phiên bản 22.x trở lên.
MySQL: Đảm bảo các thông số trong file .env phải đúng với máy.

- npm
  ```sh
  npm install npm@latest -g
  ```
- prisma:
  ```sh
  npx prisma generate
  npx prisma migrate dev --name init
  npx prisma db seed
  ```


### Cài đặt
- Clone project
  ```sh
  git clone https://github.com/NoWhere0610/pos-web-app.git
  cd pos-web-app
  ```
- Di chuyển vào thư mục backend:
  ```sh
  cd backend
  ```
- Cài đặt dependencies:
  ```sh
  npm install
  ```
- Tạo file .env và cấu hình:
  ```sh
  PORT=5000
  DATABASE_URL="mysql://root:password_cua_ban@localhost:3306/pos_db"
  ```
- Đẩy cấu trúc bảng vào Database:
  ```sh
  npx prisma db push
  ```
- Chạy Server:
  ```sh
  npm run dev
  ```
- Mở terminal mới, di chuyển vào thư mục frontend:
  ```sh
  cd frontend
  ```
- Cài đặt dependencies:
  ```sh
  npm install
  ```
- Chạy ứng dụng:
  ```sh
  npm run dev
  ```
## Danh sách API Endpoints

- Cấu hình mặc định: http://localhost:5000/api
1. Products <br>
  GET <code>/products</code>: Lấy danh sách sản phẩm (có phân trang)
- Query params: <code>page</code>, <code>limit</code>, <code>search</code>
- Response mẫu:
  ```json
  {
    "data": [{ "id": 1, "name": "Classic Burger", "price": 5.99, "stock_quantity": 50 }],
    "totalPages": 5
  }
  ```
  GET <code>/products/:id</code>: Lấy chi tiết một sản phẩm theo ID (có phân trang)
- Response mẫu:
  ```json
  {
    "id": 1,
    "name": "Classic Burger",
    "sku": "B001",
    "price": 5.99,
    "stock_quantity": 50,
    "category": "Food",
    "created_at": "2026-05-07T13:30:00Z"
  }
  ```
  POST <code>/products</code>: Tạo sản phẩm mới
- Request body:
  ```json
  {
    "name": "Cheese Fries",
    "sku": "F002",
    "price": 3.50,
    "stock_quantity": 100,
    "category": "Sides"
  }
  ```
  - Response mẫu:
  ```json
  { "id": 2, "message": "Product created successfully" }
  ```
  PUT <code>/products/:id</code>: Cập nhật thông tin sản phẩm
- Request body:
  ```json
  {
    "name": "Cheese Fries",
    "sku": "F002",
    "price": 3.50,
    "stock_quantity": 100,
    "category": "Sides"
  }
  ```
- Response mẫu:
  ```json
  { "message": "Product updated successfully" }
  ```

  DELETE <code>/products/:id</code>: Xóa sản phẩm
- Response mẫu:
  ```json
  { "message": "Product deleted successfully" }
  ```
2. Orders <br>
  GET <code>/orders</code>: Lấy danh sách lịch sử đơn hàng (phân trang và lọc theo ngày)
- Query params: <code>page</code>, <code>date</code> (lọc theo ngày dạng YYYY-MM-DD)
- Response mẫu:
  ```json
  {
    "data": [
      { "id": 101, "total_amount": 15.50, "created_at": "2026-05-07T08:00:00Z" }
    ],
    "totalPages": 10
  }
  ```
  GET <code>/orders/:id</code>: Xem chi tiết một đơn hàng cụ thể
- Response mẫu:
  ```json
  {
    "id": 101,
    "total_amount": 15.50,
    "items": [
      { "product_name": "Classic Burger", "quantity": 2, "unit_price": 5.99 }
    ]
  }
  ```
  POST <code>/orders</code>: Tạo đơn hàng mới và cập nhật tồn kho
- Query params: <code>page</code>, <code>limit</code>, <code>search</code>
- Request body:
  ```json
  {
    "total_amount": 11.98,
    "tax_amount": 1.20,
    "paid_amount": 20.00,
    "change_amount": 6.82,
    "items": [
      { "product_id": 1, "quantity": 2, "unit_price": 5.99 }
    ]
  }
  ```
- Response mẫu:
  ```json
  { "id": 101, "message": "Order created successfully" }
  ```

3. Dashboard stats <br>
  GET <code>/dashboard-stats</code>: Lấy các số liệu thống kê tổng quan cho trang Dashboard
- Query params: <code>page</code>, <code>date</code> (lọc theo ngày dạng YYYY-MM-DD)
- Response mẫu:
  ```json
  {
    "todayRevenue": "252.22",
    "todayOrders": 7,
    "topProducts": [
      {
        "name": "Cola",
        "quantity": 31
      },
    ],
    "last7Days": [
      {
        "date": "1/5",
        "revenue": 0
      },
    ]
  }
  ```

## Ảnh chụp màn hình hệ thống
<p>Màn hình bán hàng</p>

![pos](images/pos.png)

<p>Màn hình lịch sử giao dịch</p>

![order](images/order.png)

<p>Màn hình dashboard báo cáo</p>

![dashboard1](images/dashboard1.png)
![dashboard2](images/dashboard2.png)

<p>Màn hình quản lý sản phẩm</p>

![product](images/product.png)

## Những điều sẽ cải thiện
- Làm file docker-compose.yml. Bị lỗi quá nhiều phần này nên bỏ qua
- Cải thiện trình độ code ngôn ngữ typescript, prisma. Bởi vì đây là lần đầu tiên em tiếp xúc với prisma cho nên code vẫn còn quá chậm, viết code thường viết phức tạp hơn cần thiết.
