import { ICore } from "./cores";

export interface ILaunch {
  flight_number: number,
  name: string,
  success?: boolean,
  details?: string,
  cores: ICore[],
  links: {
    patch: {
      small?: string,
      large?: string,
    },
  },
}