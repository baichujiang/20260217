interface Restaurant {
    id: string,
    name: string,
    address: string,
    website: string,
    score: number,
    susScore: number
}

async function getRestaurantById(id: string): Promise<Restaurant> {
    const result = await fetch(`http://localhost:4000/restaurants/${id}`)
    return result.json()
}

export default async function RestaurantDetailPage() {
    const restaurant = await getRestaurantById("1")
    return (
        
    )
}