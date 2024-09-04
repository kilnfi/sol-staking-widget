import { request } from "./api";

export type PublicNonceAccountInfo = {
  nonce_account: string;
  nonce_account_authority: string;
};

export type GetNonceAccount = {
  data: PublicNonceAccountInfo;
};

export type PublicSignature = {
  pubkey: string;
  signature: string | null;
};

export type PartialSignWithNonceAccount = {
  data: PublicSignature[];
};

export const getNonceAccount = async () => {
  const { data } = await request<GetNonceAccount>("GET", "/v1/sol/nonce-account");
  return data;
};

export const craftStakeTx = async (
  param: {
    account_id: string;
    wallet: string;
    vote_account_address: string;
    amount_lamports: string;
  },
) => {
  const { data } = await request<{ data }>(
    "POST",
    "/v1/sol/transaction/stake",
    param,
  );
  return data;
};
