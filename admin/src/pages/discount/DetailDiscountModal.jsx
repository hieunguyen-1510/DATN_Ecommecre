import { Modal, Descriptions, Tag } from "antd";
import React from "react";
import dayjs from "dayjs";

const DetailDiscountModal = ({ visible, onCancel, currentDiscount }) => {
  return (
    <Modal
      title="Chi tiết mã giảm giá"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {currentDiscount && (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã" span={2}>
            <Tag color="blue">{currentDiscount.code}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Loại giảm giá">
            {currentDiscount.discountType === "percentage"
              ? "Phần trăm"
              : "Giảm tiền trực tiếp"}
          </Descriptions.Item>
          <Descriptions.Item label="Giá trị">
            {currentDiscount.discountType === "percentage"
              ? `${currentDiscount.value}%`
              : `${currentDiscount.value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag
              color={
                currentDiscount.status === "active"
                  ? "green"
                  : currentDiscount.status === "inactive"
                  ? "orange"
                  : "red"
              }
            >
              {currentDiscount.status === "active"
                ? "Hoạt động"
                : currentDiscount.status === "inactive"
                ? "Tạm dừng"
                : "Hết hạn"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Giá trị đơn tối thiểu">
            {currentDiscount.minOrderValue
              ? `${currentDiscount.minOrderValue
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`
              : "Không yêu cầu"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới hạn sử dụng">
            {currentDiscount.usageLimit
              ? `${currentDiscount.usedCount || 0}/${
                  currentDiscount.usageLimit
                }`
              : "Không giới hạn"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời hạn" span={2}>
            {dayjs(currentDiscount.startDate).format("DD/MM/YYYY HH:mm")} -{" "}
            {dayjs(currentDiscount.endDate).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo" span={2}>
            {currentDiscount.createdBy?.name || "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dayjs(currentDiscount.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {dayjs(currentDiscount.updatedAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailDiscountModal;
