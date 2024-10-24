export enum UserContactType {
  PHONE = "phone",
  EMAIL = "email",
}

export enum UserGuarantorStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
}

export enum SIGNATORY_TYPE {
  VACANCY_REQUEST = "vacancy_request",
}

export enum PAYMENT_REQUEST_STATUS {
  PENDING = "pending",
  PAID = "paid",
  PAYMENT_RECEIVED = "payment received",
  APPROVED = "approved",
  NOT_APPROVED = "not approved",
  AUTHORIZED = "authorized",
  NOT_AUTHORIZED = "not authorized",
  AWAITING_MD_APPROVAL = "awaiting md review",
  TRANSFERRED = "transferred",
}

export enum EQUIPMENT_OPERATIONAL_STATUS {
  OPERATIONAL = "operational",
  UNDER_MAINTENANCE = "under maintenance",
  EXPIRED = "expired",
}

export enum EQUIPMENT_FENDER_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
