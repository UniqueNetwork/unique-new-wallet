import React, { useState, VFC } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import {
  Avatar,
  Button,
  Heading,
  InputText,
  Select,
  SelectOptionProps,
  Suggest,
  Tag,
  Text,
  Upload,
} from '@unique-nft/ui-kit';

import imgUrl from '@app/static/icons/empty-image.svg';
import { Alert } from '@app/components';
import { useFee } from '@app/hooks';

import pic from './image.png';

interface ICreateNFTProps {
  className?: string;
}

interface IPreviewCard {
  attributes?: any[];
  description?: string;
  geometry?: 'square' | 'circle';
  picture?: string;
  title?: string;
}

const values = [
  {
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    description:
      'Adopt yourself a Duckie and join The Flock. Each Duck is a 1 of 1 programmatically generated with a completely unique combination of traits. No two are identical. In total, there are 5000 Duckies. Stay up to date on drops by joining the Discord and following',
    img: pic,
  },
  {
    id: 2,
    title: 'qui est esse',
    img: pic,
  },
  {
    id: 3,
    title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    img: pic,
  },
  {
    id: 4,
    title: 'quasi exercitationem repellat qui ipsa sit aut',
    img: pic,
  },
];

const genderOptions = ['male', 'female', 'etc...'];

const traitOptions = [
  {
    id: 'val01',
    title: 'lorem',
  },
  {
    id: 'val02',
    title: 'set',
  },
  {
    id: 'val03',
    title: 'dolor',
  },
  {
    id: 'val04',
    title: 'ipsum',
  },
  {
    id: 'val05',
    title: 'amit',
  },
];

const commonPlateCss = css`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: var(--prop-border-radius);
  padding: calc(var(--prop-gap) * 2);
  background-color: var(--color-additional-light);
`;

const MainWrapper = styled.div`
  @media screen and (min-width: 1024px) {
    display: flex;
    align-items: flex-start;
  }
`;

const WrapperContent = styled.div`
  box-sizing: border-box;
  flex: 1 1 66.6666%;

  @media screen and (min-width: 1024px) {
    ${commonPlateCss};
  }
`;

const WrapperSidebar = styled.aside`
  box-sizing: border-box;
  flex: 1 1 33.3333%;
  max-width: 600px;
  margin-left: calc(var(--prop-gap) * 2);

  @media screen and (min-width: 1024px) {
    ${commonPlateCss};
  }
`;

const SidebarRow = styled.div`
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;

const PreviewCard = styled.div`
  display: flex;

  .unique-text {
    display: block;
  }

  .unique-avatar {
    outline: none;
    background-color: #f5f6f7;

    &.square {
      border-radius: var(--prop-border-radius);
    }
  }

  ._empty-picture {
    .unique-avatar {
      object-fit: none;
    }
  }
`;

const PreviewCardInfo = styled.div`
  flex: 1 1 auto;
  padding-left: var(--prop-gap);
`;

const PreviewCardTitle = styled.h5`
  font-size: 1.125rem;
  line-height: 1.5;
`;

const PreviewCardDescription = styled(Text)`
  &:not(:last-child) {
    margin-bottom: var(--prop-gap);
  }

  &.unique-text {
    font-weight: 400;
  }
