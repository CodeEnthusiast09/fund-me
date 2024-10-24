import { DataTableFilter } from "@/interfaces";
import { clientRequestGateway } from "./client-request-gateway";
import { InferType } from "yup";
import { retrieveFromLocalStorage } from "@/lib/localStorage";

const requestGateway = clientRequestGateway();
export const accountClientRequests = {
  accountDetails: (_payload: { email: string; password: string }) =>
    requestGateway.post({
      url: `auth/login/admin`,
      payload: { email: "admin@yopmail.com", password: "1234567890" },
    }),

  roles: () => requestGateway.get(`auth/login/admin`),

  // changePassword: (payload: InferType<typeof changePasswordValidationSchema>) =>
  //   requestGateway.patch({ url: `profile/password`, payload }),

  // updateBioData: (payload: InferType<typeof updateBioDataValidationSchema>) =>
  //   requestGateway.patch({ url: `profile/personal-details`, payload }),

  updateProfilePicture: (payload: { image: string }) =>
    requestGateway.patch({ url: `profile/profile-image`, payload }),

  // qualifications
  addEducationQualifications: (payload: object[]) =>
    requestGateway.post({ url: `profile/qualifications`, payload }),

  // editEducationQualification: (
  //   payload: InferType<typeof editEducationBackgroundValidationSchema>
  // ) => requestGateway.patch({ url: `profile/qualifications`, payload }),

  educationQualifications: () => requestGateway.get(`profile/qualifications`),

  deleteEducationQualifications: (qualificationId: string) =>
    requestGateway.delete({ url: `profile/qualifications/${qualificationId}` }),

  // education references
  addEducationReferences: (payload: object[]) =>
    requestGateway.post({ url: `profile/references`, payload }),

  // editEducationReference: (
  //   payload: InferType<typeof editEducationReferenceValidationSchema>
  // ) => requestGateway.patch({ url: `profile/references`, payload }),

  educationReferences: () => requestGateway.get(`profile/references`),

  deleteEducationReference: (ReferenceId: string) =>
    requestGateway.delete({ url: `profile/references/${ReferenceId}` }),

  // guarantors
  addGuarantors: (payload: object[]) =>
    requestGateway.post({ url: `profile/guarantors`, payload }),

  // editGuarantor: (payload: InferType<typeof editGuarantorValidationSchema>) =>
  //   requestGateway.patch({ url: `profile/guarantors`, payload }),

  employmentDetails: () => requestGateway.get(`profile/employment-details`),

  guarantors: () => requestGateway.get(`profile/guarantors`),

  deleteGuarantor: (guarantorId: string) =>
    requestGateway.delete({ url: `profile/guarantors/${guarantorId}` }),

  // documents
  documents: ({ tableFilter }: { tableFilter?: DataTableFilter } = {}) =>
    requestGateway.get(
      `/profile/documents?limit=${tableFilter?.limit}&page=${tableFilter?.page}&order=${tableFilter?.order}&search=${tableFilter?.search}`
    ),

  // uploadDocument: (payload: InferType<typeof uploadProfileDocumentSchema>) =>
  //   requestGateway.post({ url: `profile/documents`, payload }),

  deleteDocument: (documentId: string) =>
    requestGateway.delete({ url: `profile/documents/${documentId}` }),

  // editDocument: (
  //   payload: InferType<typeof editProfileDocumentValidationSchema>
  // ) => requestGateway.patch({ url: `profile/documents`, payload }),
};
