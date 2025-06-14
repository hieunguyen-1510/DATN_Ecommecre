import ClearanceGroup from "../models/clearanceGroupModel.js";
import Product from "../models/productModel.js"

export const getAllClearanceGroups = async (req, res) => {
    try {
        const groups = await ClearanceGroup.find({});
        res.status(200).json({
            success: true,
            data: groups,
            message: "Lấy danh sách nhóm xả kho thành công."
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm xả kho:", error);
        res.status(500).json({success: false, message: error.message});   
    }
}

export const createClearanceGroup = async (req, res) => {
    try {
    const {name, discountType, value, conditions, autoApply = true} = req.body;
    console.log("Log body for create:", req.body);

    // Kiểm tra dữ liệu đầu vào
    if (!name || !discountType || value === undefined) {
        return res.status(400).json({ success: false, message: "Missing required fields: name, discountType, value." });
    }
    const group = await ClearanceGroup.create({
      name,
      discountType,
      value,
      conditions,
      autoApply,
    });

    // Áp dụng giảm giá
    const query = {
        ...(conditions.createdBefore && {createdAt : {$lte: new Date(conditions.createdBefore)}}),
        ...(conditions.soldCountBelow !== undefined && {soldCount: {$lt: conditions.soldCountBelow}}),
    };

    const products = await Product.find(query);

    const bulkUpdates = products.map((product) => {
        let finalPrice = product.price;
        if (discountType === "percentage") {
            finalPrice = product.price * (1 - value / 100);
        } else {
            finalPrice = product.price - value;
        }

        return {
            updateOne: {
                filter: {_id: product._id},
                update: {
                    isClearance: true,
                    discountPercentage: discountType === "percentage" ? value: null,
                    discountAmount: discountType === "fixed_amount" ? value: null,
                    discountCode: group._id.toString(),
                    finalPrice: finalPrice > 0 ? finalPrice: 0,
                    clearanceGroup: group._id
                },
            }, 
        };
    });

    if (bulkUpdates.length > 0) {
        await Product.bulkWrite(bulkUpdates);
    }

    res.status(200).json({
        success: true,
        data: group,
        affectedProducts: products.length,
        message: `Tạo nhóm xả kho và áp dụng cho ${products.length} sản phẩm.`
    })

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const applyClearanceGroup = async (req, res) => {
    try {
        const {productIds} = req.body;
        const {groupId} = req.params;

        if (!productIds || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Danh sách sản phẩm rỗng."
            });
        }

        const group = await ClearanceGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhóm xả kho."
            });
        }

        const {discountType, value} = group;

        const products = await Product.find({_id: {$in: productIds}});

        const bulkUpdates = products.map((product) => {
            let finalPrice = product.price;

            if (discountType === "percentage") {
            finalPrice = product.price * (1 - value / 100);
            } else {
            finalPrice = product.price - value;
            }

            return {
            updateOne: {
                filter: {_id: product._id},
                update: {
                    isClearance: true,
                    discountPercentage: discountType === "percentage" ? value: null,
                    discountAmount: discountType === "fixed_amount" ? value: null,
                    discountCode: group._id,
                    finalPrice: finalPrice > 0 ? finalPrice: 0,
                    clearanceGroup: group._id
                },
            }, 
        };
    });

    await Product.bulkWrite(bulkUpdates);
    res.status(200).json({
        success: true,
        message: `Áp dụng thành công nhóm "${group.name}" cho ${products.length} sản phẩm.`
    })
    } catch (error) {
        console.error("Lỗi khi áp dụng nhóm xả kho:", error);
        res.status(500).json({success: false, message: error.message});
    }
}