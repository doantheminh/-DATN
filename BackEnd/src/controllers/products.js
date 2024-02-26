import Products from "../models/products.js";
import { productSchema } from "../Schemas/products.js";
import Category from "../models/category.js";
import Brand from "../models/brand.js";
import mongoose, { ObjectId } from "mongoose";
import Order from "../models/order.js";

export const getAll = async (req, res) => {
  const {
    _limit = 999,
    _sort = "createdAt",
    _order = "desc",
    _page = 1,
    startDate,
    endDate,
  } = req.query;

  const options = {
    limit: _limit,
    page: _page,
    sort: {
      [_sort]: _order === "desc" ? -1 : 1,
    },
    populate: ['categoryId', 'colorId', 'sizeId', 'brandId']
  };
  const filter = {};
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  try {
    const data = await Products.paginate(filter, options);
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

export const create = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    const products = await Products.create(req.body);

    await Category.findByIdAndUpdate(products.categoryId, {
      $addToSet: {
        products: products._id,
      },
    });
    await Brand.findByIdAndUpdate(products.brandId, {
      $addToSet: {
        products: products._id,
      },
    });
    if (products.length === 0) {
      return res.status(200).json({
        message: "Không thêm được sản phẩm",
      });
    }
    return res.json(products);
  } catch ({ errors }) {
    return res.status(500).json({
      message: errors,
    });
  }
};

const isProductInAnyOrder = async (product) => {

  const orderCount = await Order.countDocuments({ "products._id": product });
  return orderCount > 0;
};
export const remove = async (req, res) => {
  try {
    // Bước 1: Lấy thông tin sản phẩm
    const product = await Products.findById(req.params.id);

    // Kiểm tra xem sản phẩm có trong đơn hàng hay không

    const isProductInOrder = await isProductInAnyOrder(req.params.id);

    // Nếu sản phẩm có trong đơn hàng, không cho phép xóa
    if (isProductInOrder) {
      return res.status(403).json({
        message: "Không thể xóa sản phẩm vì nó có trong đơn hàng",
      });
    }

    // Bước 2: Xóa sản phẩm từ danh mục
    if (product && product.categoryId) {
      await Category.updateOne(
        { _id: product.categoryId },
        { $pull: { products: product._id } }
      );
    }
    if (product && product.brandId) {
      await Brand.updateOne(
        { _id: product.brandId },
        { $pull: { products: product._id } }
      );
    }
    // Bước 3: Xóa sản phẩm từ bảng sản phẩm
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);

    // Kiểm tra xem sản phẩm có tồn tại hay không
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm để xóa",
      });
    }

    // Bước 4: Trả về kết quả thành công
    return res.status(200).json({
      message: "Xóa sản phẩm và cập nhật ở các mục thành công",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi xóa sản phẩm",
    });
  }
};
export const getById = async (req, res) => {
  try {
    const products = await Products.findById(req.params.id).populate(['categoryId', 'comments', 'colorId', 'brandId', 'sizeId']);
    // 'comments','colorId','brandId','sizeId',
    if (products.length === 0) {
      return res.status(200).json({
        message: "Không có dữ liệu",
      });
    }
    return res.json(products);

  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const update = async (req, res) => {
  try {
    const products = await Products.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (products.length === 0) {
      return res.status(200).json({
        message: "Cập nhật sản phẩm không thành công",
      });
    }
    return res.json(products);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getQuanlityProduct = async (req, res) => {
  const {
    _limit = 8,
    _sort = "createAt",
    _order = "asc",
    _page = 1,
    category = "", // Thêm tham số category để lọc theo danh mục sản phẩm
  } = req.query;

  const options = {
    limit: _limit,
    page: _page,
    sort: {
      [_sort]: _order === "desc" ? -1 : 1,
    },
  };

  // Tạo một mảng pipeline để định nghĩa các giai đoạn aggregation
  const pipeline = [];

  // Giai đoạn $match để lọc sản phẩm theo danh mục (nếu được cung cấp)
  if (category) {
    pipeline.push({
      $match: { category: category },
    });
  }

  // Giai đoạn $group để thống kê số sản phẩm
  pipeline.push({
    $group: {
      _id: null,
      total: { $sum: 1 },
    },
  });

  try {
    const data = await Products.aggregate(pipeline, options);
    if (data.length === 0) {
      return res.status(200).json({
        message: "Không có dữ liệu",
      });
    }
    return res.json(data[0]); // Trả về kết quả thống kê (total)
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export const updateInStock = async (req, res) => {

  try {
    const { value } = req.body;

    const newValue = await Products.findByIdAndUpdate({ _id: req.params.id }, { $inc: { inStock: -value } })

    return res.status(201).json(newValue)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

export const getTopProducts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: 4 } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products._id',
          name: { $first: '$products.name' },
          quantity: { $sum: '$products.quantity' },
          price: { $first: '$products.price' },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ]);

    const topProducts = await Products.populate(result, { path: '_id' });

    res.json({ success: true, data: topProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
