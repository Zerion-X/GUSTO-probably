import { type FieldError, type UseFormRegister } from "react-hook-form";

export interface IFormField {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
}