import { faker } from '@faker-js/faker';

import { generateFakeCategory } from './category.mock';

import { Product } from './product.model';

export const generateOneProduct = (data?: Partial<Product>): Product => ({
  id: faker.datatype.uuid(),
  title: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  category: generateFakeCategory(data?.category),
  images: ['img', 'img'],
  ...data,
});

export const generateManyProducts = (size = 10): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < size; i++) {
    products.push(generateOneProduct());
  }
  return [...products];
};
