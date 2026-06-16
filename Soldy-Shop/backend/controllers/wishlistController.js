const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc    Get current user's wishlist count
// @route   GET /api/wishlist/count
// @access  Private
const getWishlistCount = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .select('products');

  if (!wishlist) {
    return res.status(200).json({ success: true, count: 0 });
  }

  const count = wishlist.products ? wishlist.products.length : 0;
  return res.status(200).json({ success: true, count });
});

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('products');

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      wishlist: {
        _id: null,
        user: req.user._id,
        products: [],
      },
    });
  }

  return res.status(200).json({ success: true, wishlist });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();
  }

  const populated = await Wishlist.findById(wishlist._id).populate('products');
  return res.status(201).json({ success: true, wishlist: populated });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      wishlist: { _id: null, user: req.user._id, products: [] },
    });
  }

  wishlist.products = wishlist.products.filter((id) => String(id) !== String(productId));
  await wishlist.save();

  const populated = await Wishlist.findById(wishlist._id).populate('products');
  return res.status(200).json({ success: true, wishlist: populated });
});

module.exports = {
  getWishlistCount,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
