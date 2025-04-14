// components/business-profile/CompanyInfo.tsx
import Input from "@/components/form/input/InputField"
import { BusinessProfile } from '../page'

interface CompanyInfoProps {
  companyState: {
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
    amount: string
    text: string
    currency: string
  }
  setCompanyState: (state: any) => void
  isEditing: boolean
  typeBussiness: string
  general: {
    date: {
      day: number
      month: number
      year: number
    }
  }
}

export default function CompanyInfo({
  companyState,
  setCompanyState,
  isEditing,
  typeBussiness,
  general
}: CompanyInfoProps) {
  return (
    <section className="mt-5">
      <div className='flex align-middle justify-between'>
        <h2 className="text-xl font-semibold mb-4 ">📌 Thông tin công ty {typeBussiness}</h2>
        <p><strong>Ngày ký hồ sơ:</strong> Ngày {general.date.day} Tháng {general.date.month} Năm {general.date.year}</p>
      </div>

      <div className='border rounded p-4 mb-4 bg-white shadow-sm space-y-2'>
        <div className="flex content-center items-center">
          <strong className="">Tên công ty viết bằng tiếng Việt (ghi bằng chữ in hoa):</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.fullName}
            onChange={(e) => setCompanyState({ ...companyState, fullName: e.target.value })}
          />
        </div>

        <div className="flex content-center items-center">
          <strong className="">Tên công ty viết bằng tiếng nước ngoài (nếu có)</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.foreign}
            onChange={(e) => setCompanyState({ ...companyState, foreign: e.target.value })}
          />
        </div>

        <div className="flex content-center items-center">
          <strong className="">Tên công ty viết tắt (nếu có)</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.shortName}
            onChange={(e) => setCompanyState({ ...companyState, shortName: e.target.value })}
          />
        </div>

        <div className="flex content-center items-center">
          <strong className="">Email:</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.email}
            onChange={(e) => setCompanyState({ ...companyState, email: e.target.value })}
          />
        </div>

        <div className="flex content-center items-center">
          <strong className="">Vốn điều lệ:</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.amount}
            onChange={(e) => setCompanyState({ ...companyState, amount: e.target.value })}
          />
        </div>
      </div>
    </section>
  )
}
