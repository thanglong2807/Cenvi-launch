import Input from '@/components/form/input/InputField'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import Button from '@/components/ui/button/Button'

interface Industry {
  is_main: boolean
  code: string
  description: string
  note: string
}

interface IndustryInfoProps {
  industriesState: Industry[]
  setIndustriesState: (industries: Industry[] | ((prev: Industry[]) => Industry[])) => void
  selectedMainIndex: number | null
  setSelectedMainIndex: (index: number | null) => void
  isEditing: boolean
  handleAddIndustry: () => void
  handleRemoveIndustry: (index: number) => void
}

export default function IndustryInfo({
  industriesState,
  setIndustriesState,
  selectedMainIndex,
  setSelectedMainIndex,
  isEditing,
  handleAddIndustry,
  handleRemoveIndustry
}: IndustryInfoProps) {
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
              Ngành nghề kinh doanh chính<br />
              <span className="text-xs text-gray-500">(đánh dấu X để chọn)</span>
            </TableCell>
            <TableCell isHeader className="font-semibold px-4 py-2">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {industriesState.map((e, i) => (
            <TableRow key={i} className="hover:bg-gray-50 border-b border-gray-200">
              <TableCell className="px-4 py-2 text-center">{i + 1}</TableCell>

              <TableCell className="px-2 py-2 text-center">
                <Input
                  disabled={!isEditing}
                  defaultValue={e.description}
                  onChange={(ev) =>
                    setIndustriesState((prev: Industry[]) => {
                      const updated = [...prev]
                      updated[i].description = ev.target.value
                      return updated
                    })
                  }
                />
              </TableCell>

              <TableCell className="px-2 py-2 text-center">
                <Input
                  disabled={!isEditing}
                  defaultValue={e.code}
                  onChange={(ev) => {
                    const updated = [...industriesState]
                    updated[i].code = ev.target.value
                    setIndustriesState(updated)
                  }}
                />
              </TableCell>

              <TableCell className="px-2 py-2 text-center">
                <Input
                  disabled={!isEditing}
                  defaultValue={e.note}
                  onChange={(ev) => {
                    const updated = [...industriesState]
                    updated[i].note = ev.target.value
                    setIndustriesState(updated)
                  }}
                />
              </TableCell>

              <TableCell className="px-2 py-2 text-center">
                <input
                  disabled={!isEditing}
                  type="radio"
                  name="is_main"
                  className="h-4 w-4 accent-blue-600"
                  checked={selectedMainIndex === i}
                  onChange={() => setSelectedMainIndex(i)}
                />
              </TableCell>
              <TableCell className="px-2 py-2 text-center">
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
      <Button disabled={!isEditing} onClick={handleAddIndustry} className="mb-4">
        ➕ Thêm ngành nghề
      </Button>
    </section>
  )
} 