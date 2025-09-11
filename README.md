🛍️ Street Style - Website Thời Trang

Dự án Street Style là một nền tảng thương mại điện tử chuyên về thời trang streetwear, bao gồm 3 phần chính:

Frontend (Khách hàng): Giao diện mua sắm, giỏ hàng, thanh toán.

Backend (API Server): Xử lý dữ liệu, thanh toán online, quản lý người dùng.

Admin (Trang quản trị): Quản lý sản phẩm, đơn hàng, khuyến mãi, thống kê.

⚙️ Công nghệ sử dụng

Frontend & Admin:

React 19 + Vite

TailwindCSS, Ant Design

React Router DOM

React Toastify, Framer Motion

Recharts, ApexCharts

Backend:

Node.js, Express

MongoDB (Mongoose)

Cloudinary (Upload ảnh)

VNPay (Cổng thanh toán online)

JWT (Xác thực người dùng)

Nodemailer (Gửi email)

🚀 Cài đặt dự án
1. Clone dự án
git clone https://github.com/tenuser/street-style.git
cd street-style

2. Backend

Cài đặt thư viện:

cd backend
npm install


Tạo file .env trong thư mục backend:

PORT=5000
MONGO_URI=mongodb://localhost:27017/streetstyle
JWT_SECRET=your_jwt_secret_key

# VNPay config
VNPAY_TMN_CODE=YOUR_VNPAY_CODE
VNPAY_HASH_SECRET=YOUR_VNPAY_SECRET
VNPAY_RETURN_URL=http://localhost:5173/payment-success

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email config
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password


Chạy backend:

npm run server


Backend mặc định chạy tại: http://localhost:5000

3. Frontend

Cài đặt thư viện:

cd ../frontend
npm install


Tạo file .env trong thư mục frontend:

VITE_API_URL=http://localhost:5000/api


Chạy frontend:

npm run dev


Frontend mặc định chạy tại: http://localhost:5173

4. Admin

Cài đặt thư viện:

cd ../admin
npm install


Tạo file .env trong thư mục admin:

VITE_API_URL=http://localhost:5000/api


Chạy admin:

npm run dev


Admin mặc định chạy tại: http://localhost:5174

📜 Các lệnh npm chính
Vị trí	Lệnh	Mô tả
Backend	npm run server	Chạy backend với nodemon
	npm start	Chạy backend chế độ production
Frontend	npm run dev	Chạy frontend chế độ development
	npm run build	Build frontend production
Admin	npm run dev	Chạy admin chế độ development
	npm run build	Build admin production
🌐 Quy trình làm việc với Git & GitHub
1. Clone dự án
git clone https://github.com/tenuser/street-style.git

2. Kiểm tra trạng thái code
git status
git branch

3. Tạo nhánh mới
git checkout -b feature/tinh-nang-moi

4. Commit & push code
git add .
git commit -m "Hoàn thành tính năng ABC"
git push -u origin feature/tinh-nang-moi

5. Tạo Pull Request trên GitHub

Vào GitHub → Chọn "Compare & pull request"

base: main (hoặc develop)

compare: feature/tinh-nang-moi

Viết mô tả chi tiết → Create Pull Request

6. Merge code

Sau khi được review, nhóm trưởng merge code vào nhánh chính.

7. Cập nhật code mới về máy
git checkout main
git pull origin main

8. Xóa nhánh cũ
git branch -d feature/tinh-nang-moi
git push origin --delete feature/tinh-nang-moi

🌐 Deploy dự án
Frontend & Admin

Build dự án:

npm run build


Deploy thư mục dist/ lên Vercel hoặc Netlify.

Backend

Deploy lên Render, Railway, hoặc VPS.

Cấu hình biến môi trường .env.

Chạy:

npm install
npm start

👥 Tác giả

Nguyễn Lê Hoài Hiếu - Fullstack Developer