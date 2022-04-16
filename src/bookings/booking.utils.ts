import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingUtils {
  getDiscountPercentage(spentAmount: number) {
    if (spentAmount < 1000) {
      return 0;
    }

    if (spentAmount < 2000) {
      return 1;
    }

    if (spentAmount < 4000) {
      return 2;
    }

    if (spentAmount < 8000) {
      return 3;
    }

    return 5;
  }
}
