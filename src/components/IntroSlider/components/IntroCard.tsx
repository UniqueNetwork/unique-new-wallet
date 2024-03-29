import { Dispatch, ReactNode, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { ROUTE } from '@app/routes';
import { Button, Heading, Typography } from '@app/components';

type IntroCardProps = {
  imgPath: string;
  title: ReactNode;
  description: ReactNode;
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
  const size = useDeviceSize();

  const isXsMobile = size === DeviceSize.xs;

  return (
    <IntroCardWrapper>
      <img width="96" src={imgPath} alt="" />
      <Heading size={isXsMobile ? '3' : '2'}>{title}</Heading>
      <Typography appearance="block">{description}</Typography>
      <div className="buttons-wrapper">
        {isLast ? (
          <div className="group-btn">
            <Button
              title="Get started"
              wide={isXsMobile}
              role="primary"
              onClick={onCloseModal}
            />{' '}
          </div>
        ) : (
          <Button
            className="next-button"
            title="Next"
            wide={isXsMobile}
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
    min-width: 135px;
  }

  .group-btn {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .buttons-wrapper {
    width: 100%;
    margin-top: 24px;
  }

  @media (max-width: 567px) {
    .group-btn {
      flex-direction: column;
    }
  }
`;
