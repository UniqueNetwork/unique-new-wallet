import { FC } from 'react';
import styled from 'styled-components/macro';

import { Offer } from '../../api/restApi/offers/types';
import { OfferCard } from '../OfferCard/OfferCard';

type TTokensList = {
  offers: Offer[];
};

export const OffersList: FC<TTokensList> = ({ offers }) => {
  return (
    <OffersListStyled>
      {offers?.map &&
        offers.map((offer: Offer) => (
          <OfferCard key={`token-${offer.collectionId}-${offer.tokenId}`} offer={offer} />
        ))}
    </OffersListStyled>
  );
};

const OffersListStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 32px;

  @media (max-width: 1919px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media (max-width: 1439px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 1023px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 567px) {
    display: flex;
    flex-direction: column;
  }
`;
