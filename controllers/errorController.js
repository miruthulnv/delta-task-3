//Global error handling
const handleCastError = (err)=>{
    err.isOperational = true;
    err.message = `Invalid ${err.path} : ${err.value}`;
    return err;
}

const handleDuplicateError = (err)=>{
    err.isOperational = true;
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    err.message = `Duplicate field error for ${value}. Please give another value`;
    return err;
}

const handleValidationError = (err)=>{
    err.isOperational = true;
    const errors = Object.values(err.errors).map(el => el.message);
    err.message = `Invalid input data. ${errors.join('.\n')}`;
    return err;
}

const handleJWTError = (err)=>{
    err.isOperational = true;
    err.message = 'Invalid token. Please login again';
    err.statusCode=401;
    return err;
}

const handleJWTExpiredError = (err) => {
    err.isOperational = true;
    err.message = 'Your token has expired. Please login again';
    err.statusCode = 401;
    return err;
}
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 400;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errror: err,
            stack: err.stack,
        });
    }
    if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastError(err);
        else if (err.name === 'MongoError') err = handleDuplicateError(err);
        else if (err.name === 'ValidationError') err = handleValidationError(err);
        else if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
        else if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!!!',
            })
        }
    }
}



