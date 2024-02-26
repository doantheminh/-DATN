import Auth from "../models/auth.js";
import bcryptjs from 'bcryptjs';
import Discount from "../models/discount.js";
export const update = async (req, res) => {

    try {

        const { role } = req.body;

        const user = await Auth.findByIdAndUpdate({ _id: req.params.id }, { role }, { new: true })

        // if (!user) {
        //     return res.status(401).json({ message: 'Unauthorized' })
        // }

        // const newUser = await user.save({ role })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
};

export const avatar = async (req, res) => {
    try {

        const { avatar } = req.body;

        const user = await Auth.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        await Auth.findByIdAndUpdate({ _id: user._id }, { avatar }, {
            new: true,
        });

        return res.status(200).json({ success: true })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const remove = async (req, res) => {

    try {
        const data = await Auth.findByIdAndDelete({ _id: req.params.id }, {
            new: true,
        });
        return res.status(200).json({
            message: "xoa USer thanh cong",
            data,
        });
    } catch (error) {
        return res.status(404).json({
            message: error,
        });
    }
};


export const getOne = async (req, res) => {
    try {

        const data = await Auth.findById(req.params.id).populate("discountCodes");
        if (data.length === 0) {
            return res.status(200).json({
                message: "Không có dữ liệu",
            });
        }
        return res.status(200).json({
            message: "Danh sách one",
            data,
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });

    }
}

export const getAll = async (req, res) => {
    const {
        // _limit = 7,
        _sort = "createAt",
        _order = "asc",
        _page = 1,
        startDate,
        endDate,
    } = req.query;

    const options = {
        // limit: _limit,
        page: _page,
        sort: {
            [_sort]: _order === "desc" ? -1 : 1,
        },
    };
    const filter = {};
    if (startDate && endDate) {
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    try {
        const data = await Auth.paginate(filter, options);
        if (data.length === 0) {
            return res.status(200).json({
                message: "Không có dữ liệu",
            });
        }
        return res.json(data);
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
};
export const addDiscountCodeToUser = async (req, res) => {
    try {
      const { userId, discountId } = req.params;
  
      // Kiểm tra xem userId và discountId có hợp lệ không
      if (!userId || !discountId) {
        return res.status(400).json({ error: "Invalid userId or discountId" });
      }
  
      // Kiểm tra xem user có tồn tại không
      const user = await Auth.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Kiểm tra xem discount có tồn tại không
      const discount = await Discount.findById(discountId);
      if (!discount) {
        return res.status(404).json({ error: "Discount not found" });
      }
  
      // Kiểm tra xem user.discountCodes có tồn tại không
      if (!user.discountCodes) {
        user.discountCodes = [];
      }
  
      // Kiểm tra xem mã giảm giá đã được thêm vào user chưa
      if (user.discountCodes.includes(discountId)) {
        return res.status(400).json({ error: "Discount code already added to user" });
      }
  
      // Thêm mã giảm giá vào danh sách của user và lưu lại
      user.discountCodes.push(discountId);
      await user.save();
  
      res.status(200).json({ message: "Discount code added to user successfully" });
    } catch (error) {
      console.error("Error adding discount code to user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

export const removeDiscountCodeFromUser = async (req, res) => {
  try {
    const { userId, discountId } = req.params;

    // Kiểm tra xem userId và discountId có hợp lệ không
    if (!userId || !discountId) {
      return res.status(400).json({ error: "Invalid userId or discountId" });
    }

    // Kiểm tra xem user có tồn tại không
    const user = await Auth.findById(userId);
    console.log(discountId)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Kiểm tra xem user.discountCodes có tồn tại không
    if (!user.discountCodes) {
      user.discountCodes = [];
    }
    // Kiểm tra xem mã giảm giá có tồn tại trong danh sách của user không
    if (!user.discountCodes.includes(discountId)) {
      return res.status(400).json({ error: "Discount code not found in user's list" });
    }
    // Xóa mã giảm giá khỏi danh sách của user và lưu lại
    user.discountCodes = user.discountCodes.filter(code => code.toString() !== discountId);
    console.log(user.discountCodes)
    await user.save();
    res.status(200).json({ message: "Discount code removed from user successfully" });
  } catch (error) {
    console.error("Error removing discount code from user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
