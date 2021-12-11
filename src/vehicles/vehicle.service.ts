import { Injectable } from '@nestjs/common';

@Injectable()
export class VehicleService {
  search() {
    const vehicles = [
      {
        name: 'Car',
      },
    ];

    return { vehicles, totalRecordCount: 1 };
  }
}
