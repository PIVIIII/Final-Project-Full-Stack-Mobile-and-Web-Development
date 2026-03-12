import Review from '../models/Review.js';

export const createOrUpdateReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;

    let review = await Review.findOne({ user_id, product_id });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();

      return res.json(review);
    }

    review = new Review({
      user_id,
      product_id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const replyReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { sellerReply: reply },
      { new: true },
    );

    res.json(review);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      product_id: req.params.productId,
    })
      .populate('user_id', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({
      product_id: req.params.productId,
    });

    res.json({
      data: reviews,
      metadata: {
        totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUserReview = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const review = await Review.findOne({
      user_id: userId,
      product_id: productId,
    });

    res.json(review);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getReviewsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const reviews = await Review.find()
      .populate({
        path: 'product_id',
        match: { seller_id: sellerId },
        select: 'name images',
      })
      .populate('user_id', 'username')
      .sort({ createdAt: -1 });

    const filteredReviews = reviews.filter((r) => r.product_id !== null);

    res.json(filteredReviews);
  } catch (err) {
    res.status(500).json(err);
  }
};
