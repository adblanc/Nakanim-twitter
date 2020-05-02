import { ACCOUNTS } from "../constants";

export const getRefs = (anime: any) => {
  return anime.ref.map((ref: string) => (ACCOUNTS as any)[ref]).join(" et ");
};