`;

const PreviewCardAttributes = styled.div``;

const AttributesGroup = styled.div`
  & {
    overflow: hidden;
  }

  &:not(:first-of-type),
  & > * {
    margin-top: calc(var(--prop-gap) / 2);
  }

  .unique-tag {
    margin-right: calc(var(--prop-gap) / 2);
    cursor: auto;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 756px;

  .unique-select,
  .unique-suggestion,
  .suggest-input {
    display: block;
    width: 100%;
  }

  .unique-input-text {
    display: block;
    width: 100%;

    & > label {
      margin-bottom: var(--prop-gap);
    }
  }

  .unique-alert {
    margin-bottom: calc(var(--prop-gap) * 1.5);
  }

  .unique-font-heading {
    &:not(:first-child) {
      margin-top: calc(var(--prop-gap) * 2.5);
    }
  }
`;

const FormRow = styled.div`
  &:not(:last-child) {
    margin-bottom: calc(var(--prop-gap) * 2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > .unique-button {
    flex: 1 1 100%;

    @media screen and (min-width: 1024px) {
      flex: 0 0 auto;
      margin-right: var(--prop-gap);
    }

    &:not(:first-child) {
      margin-top: var(--prop-gap);

      @media screen and (min-width: 1024px) {
        margin-top: 0;
      }
    }
  }
`;

const LabelText = styled(Text).attrs({
  color: 'additional-dark',
  size: 'm',
  weight: 'bold',
})`
  display: block;
  margin-bottom: calc(var(--prop-gap) / 4);
  font-weight: 600;
`;

const AdditionalText = styled(Text).attrs({ size: 's', color: 'grey-500' })`
  margin-bottom: var(--prop-gap);
`;

const UploadWidget = styled.div``;

const Card: VFC<IPreviewCard> = ({
  attributes,
  description = 'Description',
  title = 'Name',
  picture,
  geometry = 'circle',
}) => {
  return (
    <PreviewCard>
      <div className={classNames({ '_empty-picture': picture === undefined })}>
        <Avatar size={64} src={picture || imgUrl} type={geometry} />
      </div>
      <PreviewCardInfo>
        <PreviewCardTitle>{title}</PreviewCardTitle>
        <PreviewCardDescription size="s" color="grey-500">
          {description}
        </PreviewCardDescription>
        {attributes && (
          <PreviewCardAttributes>
            <Text size="m">Attributes</Text>
            {attributes.map((item, i) => {
              return (
                <AttributesGroup key={i}>
                  <Text size="s" color="grey-500">
                    {item.group}
                  </Text>
                  {item.values?.map((tag: string, n: number) => (
                    <Tag label={tag} role="default" key={n} />
                  ))}
                </AttributesGroup>
              );
            })}
          </PreviewCardAttributes>
        )}
      </PreviewCardInfo>
    </PreviewCard>
  );
};

const SuggestOption = styled.div`
  display: flex;
  align-items: center;

  & > img {
    margin-right: calc(var(--prop-gap) / 2);
  }
`;

export const CreateNFT: VFC<ICreateNFTProps> = ({ className }) => {
  const { fee } = useFee();
  const [traits, setTraits] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<any>();

  return (
    <>
      <Heading size="1">Create a NFT</Heading>
      <MainWrapper className={classNames('create-nft-page', className)}>
        <WrapperContent>
          <Form>
            <Heading size="2">Main information</Heading>
            <FormRow>
              <LabelText>Collection*</LabelText>
              <Suggest
                components={{
                  SuggestItem: ({ suggestion, isActive }) => {
                    return (
                      <SuggestOption
                        className={classNames('suggestion-item', {
                          isActive,
                        })}
                      >
                        <Avatar size={24} src={suggestion.img} type="circle" />
                        {suggestion.title} [id {suggestion.id}]
                      </SuggestOption>
                    );
                  },
                }}
                suggestions={values}
                isLoading={false}
                getActiveSuggestOption={(option, activeOption) =>
                  option.id === activeOption.id
                }
                getSuggestionValue={({ title }) => title}
                onChange={setSelectedCollection}
              />
            </FormRow>
            <FormRow>
              <UploadWidget>
                <LabelText>Upload image*</LabelText>
                <AdditionalText>Choose JPG, PNG, GIF (max 10 Mb)</AdditionalText>
                <Upload type="square" />
              </UploadWidget>
            </FormRow>
            <Heading size="3">Attributes</Heading>
            <FormRow>
              <InputText label="Name*" name="name" value={name} onChange={setName} />
            </FormRow>
            <FormRow>
              <LabelText>Gender*</LabelText>
              <Suggest
                suggestions={genderOptions}
                getSuggestionValue={(value) => value}
                getActiveSuggestOption={(option: string, activeOption: string) =>
                  option === activeOption
                }
              />
            </FormRow>
            <FormRow>
              <Select
                multi
                label="Traits*"
                options={traitOptions}
                optionKey="id"
                optionValue="title"
                values={traits}
                onChange={(options: SelectOptionProps[]) => {
                  setTraits(options.map((option: any) => option.id as string));
                }}
              />
            </FormRow>
            <Alert type="warning">
              A fee of ~ {fee} QTZ can be applied to the transaction
            </Alert>
            <ButtonGroup>
              <Button disabled={false} title="Confirm and create more" role="primary" />
              <Button disabled={false} title="Confirm and close" />
            </ButtonGroup>
          </Form>
        </WrapperContent>
        <WrapperSidebar>
          <SidebarRow>
            <Heading size="3">Collection preview</Heading>
            <Card
              title={
                selectedCollection?.title &&
                `${selectedCollection?.title} [id${selectedCollection?.id}]`
              }
              description={selectedCollection?.description}
              picture={selectedCollection?.img}
            />
          </SidebarRow>
          <SidebarRow>
            <Heading size="3">NFT preview</Heading>
            <Card
              title={name || 'Symbol'}
              description={
                selectedCollection?.title
                  ? `${selectedCollection?.title} [id${selectedCollection?.id}]`
                  : 'Collection name'
              }
              attributes={[
                { group: 'Name', values: ['Name'] },
                { group: 'Gender', values: ['Female'] },
                {
                  group: 'Traits',
                  values: [
                    'Eyes To The Right',
                    'Eyes To The Left',
                    'Eyes To The Up',
                    'Eyes To The Down',
                  ],
                },
              ]}
              geometry="square"
            />
          </SidebarRow>
        </WrapperSidebar>
      </MainWrapper>
    </>
  );
};
