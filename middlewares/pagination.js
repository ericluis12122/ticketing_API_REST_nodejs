export default function pagination(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const output = {};

        try {
            output.total = await model.countDocuments().exec();
            output.result = await model
                    .find(req.filter)
                    .skip(skip)
                    .limit(pageSize)
                    .exec();
            output.pages = Math.ceil(output.total / pageSize);
            output.currentPage = page;
            req.paginationResults = output;
            next();
        } catch (error) {
            res.status(500).json({message: 'Server error ' + error.message});
        }
    }
}