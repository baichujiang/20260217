export type Restaurant = {
  id: number
  name: string
  address: string
  website: string
  normal_score: number | null | undefined
  sustainability_score: number | null | undefined
  sourcing_score: number | null | undefined
  waste_score: number | null | undefined
  menu_score: number | null | undefined
  energy_score: number | null | undefined
}
