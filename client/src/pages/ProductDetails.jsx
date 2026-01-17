
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import StarRating from "../components/StarRating";
import RelatedProducts from "../components/RelatedProducts";
import RecentlyViewed from "../components/RecentlyViewed";
import { useRecentlyViewed } from "../components/RecentlyViewed";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { currency, products, navigate, addToCart, axios, isInWishlist, toggleWishlist, user } = useAppContext();
  const { id } = useParams();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });

  // Review form state
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // 1️⃣ Find Product & Fetch Data
  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((item) => item._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setThumbnail(foundProduct.image?.[0] || null);
        addToRecentlyViewed(foundProduct);
        fetchReviews(foundProduct._id);
      }
    }
  }, [products, id]);

  // 2️⃣ Thumbnail set karna
  useEffect(() => {
    setThumbnail(product?.image?.[0] ? product.image[0] : null);
  }, [product]);

  const fetchReviews = async (productId) => {
    try {
      const { data } = await axios.get(`/api/review/product/${productId}`);
      if (data.success) {
        setReviews(data.data.reviews);
        setRatingStats(data.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch reviews");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to review");
      return;
    }
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const { data } = await axios.post("/api/review/add", {
        productId: product._id,
        rating: userRating,
        comment: reviewComment,
        title: "Product Review"
      });

      if (data.success) {
        toast.success("Review added successfully!");
        setReviewComment("");
        setUserRating(0);
        fetchReviews(product._id); // Refresh reviews
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!product) return <div className="mt-20 text-center">Loading...</div>;

  return (
    <div className="mt-16">
      {/* Breadcrumbs */}
      <p className="mb-6 text-sm text-gray-500">
        <Link to={"/"} className="hover:text-green-600">Home</Link> /
        <Link to={"/products"} className="hover:text-green-600"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-green-600"> {product.category}</Link> /
        <span className="text-gray-800 font-medium"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Gallery */}
        <div className="flex gap-4 md:w-1/2">
          <div className="flex flex-col gap-3">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`border rounded-lg overflow-hidden cursor-pointer w-16 h-16 md:w-20 md:h-20 ${thumbnail === image ? "border-green-600 ring-1 ring-green-600" : "border-gray-200 dark:border-gray-700"}`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white/50 dark:bg-gray-800/50 relative">
            <img src={thumbnail} alt={product.name} className="w-full h-full object-contain max-h-[500px]" />
            <button
              onClick={() => toggleWishlist(product._id)}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:scale-105 transition"
            >
              <svg
                className={`w-6 h-6 transition ${isInWishlist(product._id) ? "text-red-500 fill-red-500" : "text-gray-400 dark:text-gray-300 hover:text-red-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={ratingStats.averageRating} size="md" />
            <span className="text-sm text-gray-500 dark:text-gray-400">({ratingStats.totalReviews} reviews)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{currency}{product.offerPrice}</p>
            <p className="text-xl text-gray-400 line-through">{currency}{product.price}</p>
            <span className="text-green-600 font-medium px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded-lg text-sm">
              {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">(inclusive of all taxes)</p>

          <div className="mt-8">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">About Product</h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-600 dark:text-gray-300">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => addToCart(product._id)}
              className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => { addToCart(product._id); navigate('/cart'); }}
              className="flex-1 py-3.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-green-500/25"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🚚</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Fast Delivery</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🛡️</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Genuine Product</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">↩️</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-gray-200 dark:border-gray-700 pt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Ratings & Reviews</h2>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Reviews List */}
          <div className="flex-1 max-h-[500px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-200">
                        {review.userId?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{review.userId?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {review.isVerifiedPurchase && (
                        <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review */}
          <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl h-fit">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Write a Review</h3>
            <form onSubmit={submitReview}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Your Rating</label>
                <StarRating rating={userRating} size="lg" interactive onRate={setUserRating} />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white dark:bg-gray-700 dark:text-white"
                  rows="4"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product._id} category={product.category} />

      {/* Recently Viewed */}
      <RecentlyViewed />
    </div>
  );
};

export default ProductDetails;