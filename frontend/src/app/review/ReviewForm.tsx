'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Star, X } from "lucide-react"
import clsx from "clsx"
import { toast } from "sonner"
import { Review, ReviewFormProps, Tag } from "@/types/review"

const categories = ["General", "Food", "Service", "Environment", "Sourcing", "Waste", "Menu", "Energy"]
import { getApiBaseUrl } from "@/lib/apiBaseUrl";


export default function ReviewForm({ 
    restaurant_id,
    restaurant_name,
    tags
}: ReviewFormProps) {
  const router = useRouter();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [experience, setExperience] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast("Please select image files only.");
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast("Please select images smaller than 10MB.");
        continue;
      }

      // Add valid file
      setSelectedImages(prev => [...prev, file]);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }

    // Reset input value to allow selecting the same file again
    event.target.value = '';
};

const removeImage = (index: number) => {
  setSelectedImages(prev => prev.filter((_, i) => i !== index));
  setImagePreviews(prev => prev.filter((_, i) => i !== index));
};

const handleRating = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
};

const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
        prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
};

const handleSubmit = async () => {
  for (const category of categories) {
    if (!ratings[category] || ratings[category] < 1) {
      toast(`Please provide a rating for ${category}`);
      return;
    }
  }

  setIsSubmitting(true);

  const token = localStorage.getItem("token");
  const formData = new FormData();

  // Append all rating fields
  formData.append("normal_rating", String(ratings["General"] || 0));
  formData.append("food_rating", String(ratings["Food"] || 0));
  formData.append("service_rating", String(ratings["Service"] || 0));
  formData.append("environment_rating", String(ratings["Environment"] || 0));
  formData.append("sustainability_rating", String(ratings["Sustainability"] || 0));
  formData.append("sourcing_rating", String(ratings["Sourcing"] || 0));
  formData.append("waste_rating", String(ratings["Waste"] || 0));
  formData.append("menu_rating", String(ratings["Menu"] || 0));
  formData.append("energy_rating", String(ratings["Energy"] || 0));

  formData.append("comment", experience);
  formData.append("restaurant_id", String(restaurant_id));
  formData.append("tag_ids", JSON.stringify(selectedTags)); // Send as JSON string

  selectedImages.forEach((image) => {
    formData.append("files", image);
  });

  try {
    const res = await fetch(`${getApiBaseUrl()}/reviews/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to submit review");
    }

    const data = await res.json();

    toast("Review submitted successfully", {
          description: "You've got 3 new points — time to give your tree some love!",
          action: {
            label: "Go",
            onClick: () => router.push("/tree"),
          },
          duration: 60000,
    });
    setRatings({});
    setExperience("");
    setSelectedTags([]);
    setSelectedImages([]);
    setImagePreviews([]);
  } catch (error) {
    toast("Failed to submit review");
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};


const tagGroups = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    acc[tag.category] = acc[tag.category] || [];
    acc[tag.category].push(tag);
    return acc;
}, {});


    return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{restaurant_name || "Loading..."}</h2>

      {/* Ratings */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category} className="flex items-center gap-4">
            <span className="w-24 text-sm">{category}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={20}
                  className={clsx(
                    "cursor-pointer",
                    i <= (ratings[category] || 0)
                      ? "fill-black text-black"
                      : "text-gray-400"
                  )}
                  onClick={() => handleRating(category, i)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Experience Textarea */}
      <Textarea
        placeholder="Share your experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="min-h-[100px]"
      />

      {/* Upload Images*/}
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        id="image-upload-input"
        onChange={handleImageSelect}
      />
      <Button
        className="w-full"
        type="button"
        onClick={() => {
          const input = document.getElementById("image-upload-input") as HTMLInputElement;
          input?.click();
        }}
      >Add photos</Button>

      {/* Image Previews - Horizontal Scroll */}
      {imagePreviews.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">{imagePreviews.length} photo(s) selected</span>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white text-black shadow-md"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tag Groups */}
      {Object.entries(tagGroups).map(([category, groupTags]) => (
        <div key={category} className="space-y-2">
          <h3 className="font-semibold text-sm">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {groupTags.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="rounded-full text-sm"
                onClick={() => toggleTag(tag.id)}
                type="button"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 sm:static sm:border-none sm:p-0">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full bg-[#57cc99] text-white hover:bg-[#49ac81ff]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
