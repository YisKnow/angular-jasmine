import { faker } from '@faker-js/faker';

import { Category } from './category.model';

export const generateFakeCategory = (data?: Partial<Category>): Category => ({
  id: faker.datatype.number(),
  name: faker.commerce.department(),
  ...data,
});
