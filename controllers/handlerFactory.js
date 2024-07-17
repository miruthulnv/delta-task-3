import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const getAll = Model => async (req,res)=>{
    const features = new ApiFeatures(Model.find(),req.query);
    features.filter().sort().limit().page();
    // Execute query
    const doc = await features.query.find();
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: doc
    });
}

export const getOne = Model => async(req,res,next) =>{
    const id = req.params.id;
    const doc = await Model.find({_id: id});
    if(!doc) return next(new AppError('No document found with that id',404));
    res.status(200).json({
      status:'success',
      data: doc,
    })
}

export const createOne = Model => catchAsync( async(req,res,next)=>{
   const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: doc,
    })
});

export const deleteOne = Model => catchAsync( async(req,res,next)=>{
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete({_id: id});
    if(!doc) return next(new AppError('No document found with that id',404));
    res.status(204).json({
        status:'success',
        data: doc,
    });
})

export const updateOne = Model => catchAsync( async(req,res,next)=>{
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete({_id: id});
    if(!doc) return next(new AppError('No document found with that id',404));
    req.body.password = undefined;
    res.status(201).json({
        status:'success',
        data: doc,
    });
})