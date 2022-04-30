export type TVehiclePriceJson = { total: number; deposit: number } | null;

export type TVehicleJson = {
  id: string;
  color: string;
  year: number;
  mileage: number;
  make: string;
  model: string;
  fuel: string;
  transmission: string;
  bodyStyle: string;
  power: number;
  seats: number;
  doors: number;
  imageUrl: string;
  price: TVehiclePriceJson;
};
