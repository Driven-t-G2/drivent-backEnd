import { ApplicationError } from "@/protocols";

export function conflictError(): ApplicationError {
  return {
    name: "ConflictError",
    message: "Activities hours Dont match", 
  };
}
