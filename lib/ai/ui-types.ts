import type { InferUITools, UIDataTypes, UIMessage } from "ai";
import type { HaltevTools } from "./tools";

export type HaltevUITools = InferUITools<HaltevTools>;
export type HaltevUIMessage = UIMessage<unknown, UIDataTypes, HaltevUITools>;

type Out<K extends keyof HaltevUITools> = Exclude<HaltevUITools[K]["output"], { error: string }>;
export type BatchesOutput = Out<"list_available_batches">;
export type FormOutput = Out<"show_registration_form">;
export type InvoiceOutput = Out<"create_invoice">;
export type ProofOutput = Out<"request_payment_proof">;
export type StatusOutput = Out<"check_invoice_status">;
