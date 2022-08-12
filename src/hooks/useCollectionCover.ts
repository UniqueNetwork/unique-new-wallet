import { useCallback, useEffect, useState } from 'react';
import get from 'lodash/get';

import { config } from '@app/config';
import { CollectionInfoWithPropertiesDto } from '@app/types/Api';

const { IPFSGateway } = config;

export const useCollectionCover = (
  collection?: CollectionInfoWithPropertiesDto,
): string | undefined => {
  const [collectionCover, setCollectionCover] = useState<string>();

  const getCoverImageFromCollection = useCallback(() => {
    const variableOnChainSchema = get(
      collection,
      'properties.variableOnChainSchema',
      '{}',
    );

    try {
      const cover = JSON.parse(variableOnChainSchema);

      if (!cover.collectionCover) {
        return;
      }

      setCollectionCover(`${IPFSGateway}/${cover.collectionCover}`);
    } catch (e) {
      console.log('getCoverImageFromCollection error', e);
    }
  }, [collection]);

  useEffect(() => {
    getCoverImageFromCollection();
  }, [getCoverImageFromCollection]);

  return collectionCover;
};
