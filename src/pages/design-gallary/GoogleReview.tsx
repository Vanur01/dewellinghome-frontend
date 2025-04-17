import { Star } from 'lucide-react';

interface GoogleReviewItem {
  id: number;
  screenshot: string;
  customerName: string;
  rating: number;
  reviewText: string;
  date: string;
}

const reviewData: GoogleReviewItem[] = [
  {
    id: 1,
    screenshot: '/images/reviews/review1.jpg',
    customerName: 'Sarah Johnson',
    rating: 5,
    reviewText: 'Amazing interior design service! They transformed our space completely.',
    date: '2 weeks ago'
  },
  {
    id: 2,
    screenshot: '/images/reviews/review2.jpg',
    customerName: 'Michael Chen',
    rating: 5,
    reviewText: 'Professional team and excellent attention to detail. Highly recommended!',
    date: '1 month ago'
  },
  {
    id: 3,
    screenshot: '/images/reviews/review3.jpg',
    customerName: 'Emily Williams',
    rating: 5,
    reviewText: 'The designs were exactly what we wanted. Great communication throughout.',
    date: '1 month ago'
  },
  // Add more reviews as needed
];

const GoogleReview = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            What Our Clients Say About Us
          </h2>
          <p className="text-lg text-gray-600">
            Real reviews from our satisfied customers on Google
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewData.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Screenshot Container */}
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={review.screenshot}
                  alt={`Google review by ${review.customerName}`}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Review Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.customerName}
                  </h3>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center mb-3">
                  {[...Array(review.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="w-5 h-5 fill-current text-yellow-400"
                      fill="currentColor"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{review.reviewText}"
                </p>

                {/* Google Logo */}
                <div className="mt-4 flex items-center">
                  <img
                    src="/images/google-logo.png"
                    alt="Google"
                    className="h-6 w-auto"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    Posted on Google
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <a
            href="https://www.google.com/business"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-300"
          >
            View More Reviews on Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoogleReview;