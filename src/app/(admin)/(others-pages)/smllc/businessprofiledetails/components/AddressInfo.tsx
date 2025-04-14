import Input from '@/components/form/input/InputField'

interface AddressInfoProps {
  companyState: {
    detail: string
    ward: string
    district: string
    city: string
    country: string
    phone: string
    fax: string
    website: string
    email: string
  }
  setCompanyState: (state: any) => void
  isEditing: boolean
}

export default function AddressInfo({ 
  companyState, 
  setCompanyState, 
  isEditing 
}: AddressInfoProps) {
  return (
    <section>
      <div className="flex justify-between pb-4">
        <h2 className="text-xl font-semibold mb-4">👥 Địa chỉ trụ sở chính</h2>
      </div>
      <div className='border rounded p-4 mb-4 bg-white shadow-sm space-y-2"'>
        <div className="flex content-center items-center">
          <strong className="">Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.detail}
            onChange={(e) => setCompanyState({ ...companyState, detail: e.target.value })}
          />
        </div>
        <div className="flex content-center items-center">
          <strong className="">Xã/Phường/Thị trấn: </strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.ward}
            onChange={(e) => setCompanyState({ ...companyState, ward: e.target.value })}
          />
        </div>
        <div className="flex content-center items-center">
          <strong className="">Quận/Huyện/Thị xã/Thành phố thuộc tỉnh: </strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.district}
            onChange={(e) => setCompanyState({ ...companyState, district: e.target.value })}
          />
        </div>
        <div className="flex content-center items-center">
          <strong className="">Tỉnh/Thành phố:</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.city}
            onChange={(e) => setCompanyState({ ...companyState, city: e.target.value })}
          />
        </div>
        <div className="flex content-center items-center">
          <strong className="">Quốc gia: </strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={companyState.country}
            onChange={(e) => setCompanyState({ ...companyState, country: e.target.value })}
          />
        </div>
        <div className='grid grid-cols-2 grid-rows-2'>
          <div className="flex content-center items-center">
            <strong className="">Điện thoại: </strong>
            <Input
              disabled={!isEditing}
              className='outline-0 focus:none border-0'
              defaultValue={companyState.phone}
              onChange={(e) => setCompanyState({ ...companyState, phone: e.target.value })}
            />
          </div>
          <div className="flex content-center items-center">
            <strong className="">Email: </strong>
            <Input
              disabled={!isEditing}
              className='outline-0 focus:none border-0'
              defaultValue={companyState.email}
              onChange={(e) => setCompanyState({ ...companyState, email: e.target.value })}
            />
          </div>
          <div className="flex content-center items-center">
            <strong className="">Fax (nếu có):</strong>
            <Input
              disabled={!isEditing}
              className='outline-0 focus:none border-0'
              defaultValue={companyState.fax}
              onChange={(e) => setCompanyState({ ...companyState, fax: e.target.value })}
            />
          </div>
          <div className="flex content-center items-center">
            <strong className="">Website (nếu có):</strong>
            <Input
              disabled={!isEditing}
              className='outline-0 focus:none border-0'
              defaultValue={companyState.website}
              onChange={(e) => setCompanyState({ ...companyState, website: e.target.value })}
            />
          </div>
        </div>
      </div>
    </section>
  )
} 