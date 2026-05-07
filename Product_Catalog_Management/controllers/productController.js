const Product = require("../models/Product");

exports.createProduct = async (req, res) => {

    try {

        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {

        res.status(500).json(error);
    }
};

exports.getProducts = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const search = req.query.search || "";

        const category = req.query.category || "";

        const products = await Product.aggregate([
            {
                $match: {
                    name: {
                        $regex: search,
                        $options: "i"
                    },

                    category: {
                        $regex: category,
                        $options: "i"
                    }
                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            },

            {
                $skip: skip
            },

            {
                $limit: limit
            }
        ]);

        const total = await Product.countDocuments();

        res.json({
            total,
            page,
            limit,
            products
        });

    } catch (error) {

        res.status(500).json(error);
    }
};

exports.updateProduct = async (req, res) => {

    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(product);

    } catch (error) {

        res.status(500).json(error);
    }
};

exports.deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted"
        });

    } catch (error) {

        res.status(500).json(error);
    }
};