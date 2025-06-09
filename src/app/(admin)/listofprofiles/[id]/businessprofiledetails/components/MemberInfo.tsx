import Input from '@/components/form/input/InputField'

interface Member {
  name: string
  sex: string
  birthdate: string
  ethnic: string
  nationality: string
  id_number: string
  issue_place: string
  issue_date: string
  expiry_date: string
  capital: {
    amount: string
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
}

interface MemberInfoProps {
  membersState: Member[]
  setMembersState: (members: Member[]) => void
  isEditing: boolean
}

export default function MemberInfo({
  membersState,
  setMembersState,
  isEditing
}: MemberInfoProps) {
  return (
    <section>
      <div className="flex justify-between pb-4">
        <h2 className="text-xl font-semibold mb-4">👥 Thành viên góp vốn</h2>
      </div>

      {membersState.map((member: Member, idx) => (
        <div key={idx} className="border rounded p-4 mb-4 bg-white shadow-sm space-y-2">
          <div className='grid grid-cols-2 grid-rows-3'>
            <div className='flex items-center'>
              <strong>Họ tên</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.name}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].name = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div className='flex items-center'>
              <strong>Giới tính</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.sex}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].sex = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div className='flex items-center'>
              <strong>Ngày sinh</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.birthdate}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].birthdate = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div className='flex items-center'>
              <strong>Dân tộc</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.ethnic}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].ethnic = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div className='flex items-center'>
              <strong>Quốc tịch</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.nationality}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].nationality = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 grid-rows-2'>
            <div>
              <strong>CMND/CCCD</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.id_number}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].id_number = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div>
              <strong>Nơi cấp</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.issue_place}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].issue_place = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div>
              <strong>Ngày cấp CCCD</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.issue_date}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].issue_date = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div>
              <strong>Ngày hết hạn</strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.expiry_date}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].expiry_date = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
          </div>

          <strong>Vốn góp</strong>
          <Input
            disabled={!isEditing}
            className='outline-0 focus:none border-0'
            defaultValue={member.capital?.amount}
            onChange={(e) => {
              const updated = [...membersState]
              updated[idx].capital.amount = e.target.value
              setMembersState(updated)
            }}
          />
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
                  const updated = [...membersState]
                  updated[idx].address.permanent.street = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.permanent.ward = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
            <div>
              <strong>
                Quận/Huyện/Thị xã/Thành phố thuộc tỉnh:
              </strong>
              <Input
                disabled={!isEditing}
                className='outline-0 focus:none border-0'
                defaultValue={member.address?.permanent?.district}
                onChange={(e) => {
                  const updated = [...membersState]
                  updated[idx].address.permanent.district = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.permanent.city = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.permanent.country = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.contact.street = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.contact.ward = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.contact.district = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.contact.city = e.target.value
                  setMembersState(updated)
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
                  const updated = [...membersState]
                  updated[idx].address.contact.country = e.target.value
                  setMembersState(updated)
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
} 