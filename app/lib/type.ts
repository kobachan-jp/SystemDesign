export type Museum = {
  id: number
  name: string
  address: string
  officialUrl: string
  description?: string
  exhibitions: Exhibition[]
}

export type Exhibition = {
  id: number
  title: string
  startDate: Date
  endDate: Date
  officialUrl: string
  description?: string
  museumId: number
  museum?: Museum
}
