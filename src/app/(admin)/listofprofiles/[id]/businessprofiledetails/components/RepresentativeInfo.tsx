import Input from '@/components/form/input/InputField'

interface Representative {
  name: string
  sex: string
  position?: string
  birthdate: string
  ethnic: string
  nationality: string
  id: {
    ox_cccd: boolean
    ox_cmnd: boolean
    ox_passport: boolean
    ox_other: boolean
    note: string
    number: string
    issue_date: string
    issue_place: string
    expiry_date: string
  }
  address: {
    permanent: {
      street: string
      ward: string
      district: string
      city: string
      country: string
    }
    contact: {
      street: string
      ward: string
      district: string
      city: string
      country: string
    }
  }
  contact: {
    phone: string
    email: string
  }
}

interface RepresentativeInfoProps {
  representativeState: Representative[]
  setRepresentativeState: (representatives: Representative[]) => void
  isEditing: boolean
}

export default function RepresentativeInfo({
  representativeState,
  setRepresentativeState,
  isEditing
}: RepresentativeInfoProps) {
  return (
    <section>
      <div className="flex justify-between pb-4">
        <h2 className="text-xl font-semibold mb-4">👥 Người đại diện pháp luật</h2>
      </div>
      {representativeState.map((member: Representative, idx) => (
        <div key={idx} className="border rounded p-4 mb-4 bg-white shadow-sm space-y-2">
          <div className='grid grid-cols-2 '>
            <div>
              <strong>Họ tên</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.name}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].name = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>Giới tính</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.sex}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].sex = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>Ngày sinh</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.birthdate}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].birthdate = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>Dân tộc</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.ethnic}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].ethnic = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>Quốc tịch</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.nationality}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].nationality = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>Chức danh</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.position}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].position = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
          </div>
          <hr className='my-4' />
          <div>
            <h3 className='my-2'><strong>Địa chỉ thường trú:</strong></h3>

            <div>
              <strong>
                Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.permanent?.street}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.permanent.street = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Xã/Phường/Thị trấn:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.permanent?.ward}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.permanent.ward = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Quận/Huyện/Thị xã/Thành phố thuộc tỉnh
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.permanent?.district}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.permanent.district = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Tỉnh/Thành phố:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.permanent?.city}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.permanent.city = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Quốc gia:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.permanent?.country}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.permanent.country = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
          </div>
          <hr className='my-4' />

          <div>
            <h3 className='my-2'><strong>Địa chỉ liên lạc:</strong></h3>

            <div>
              <strong>
                Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.contact?.street}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.contact.street = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Xã/Phường/Thị trấn:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.contact?.ward}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.contact.ward = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Quận/Huyện/Thị xã/Thành phố thuộc tỉnh
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.contact?.district}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.contact.district = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Tỉnh/Thành phố:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.contact?.city}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.contact.city = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Quốc gia:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.contact?.country}
                onChange={(e) => {
                  const updated = [...representativeState]
                  updated[idx].address.contact.country = e.target.value
                  setRepresentativeState(updated)
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
} 