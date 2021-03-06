export enum ESortBy {
  price = 'vehicle.purchasePrice',
  power = 'vehicleModel.power',
}

export const TRANSMISSIONS = ['manual', 'automatic'] as const;

export const FUELS = ['petrol', 'diesel', 'hybrid', 'electric'] as const;

export const BODY_STYLES = [
  'sedan',
  'hatchback',
  'liftback',
  'combi',
  'coupe',
  'pickUp',
  'van',
] as const;

export const COLORS = [
  'white',
  'black',
  'gray',
  'silver',
  'red',
  'blue',
  'brown',
  'green',
  'orange',
  'yellow',
] as const;
