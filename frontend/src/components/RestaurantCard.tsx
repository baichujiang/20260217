import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { RestaurantCardProps } from "@/types/restaurant";

type Props = RestaurantCardProps & {
  variant?: "small" | "middle";
};

export default function RestaurantCard({
  id,
  name,
  address,
  normal_score,
  sustainability_score,
  image,
  variant = "small",
}: Props) {
  return (
    <Link href={`/restaurant-detail?id=${id}`} passHref>
      <div
        className={`border shadow rounded-xl bg-white hover:shadow-md transition overflow-hidden cursor-pointer ${
          variant === "middle" ? "flex" : ""
        }`}
      >
        <Image
          src={image || "/default-restaurant.png"}
          alt={name}
          width={variant === "middle" ? 120 : 400}
          height={variant === "middle" ? 120 : 200}
          className={`object-cover ${variant === "middle" ? "w-32 h-32" : "w-full h-32"}`}
        />

        <div className={`p-4 ${variant === "middle" ? "flex flex-col justify-center" : "space-y-1"}`}>
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>

          {variant === "middle" && (
            <p className="text-xs text-gray-500 mb-1 line-clamp-1">{address}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Badge variant="outline" className="text-sm flex items-center gap-1">
              <Star className="w-3 h-4" fill="currentColor" />
              {normal_score?.toFixed(1) ?? "N/A"}
            </Badge>

            <Badge variant="outline" className="text-[#57cc99] text-sm flex items-center gap-1">
              <Star className="w-4 h-4" fill="currentColor" />
              {typeof sustainability_score === "number"
                ? sustainability_score.toFixed(1)
                : "N/A"}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
