import Size from "../models/size.js";
import joi from "joi";
const sizeSchema = joi.object({
    name: joi.string()
    .required("name là trường dữ liệu bắt buộc")
    .custom((value, helpers) => {
      const uppercaseValue = value.toUpperCase();
      if (value !== uppercaseValue) {
        return helpers.message('Tên phải viết hoa hết');
      }
      return value;
    }),
    active:joi.boolean()
  });

export const create = async(req,res)=>{
    try {
        const {error} = sizeSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details.map((err)=> err.message)
            });
        }
        const data = await Size.create(req.body)
        if (data.length === 0) {
            return res.status(201).json({
                message: "không thêm được size"
            });
        }
        return res.json(data)
        
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}


export const getAll = async (req, res) => {
    const {
        _limit = 999,
        _sort = "createAt",
        _order = "asc",
        _page = 1,
      } = req.query;
    
      const options = {
        limit: _limit,
        page: _page,
        sort: {
          [_sort]: _order === "desc" ? -1 : 1,
        },
      };
    try {
        const data = await Size.paginate({}, options)
        if (data.length === 0) {
            return res.status(201).json({
                message: "Không có dữ liệu"
            });
        }
        return res.json(data)
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}


export const getById = async(req, res) =>{
    try {
        const data = await Size.findById(req.params.id).populate("products");
        if (data.length === 0) {
            return res.status(201).json({
                message: "Không có dữ liệu"
            });
        }
        return res.json(data) 
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}


export const updata = async (req, res) => {
    try {
        const data = await Size.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (data.length === 0) {
            return res.status(201).json({
                message: "Cập nhập size không thành công",
            });
        }
        return res.json(data)
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}


export const remove = async (req, res) => {
    try {
        const data = await Size.findByIdAndDelete({ _id: req.params.id });
        if (data.length === 0) {
            return res.status(201).json({
                message: "Xóa thành công",
            });
        }
        return res.json({
            message: "Xóa thành công"
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message
        })
    }
}