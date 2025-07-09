import os
from fastapi import Request

from .schemas import ReviewRead, ReviewTagRead, ReviewImageRead
from .models import Review, ReviewImage


def build_image_response(image: ReviewImage, request: Request):
    filename = os.path.basename(image.file_path)
    url = str(request.url_for("review-images", path=filename))
    return {
        "id": image.id,
        "url": url,
        "uploaded_at": image.uploaded_at,
    }


def map_review_to_reviewread_schema(review: Review, request: Request) -> ReviewRead:
    return ReviewRead(
        id=review.id,
        user_id=review.user_id,
        restaurant_id=review.restaurant_id,
        created_at=review.created_at,
        normal_rating=review.normal_rating,
        food_rating=review.food_rating,
        service_rating=review.service_rating,
        environment_rating=review.environment_rating,
        sustainablility_rating=review.sustainablility_rating,
        sourcing_rating=review.sourcing_rating,
        waste_rating=review.waste_rating,
        menu_rating=review.menu_rating,
        energy_rating=review.energy_rating,
        comment=review.comment,
        tags=[ReviewTagRead.model_validate(tag) for tag in review.tags],
        images=[ReviewImageRead(**build_image_response(img, request)) for img in review.images],
    )
