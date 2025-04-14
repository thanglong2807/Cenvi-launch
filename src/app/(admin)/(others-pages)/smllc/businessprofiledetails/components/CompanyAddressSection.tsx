'use client'

import Input from '@/components/form/input/InputField'

type CompanyState = {
  detail: string
  ward: string
  district: string
  city: string
  country: string
  phone: string
  email: string
  fax: string
  website: string
}

type Props = {
  companyState: CompanyState
  setCompanyState: (data: CompanyState) => void
  isEditing: boolean
}

export default function CompanyAddressSection({
  companyState,
  setCompanyState,
  isEditing
}: Props) {
  return (
    <section>
      <div className="flex justify-between pb-4">
        <h2 className="text-xl font-semibold mb-4">📍 Địa chỉ trụ sở chính</h2>
      </div>

      <div className="border rounded p-4 mb-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center">
          <strong className="w-60">Số nhà, đường phố/tổ/xóm:</strong>
          <Input
            disabled={!isEditing}
            className="flex-1 border-0 outline-none"
            defaultValue={companyState.detail}
            onChange={(e) => setCompanyState({ ...companyState, detail: e.target.value })}
          />
        </div>

        <div className="flex items-center">
          <strong className="w-60">Xã/Phường/Thị trấn:</strong>
          <Input
            disabled={!isEditing}
            className="flex-1 border-0 outline-none"
            defaultValue={companyState.ward}
            onChange={(e) => setCompanyState({ ...companyState, ward: e.target.value })}
          />
        </div>

        <div className="flex items-center">
          <strong className="w-60">Quận/Huyện/Thị xã:</strong>
          <Input
            disabled={!isEditing}
            className="flex-1 border-0 outline-none"
            defaultValue={companyState.district}
            onChange={(e) => setCompanyState({ ...companyState, district: e.target.value })}
          />
        </div>

        <div className="flex items-center">
          <strong className="w-60">Tỉnh/Thành phố:</strong>
          <Input
            disabled={!isEditing}
            className="flex-1 border-0 outline-none"
            defaultValue={companyState.city}
            onChange={(e) => setCompanyState({ ...companyState, city: e.target.value })}
          />
        </div>

        <div className="flex items-center">
          <strong className="w-60">Quốc gia:</strong>
          <Input
            disabled={!isEditing}
            className="flex-1 border-0 outline-none"
            defaultValue={companyState.country}
            onChange={(e) => setCompanyState({ ...companyState, country: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <strong className="w-28">Điện thoại:</strong>
            <Input
              disabled={!isEditing}
              className="flex-1 border-0 outline-none"
              defaultValue={companyState.phone}
              onChange={(e) => setCompanyState({ ...companyState, phone: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <strong className="w-20">Email:</strong>
            <Input
              disabled={!isEditing}
              className="flex-1 border-0 outline-none"
              defaultValue={companyState.email}
              onChange={(e) => setCompanyState({ ...companyState, email: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <strong className="w-28">Fax:</strong>
            <Input
              disabled={!isEditing}
              className="flex-1 border-0 outline-none"
              defaultValue={companyState.fax}
              onChange={(e) => setCompanyState({ ...companyState, fax: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <strong className="w-28">Website:</strong>
            <Input
              disabled={!isEditing}
              className="flex-1 border-0 outline-none"
              defaultValue={companyState.website}
              onChange={(e) => setCompanyState({ ...companyState, website: e.target.value })}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
