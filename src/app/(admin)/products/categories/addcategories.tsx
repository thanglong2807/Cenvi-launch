"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input';
import TextArea from '@/components/form/input/TextArea';

interface AddCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    services: string[];
  }) => void;
}

function AddCatalog({ isOpen, onClose, onSave }: AddCatalogProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [services, setServices] = useState<string[]>([""]);  // Start with one empty service
  
  // Handle adding a new service input field
  const addServiceField = () => {
    setServices([...services, ""]);
  };
  
  // Handle removing a service input field
  const removeServiceField = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };
  
  // Handle service input change
  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!categoryName.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }
    
    // Call the onSave callback with form data
    onSave({
      name: categoryName,
      description: categoryDescription,
      services: services.filter(service => service.trim() !== "")
    });
    
    // Reset form
    setCategoryName("");
    setCategoryDescription("");
    setServices([""]);
  };

  return (
    <Modal isOpen={isOpen} className='' isFullscreen onClose={onClose}>
      <div className="bg-[#fff] rounded-xl w-[800px] min-h-[534px] flex pt-8  flex-col justify-between">
        <div className=" py-3 px-8 ">
          <h2 className="text-amber-500 text-xl font-medium">Danh mục</h2>
        </div>
        
        <div className="p-6 px-8 flex-1" >
          <div className="grid w-full gap-6">
            <div className="flex w-full items-center gap-4 ">
              <label className="text-sm font-medium text-gray-700 min-w-[150px]">Tên danh mục <span className="text-red-500">*</span></label>
              <Input
                placeholder="Nhập..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-1 border w-60"
              />
            </div>
            
            <div className="flex items-start w-full gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-[150px] mt-2">Mô tả:</label>
              <TextArea
              waperClassName='w-60'
                placeholder="Nhập..."
                value={categoryDescription}
                onChange={(value) => setCategoryDescription(value)}
                className="flex-1 border w-60"
                rows={4}
              />
            </div>
            
            <div className="flex items-start gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-[150px] mt-2">Danh sách tác vụ</label>
              <div className="flex-1 space-y-2">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      placeholder="Nhập..."
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      className="flex-1 border w-60"
                    />
                    {index === 0 ? (
                      <button 
                        type="button" 
                        onClick={addServiceField}
                        className="p-2 rounded-full border hover:bg-gray-100"
                      >
                        <Plus size={16} className="text-amber-500" />
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => removeServiceField(index)}
                        className="p-2 rounded-full border hover:bg-gray-100"
                      >
                        <Minus size={16} className="text-amber-500 " />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 p-4 px-8 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            Lưu
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AddCatalog;