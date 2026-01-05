import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorshipRequest' // Only verified reviews from sessions
    }
}, {
    timestamps: true
});

// Calculate average rating after save
reviewSchema.statics.getAverageRating = async function (mentorId) {
    const stats = await this.aggregate([
        { $match: { mentor: mentorId } },
        {
            $group: {
                _id: '$mentor',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('User').findByIdAndUpdate(mentorId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            numReviews: stats[0].numReviews
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.mentor);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
