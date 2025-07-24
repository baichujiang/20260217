export interface Review {
    restaurant_id: number;
    normal_rating: number;
    food_rating: number;
    service_rating: number;
    environment_rating: number;
    sustainability_rating: number;
    sourcing_rating: number;
    waste_rating: number;
    menu_rating: number;
    energy_rating: number;
    comment: string;
    tag_ids: number[];
}

export interface ReviewFormProps {
    restaurant_id: number;
    restaurant_name: string;
    tags: Tag[];
}

export interface Tag {
    id: number;
    name: string;
    category: string;
}

export interface ReviewImage {
  id: string;
  url: string;
  uploaded_at: string;
}

export interface Comment {
  review_id: string;
  user_name: string;
  comment: string;
  created_at: string;
  normal_rating: number;
  sustainability_rating: number;
  images: ReviewImage[];
  avatar_url: string;
}