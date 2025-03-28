'use client'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import Input from '@/components/form/input/InputField'
import Button from '@/components/ui/button/Button'

type Industry = {
  is_main: boolean
  code: string
  description: string
  note: string
}

type Props = {
  industriesState: Industry[]
  setIndustriesState: (data: Industry[]) => void
  isEditing: boolean
  selectedMainIndex: number | null
  setSelectedMainIndex: (index: number | null) => void
}

export default function IndustriesSection({
  industriesState,
  setIndustriesState,
  isEditing,
  selectedMainIndex,
  setSelectedMainIndex
}: Props) {
  const handleAddIndustry = () => {
    setIndustriesState([...industriesState, { code: '', description: '', note: '', is_main: false }])
  }

  const handleRemoveIndustry = (index: number) => {
    const updated = [...industriesState]
    updated.splice(index, 1)

    if (selectedMainIndex === index) {
      setSelectedMainIndex(null)
    } else if (selectedMainIndex !== null && selectedMainIndex > index) {
      setSelectedMainIndex(selectedMainIndex - 1)
    }

    setIndustriesState(updated)
  }

  return (
    <section>
      <div className="flex justify-between pb-4">
        <h2 className="text-xl font-semibold mb-4">👥 Mã ngành nghề</h2>
      </div>

      <Table className="w-full border border-gray-200 rounded-md overflow-hidden shadow-sm text-sm">
        <TableHeader className="bg-gray-100 text-gray-700">
          <TableRow className="border-b border-gray-200">
            <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
            <TableCell isHeader className="font-semibold px-4 py-2">Tên Ngành</TableCell>
            <TableCell isHeader className="font-semibold px-4 py-2">Mã ngành</TableCell>
            <TableCell isHeader className="font-semibold px-4 py-2">Lưu ý</TableCell>
            <TableCell isHeader className="font-semibold px-4 py-2 text-center">
              Ngành chính<br />
              <span className="text-xs text-gray-500">(đánh dấu X)</span>
            </TableCell>
            <TableCell isHeader className="font-semibold px-4 py-2">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {industriesState.map((industry, i) => (
            <TableRow key={i} className="border-b border-gray-200">
              <TableCell className="text-center">{i + 1}</TableCell>

              <TableCell className="px-2 py-2 text-center">
                <Input
                  disabled={!isEditing}
                  defaultValue={industry.description}
                  onChange={(e) => {
                    const updated = [...industriesState]
                    updated[i].description = e.target.value
                    setIndustriesState(updated)
                  }}
                />
              </TableCell>

              <TableCell className="px-2 py-2 text-center">
                <Input
                  disabled={!isEditing}
                  defaultValue={industry.code}
                  onChange={(e) => {
                    const updated = [...industriesState]
                    updated[i].code = e.target.value
                    setIndustriesState(updated)
                  }}
                />
              </TableCell>

              <TableCell className="px-2 py-2 text-center">
                <Input
                  disabled={!isEditing}
                  defaultValue={industry.note}
                  onChange={(e) => {
                    const updated = [...industriesState]
                    updated[i].note = e.target.value
                    setIndustriesState(updated)
                  }}
                />
              </TableCell>

              <TableCell className="text-center">
                <input
                  disabled={!isEditing}
                  type="radio"
                  name="is_main"
                  className="h-4 w-4 accent-blue-600"
                  checked={selectedMainIndex === i}
                  onChange={() => setSelectedMainIndex(i)}
                />
              </TableCell>

              <TableCell className="text-center">
                <Button
                  disabled={!isEditing}
                  onClick={() => handleRemoveIndustry(i)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button disabled={!isEditing} onClick={handleAddIndustry} className="mt-4">
        ➕ Thêm ngành nghề
      </Button>
    </section>
  )
}
