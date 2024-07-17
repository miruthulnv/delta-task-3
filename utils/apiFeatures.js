export default class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        this.queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete this.queryObj[el]);
        this.queryObj = JSON.parse(
            JSON.stringify(this.queryObj).replace(
                /\b(gte|gt|lte|lt)\b/g,
                (match) => `$${match}`,
            ),
        );
        this.query.find(this.queryObj);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query.sort(sortBy);
        } else {
            this.query.sort('-createdAt'); // default sorting in createdAt descending.
        }
        return this;
    }

    limit() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        } else {
            this.query.select('-__v'); //Default.. exclude __v.
        }
        return this;
    }

    page() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = limit * (page - 1);
        console.log(page, limit, skip);
        this.query.skip(skip).limit(limit);
        return this;
    }
}