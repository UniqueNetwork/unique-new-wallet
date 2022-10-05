import { CREATE_COLLECTION_TABS_ROUTE } from '@app/routes';

import { AttributeFieldOptional, AttributeFieldType, Warning } from './types';

export const tabsUrls = [
  `${CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION}`,
  `${CREATE_COLLECTION_TABS_ROUTE.NFT_ATTRIBUTES}`,
];

export const warnings: Record<string, Warning> = {
  coverIsNotDefine: {
    title: "Warning! You haven't entered the cover.",
    description:
      "Are you sure that you want to create the collection without it? You can't return to editing the cover in this product version.",
  },
  attributesAreNotDefine: {
    title:
      'You have not entered attributes. Are you sure that you want to create the collection without them?',
    description: 'You cannot return to editing the attributes in this product version.',
  },
};

export const types: AttributeFieldType[] = [
  { id: 'string', title: 'Text' },
  { id: 'enum', title: 'Select' },
  { id: 'repeated', title: 'Multiselect' },
];

export const rules: AttributeFieldOptional[] = [
  { id: 'optional', title: 'Optional' },
  { id: 'required', title: 'Required' },
];
