import jwt from "jsonwebtoken";
import Auth from "../models/auth.js";

export const checkPermission = async (req, res, next) => {
  try {
    // B1: Kiểm tra đã đăng nhập chưa
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập 😑" });
    }

    // B2: Token gửi lên có hợp lệ không?
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "123456");

    // B3: Dựa vào thông tin gửi lên, kiểm tra xem id có quyền không
    const user = await Auth.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại 😑" });
    }

    if (user.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập 😑" });
    }

    // Gán thông tin người dùng vào req.user và tiếp tục xử lý
    req.user = user;
    next();
  } catch (error) {

    if (error instanceof jwt.JsonWebTokenError) {
      // Xử lý lỗi Token không hợp lệ
      return res.status(401).json({ message: "Token không hợp lệ 😑" });
    } else {
      // Xử lý các lỗi khác
      console.error(error);
      return res.status(500).json({ message: "Có lỗi xảy ra trong quá trình xác thực 😑" });
    }
  }
};
