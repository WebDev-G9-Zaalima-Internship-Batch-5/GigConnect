import { axiosInstance } from "../utils/axios.util";

export interface MilestoneInput {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
}

export interface ContractDraftInput {
  applicationId: string;
  agreedRate: number;
  agreedDuration: string;
  milestones?: MilestoneInput[];
  terms: string;
  startDate: string;
  endDate?: string;
}

export const proposeContract = async (payload: ContractDraftInput) => {
  const res = await axiosInstance.post("/contracts/propose", payload);
  return res.data.data;
};

export const updateContractDraft = async (
  contractId: string,
  patch: Partial<ContractDraftInput>
) => {
  const res = await axiosInstance.patch(`/contracts/${contractId}`, patch);
  return res.data.data;
};

export const submitContract = async (contractId: string) => {
  const res = await axiosInstance.post(`/contracts/${contractId}/submit`);
  return res.data.data;
};

export const acceptContractByFreelancer = async (contractId: string) => {
  const res = await axiosInstance.post(`/contracts/${contractId}/accept`);
  return res.data.data;
};

export const rejectContractByFreelancer = async (contractId: string) => {
  const res = await axiosInstance.post(`/contracts/${contractId}/reject`);
  return res.data.data;
};

export const fundEscrowInit = async (contractId: string) => {
  const res = await axiosInstance.post(`/contracts/${contractId}/fund-escrow`);
  return res.data.data as { orderId?: string; amount?: number; currency?: string; keyId?: string; alreadyFunded?: boolean };
};

export const verifyRazorpayPayment = async (
  contractId: string,
  payload: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }
) => {
  const res = await axiosInstance.post(`/contracts/${contractId}/razorpay/verify`, payload);
  return res.data.data as { success: boolean; contractId: string };
};

export const getContractByApplication = async (applicationId: string) => {
  const res = await axiosInstance.get(`/contracts/by-application/${applicationId}`);
  return res.data.data;
};

export const getContractById = async (contractId: string) => {
  const res = await axiosInstance.get(`/contracts/${contractId}`);
  return res.data.data;
};
