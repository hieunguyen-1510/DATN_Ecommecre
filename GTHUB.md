# 📘 SỬ DỤNG GIT & GITHUB CƠ BẢN

## 🧠 1. Git và GitHub là gì?

- **Git**: Công cụ quản lý phiên bản mã nguồn cục bộ.
- **GitHub**: Nơi lưu trữ mã nguồn online, hỗ trợ làm việc nhóm và cộng tác.

---

## 🚀 2. Khởi tạo Git và kết nối với GitHub

```bash
git init
git remote add origin https://github.com/tenuser/tenduan.git

📥 3. Clone dự án từ GitHub về máy
git clone https://github.com/tenuser/tenduan.git

🔎 4. Kiểm tra trạng thái và nhánh
git status         # Xem trạng thái file thay đổi
git branch         # Xem các nhánh local
git branch -a      # Xem cả nhánh local và remote

🌿 5. Tạo và chuyển nhánh
git checkout -b ten-nhanh-moi    # Tạo và chuyển tới nhánh mới
git checkout ten-nhanh-cu        # Chuyển về nhánh cũ

💾 6. Lưu và đẩy thay đổi lên GitHub
git add .           # Thêm tất cả file
git add index.html  # Hoặc 1 file cụ thể

🔄 7. Kéo code từ GitHub về
git pull origin ten-nhanh

🔀 8. Gộp nhánh
git checkout main
git merge ten-nhanh


🧹 9. Xoá nhánh

git branch -d ten-nhanh                   # Xoá nhánh local
git push origin --delete ten-nhanh       # Xoá nhánh trên GitHub

🧭 CÁCH TẠO PULL REQUEST TRÊN GITHUB

✅ Bước 1: Push code của bạn lên GitHub

git push -u origin feature/ten-tinh-nang

✅ Bước 2: Vào repo trên GitHub
GitHub sẽ hiện thông báo:

"Compare & pull request" → Bấm vào đó
(nếu không thấy thì bạn vào tab "Pull Requests" và chọn "New Pull Request")


base: nhánh bạn muốn merge vào (main, develop, ...)

compare: nhánh bạn đang làm việc (feature/login, bugfix/abc, ...)

Viết tiêu đề & mô tả ngắn cho PR (ví dụ):

✅ Thêm tính năng đăng nhập
- Tạo form đăng nhập
- Kiểm tra token hợp lệ
Bấm Create pull request.

🧪 (Tuỳ chọn) Bước 3: Người khác review & merge

Người review có thể comment, yêu cầu sửa đổi, hoặc chấp nhận.

Sau khi ổn, bạn hoặc người có quyền sẽ bấm Merge pull request.

GitHub sẽ hợp nhất toàn bộ commit vào nhánh chính.

💡 Sau khi merge, bạn nên:

git checkout main
git pull origin main      # Lấy bản mới đã được merge
git branch -d feature/ten-nhanh  # Xoá nhánh cũ local
git push origin --delete feature/ten-nhanh  # Xoá nhánh trên GitHub (nếu cần)

📌 Tóm tắt nhanh quy trình:

# Tạo nhánh làm việc mới
git checkout -b feature/abc
# Làm việc, sau đó:
git add .
git commit -m "Hoàn thành tính năng ABC"
git push -u origin feature/abc
# Vào GitHub → Tạo Pull Request → Merge
# Sau đó:
git checkout main
git pull origin main
git branch -d feature/abc
git push origin --delete feature/abc








```
