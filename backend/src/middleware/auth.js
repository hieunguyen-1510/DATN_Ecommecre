import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Không có token. Vui lòng đăng nhập lại!" });
        }

        const token = authHeader.split(" ")[1]; 
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Thêm thông tin user vào req.user
            req.user = {
                _id: decoded.userId || decoded.id,
                id: decoded.userId || decoded.id, 
                role: decoded.role,
                name: decoded.name
            };
            next();
        } catch (error) {
            console.error("Lỗi xác thực token:", error.message);
            return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại!" });
        }
    } catch (error) {
        console.error("Lỗi middleware authUser:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi xác thực!" });
    }
};

export default authUser;
