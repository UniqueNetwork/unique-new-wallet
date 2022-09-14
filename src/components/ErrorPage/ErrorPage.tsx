import { VFC } from 'react';
import styled from 'styled-components';

import baseUrl from './assets/image_404.svg';

const Wrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--prop-gap) * 3) var(--prop-gap);
  padding: calc(var(--prop-gap) * 2);
  color: var(--color-blue-grey-300);
  text-align: center;

  @media screen and (min-width: 1024px) {
    flex-direction: row;
    gap: var(--prop-gap) calc(var(--prop-gap) * 3);
    text-align: left;
  }
`;

const Image = styled.img`
  user-select: none;

  @media screen and (min-width: 1024px) {
    width: 150px;
    height: 212px;
  }
`;

const Description = styled.p`
  max-width: 400px;
  color: var(--color-blue-grey-400);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;

  &::before {
    display: block;
    margin-top: -0.075em;
    margin-bottom: 0.15em;
    font-size: 80px;
    font-weight: 500;
    line-height: 1;
    content: attr(data-errorcode);

    @media screen and (min-width: 1024px) {
      font-size: 118px;
      font-weight: 400;
      margin-bottom: 0;
    }
  }
`;

export const ErrorPage: VFC<{
  errorNumber?: string;
  errorText?: string;
  image?: string;
}> = ({ errorNumber = '404', errorText = 'Page not found', image = baseUrl }) => {
  return (
    <Wrapper>
      <Image width={112} height={158} src={image} alt="" />
      <Description data-errorcode={errorNumber}>{errorText}</Description>
    </Wrapper>
  );
};
