import { Dispatch, ReactNode, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Heading, Text } from '@unique-nft/ui-kit';

import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { ROUTE } from '@app/routes';
import { Button } from '@app/components/Button';

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
      <Text appearance="block">{description}</Text>
      <div className="buttons-wrapper">
        {isLast ? (
          <div className="group-btn">
            <Button
              title="Get started"
              wide={isXsMobile}
              role="primary"
              onClick={onCloseModal}
            />{' '}
            <Button
              wide={isXsMobile}
              title="Visit FAQ"
              onClick={() => {
                onCloseModal?.();
                navigation(`/${currentChain.network}/${ROUTE.FAQ}`, {
                  state: {
                    isNestedInfo: true,
                  },
                });
              }}
            />
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
