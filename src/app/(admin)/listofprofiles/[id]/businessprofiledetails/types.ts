export interface CompanyState {
  fullName: string
  shortName: string
  email: string
  foreign: string
  detail: string
  ward: string
  district: string
  city: string
  country: string
  phone: string
  fax: string
  website: string
}

export interface CapitalState {
  amount: string
  text: string
  currency: string
}

export interface GeneralInfo {
  date: {
    day: number
    month: number
    year: number
  }
} 