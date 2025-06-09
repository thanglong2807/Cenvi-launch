import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import Input from ".";

interface OptionSelectProps {
    label?: string;
    placeholder?: string;
    initialOptions?: string[];
}

const InputSelectCreatable: React.FC<OptionSelectProps> = ({
    label = "Tùy chọn",
    placeholder = "Nhập...",
    initialOptions = [],
}) => {
    const [options, setOptions] = useState<string[]>(initialOptions);
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);

    const handleSelect = (option: string) => {
        setValue(option);
        setOpen(false);
    };

    const handleAddOption = () => {
        if (value && !options.includes(value)) {
            setOptions([...options, value]);
        }
        setOpen(false);
    };

    return (
        <div className="w-full flex items-center">
                            
                            <label  className="w-50 text-sm font-medium text-gray-700">{label}</label>
            <Popover open={open}  onOpenChange={setOpen}>
                <PopoverTrigger  asChild>
                    <div className="relative w-full">
                        <Input
                           
                            flex=""
                            className="border border-gray-300"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onClick={() => setOpen(true)}
                        />
                        <ChevronDown className="absolute right-2 top-2.5 h-4  text-gray-500 pointer-events-none" />
                    </div>
                </PopoverTrigger>
                <PopoverContent  side="bottom"  className="w-[450px] p-2">
                    {options.length > 0 ? (
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                            {options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">Không có lựa chọn</div>
                    )}
                    {!options.includes(value) && value && (
                        <Button variant="outline" className="w-full mt-2" onClick={handleAddOption}>
                            Thêm “{value}”
                        </Button>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default InputSelectCreatable;
