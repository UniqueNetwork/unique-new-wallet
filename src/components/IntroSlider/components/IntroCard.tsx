import { Heading, Text, Button } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApi } from '@app/hooks';
import { ROUTE } from '@app/routes';

type IntroCardProps = {
  imgPath: string;
  title: string;
  description: string;
  setActiveSlide: Dispatch<SetStateAction<number>>;
  isLast?: boolean;
  onCloseModal?(): void;
};

export const IntroCard = ({
  description,
  imgPath,
  title,
  setActiveSlide,
  isLast = false,
  onCloseModal,
}: IntroCardProps) => {
  const navigation = useNavigate();
  const { currentChain } = useApi();
  return (
    <IntroCardWrapper>
      <img width="96" src={imgPath} alt="" />
      <Heading size="2">{title}</Heading>
      <Text appearance="block">{description}</Text>
      <div className="buttons-wrapper">
        {isLast ? (
          <div className="group-btn">
            <Button title="Get started" role="primary" onClick={onCloseModal} />{' '}
            <Button
              title="Visit FAQ"
              onClick={() => {
                onCloseModal?.();
                navigation(`/${currentChain.network}/${ROUTE.FAQ}`);
              }}
            />
          </div>
        ) : (
          <Button
            className="next-button"
            title="Next"
            role="primary"
            onClick={() => {
              setActiveSlide((prev) => prev + 1);
            }}
          />
        )}
      </div>
    </IntroCardWrapper>
  );
};

const IntroCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;

  .unique-font-heading {
    margin-top: 25px;
  }

  .unique-text {
    font-weight: 400;
  }

  .next-button {
    width: 135px;
  }

  .group-btn {
    display: flex;
    justify-content: center;

    button + button {
      margin-left: 10px;
    }
  }

  .buttons-wrapper {
    margin-top: 25px;
  }
`;
