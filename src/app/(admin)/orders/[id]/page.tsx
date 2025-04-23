"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { useState } from 'react';
import Image from 'next/image';

const sampleOrderData = {
  orderId: "DH001",
  customer: "Khách A",
  description: "Đăng ký kinh doanh",
  staffInCharge: "Nhân viên X",
  orderType: "Dịch vụ",
  totalAmount: 3900000,
  paidAmount: 1400000,
  remainingAmount: 2500000,
  paymentInfo: {
    date: "20/03/2024",
    method: "CK02",
    transferId: "TK người chuyển",
    recipient: "Khách A"
  },
  products: [
    {
      id: 1,
      code: "DKKD",
      name: "Đăng ký kinh doanh",
      status: "Hoàn thành",
      quantity: 1,
      price: 3400000,
      total: 3400000
    }
  ]
};

export default function OrderDetailPage() {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePayOSQR = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: sampleOrderData.orderId,
          amount: sampleOrderData.remainingAmount,
          description: `Thanh toán đơn hàng ${sampleOrderData.orderId}`,
        }),
      });

      const data = await response.json();
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setPaymentLink(data.paymentLink);
        setShowQR(true);
      }
    } catch (error) {
      console.error('Error generating PayOS QR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Chi tiết đơn hàng</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/orders')}
        >
          Quay lại
        </Button>
      </div>

      <Card className="p-6">
        {/* Thông tin chung */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Thông tin chung</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-gray-600">Mã đơn hàng</label>
                <p className="font-medium">{sampleOrderData.orderId}</p>
              </div>
              <div>
                <label className="text-gray-600">Khách hàng</label>
                <p className="font-medium">{sampleOrderData.customer}</p>
              </div>
              <div>
                <label className="text-gray-600">Mô tả</label>
                <p className="font-medium">{sampleOrderData.description}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-gray-600">Nhân viên phụ trách</label>
                <p className="font-medium">{sampleOrderData.staffInCharge}</p>
              </div>
              <div>
                <label className="text-gray-600">Loại đơn hàng</label>
                <p className="font-medium">{sampleOrderData.orderType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Danh sách sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 p-3 text-left">STT</th>
                  <th className="border border-gray-200 p-3 text-left">Mã sản phẩm</th>
                  <th className="border border-gray-200 p-3 text-left">Tên sản phẩm</th>
                  <th className="border border-gray-200 p-3 text-left">Trạng thái</th>
                  <th className="border border-gray-200 p-3 text-right">Số lượng</th>
                  <th className="border border-gray-200 p-3 text-right">Đơn giá</th>
                  <th className="border border-gray-200 p-3 text-right">Tổng giá</th>
                </tr>
              </thead>
              <tbody>
                {sampleOrderData.products.map((product, index) => (
                  <tr key={product.id}>
                    <td className="border border-gray-200 p-3">{index + 1}</td>
                    <td className="border border-gray-200 p-3">{product.code}</td>
                    <td className="border border-gray-200 p-3">{product.name}</td>
                    <td className="border border-gray-200 p-3">
                      <span className="text-green-600">
                        {product.status}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3 text-right">{product.quantity}</td>
                    <td className="border border-gray-200 p-3 text-right">
                      {product.price.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="border border-gray-200 p-3 text-right">
                      {product.total.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="border border-gray-200 p-3 text-right font-medium">
                    Tổng giá trị:
                  </td>
                  <td className="border border-gray-200 p-3 text-right font-medium">
                    {sampleOrderData.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Thanh toán */}
        <div>
          <h2 className="text-lg font-medium mb-4">Thanh toán</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <p className="text-gray-600">Đã thanh toán</p>
                  <p className="text-xl font-medium text-green-600">
                    {sampleOrderData.paidAmount.toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Còn nợ</p>
                  <p className="text-xl font-medium text-red-600">
                    {sampleOrderData.remainingAmount.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Ngày thanh toán:</span>{" "}
                  {sampleOrderData.paymentInfo.date}
                </p>
                <p>
                  <span className="text-gray-600">Nội dung:</span>{" "}
                  {sampleOrderData.paymentInfo.method}
                </p>
                <p>
                  <span className="text-gray-600">Số TK người chuyển:</span>{" "}
                  {sampleOrderData.paymentInfo.transferId}
                </p>
                <p>
                  <span className="text-gray-600">Tên người chuyển:</span>{" "}
                  {sampleOrderData.paymentInfo.recipient}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div 
                className="w-48 h-48 bg-white rounded-lg flex flex-col items-center justify-center p-4 border border-gray-200"
              >
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Đang tạo mã QR...</p>
                  </div>
                ) : showQR && qrCode ? (
                  <>
                    <Image
                      src={qrCode}
                      alt="PayOS QR Code"
                      width={160}
                      height={160}
                      className="mb-2"
                    />
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => window.open(paymentLink || '', '_blank')}
                    >
                      Thanh toán
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={generatePayOSQR}
                    disabled={isLoading}
                  >
                    Xuất mã QR thanh toán
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 