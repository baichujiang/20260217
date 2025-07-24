import RestaurantCard from "@/components/RestaurantCard"
import { RestaurantCardProps } from "@/types/restaurant"

interface Props {
  restaurants: RestaurantCardProps[]
  variant?: "middle" | "small"
  title?: string
  description?: string
}

export default function RestaurantList({
  restaurants,
  variant = "middle",
  title = "Restaurants",
  description = "Browse restaurants below",
}: Props) {
  return (
    <section>
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}

      <div className="space-y-4">
        {restaurants.map((rest) => (
          <div key={rest.id} className="mb-4">
            <RestaurantCard {...rest} variant={variant} />
          </div>
        ))}
      </div>
    </section>
  )
}
