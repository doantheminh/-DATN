import Order from '../models/order.js';
import Product from '../models/products.js';
import moment from 'moment';
export const getTopSellingProducts = async (req, res) => {
  try {
    const statusValue = 4;
    // Lọc đơn hàng theo trạng thái
    const orders = await Order.find({ status: statusValue })
      .populate('products._id', 'name price quantity');
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        message: "Không có dữ liệu đơn hàng",
      });
    }
    // Sử dụng đối tượng để theo dõi tổng quantity của từng sản phẩm
    const productQuantityMap = {};
    orders.forEach(order => {
      if (order.products && order.products.length > 0) {
        order.products.forEach(product => {
          const productId = product._id.toString();

          if (productQuantityMap[productId]) {
            // Nếu sản phẩm đã tồn tại trong đối tượng, cộng thêm quantity
            productQuantityMap[productId].quantity += product.quantity;
          } else {
            // Nếu sản phẩm chưa tồn tại trong đối tượng, thêm mới
            productQuantityMap[productId] = {
              ...product,
              quantity: product.quantity,
              createdAt: moment(product.createdAt).format('MM/DD/YYYY HH:mm:ss'),
              updatedAt: moment(product.updatedAt).format('MM/DD/YYYY HH:mm:ss'),
            };
          }
        });
      }
    });
    // Chuyển đối tượng thành mảng để sắp xếp
    const allProducts = Object.values(productQuantityMap);
    // Sắp xếp mảng sản phẩm theo tổng số lượng bán được giảm dần
    allProducts.sort((a, b) => b.quantity - a.quantity);
    // Trả về tất cả sản phẩm
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
// top10 sản phẩm bán chạy trong tuần 
export const getTopSellingProductsWeek = async (req, res) => {
  try {
    // Lấy ngày bắt đầu của tuần hiện tại
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const statusValue = 4;

    // Lấy tất cả đơn hàng từ đầu tuần đến hiện tại
    const orders = await Order.find({ createdAt: { $gte: startOfWeek }, status: statusValue });

    // Kiểm tra xem có đơn hàng không
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        message: "Không có dữ liệu đơn hàng",
      });
    }

    // Tạo một đối tượng để theo dõi tổng số lượng bán của từng sản phẩm
    const productQuantityMap = {};

    // Lặp qua từng đơn hàng và cộng dồn số lượng bán của từng sản phẩm
    orders.forEach(order => {
      if (order.products && order.products.length > 0) {
        order.products.forEach(product => {
          const productId = product._id.toString();
          const quantity = product.quantity;

          if (productQuantityMap[productId]) {
            productQuantityMap[productId] += quantity;
          } else {
            productQuantityMap[productId] = quantity;
          }
        });
      }
    });

    // Chuyển đối tượng thành mảng để sử dụng sort
    const topProductsWeek = Object.keys(productQuantityMap).map(productId => ({
      _id: productId,
      quantity: productQuantityMap[productId],
    }));

    // Sắp xếp mảng theo tổng số lượng bán giảm dần
    topProductsWeek.sort((a, b) => b.quantity - a.quantity);

    // Lấy top 10 sản phẩm
    const top10Products = topProductsWeek.slice(0, 10);

    // Lấy thông tin chi tiết của các sản phẩm
    const detailedProducts = await Product.find({ _id: { $in: top10Products.map(product => product._id) } });

    // Kết hợp thông tin chi tiết vào kết quả cuối cùng
    const result = top10Products.map(product => ({
      ...product,
      productInfo: detailedProducts.find(detailedProduct => detailedProduct._id.toString() === product._id),
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const getTopSellingProductsMonth = async (req, res) => {
  try {
    // Lấy ngày đầu tiên của tháng hiện tại
    const startOfMonth = new Date();
    startOfMonth.setHours(0, 0, 0, 0);
    startOfMonth.setDate(1);
    const statusValue = 4;

    // Lấy tất cả đơn hàng từ đầu tháng đến hiện tại
    const orders = await Order.find({ createdAt: { $gte: startOfMonth }, status: statusValue });

    // Kiểm tra xem có đơn hàng không
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        message: "Không có dữ liệu đơn hàng",
      });
    }

    // Tạo một đối tượng để theo dõi tổng số lượng bán của từng sản phẩm
    const productQuantityMap = {};

    // Lặp qua từng đơn hàng và cộng dồn số lượng bán của từng sản phẩm
    orders.forEach(order => {
      if (order.products && order.products.length > 0) {
        order.products.forEach(product => {
          const productId = product._id.toString();
          const quantity = product.quantity;

          if (productQuantityMap[productId]) {
            productQuantityMap[productId] += quantity;
          } else {
            productQuantityMap[productId] = quantity;
          }
        });
      }
    });

    // Chuyển đối tượng thành mảng để sử dụng sort
    const topProductsMonth = Object.keys(productQuantityMap).map(productId => ({
      _id: productId,
      quantity: productQuantityMap[productId],
    }));

    // Sắp xếp mảng theo tổng số lượng bán giảm dần
    topProductsMonth.sort((a, b) => b.quantity - a.quantity);

    // Lấy top 10 sản phẩm
    const top10Products = topProductsMonth.slice(0, 10);

    // Lấy thông tin chi tiết của các sản phẩm
    const detailedProducts = await Product.find({ _id: { $in: top10Products.map(product => product._id) } });

    // Kết hợp thông tin chi tiết vào kết quả cuối cùng
    const result = top10Products.map(product => ({
      ...product,
      productInfo: detailedProducts.find(detailedProduct => detailedProduct._id.toString() === product._id),
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
