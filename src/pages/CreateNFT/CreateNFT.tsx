import { useEffect, useMemo, useState, VFC } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { CreateTokenBody, TokenId } from '@unique-nft/sdk';
import { Address } from '@unique-nft/utils';

import {
  useMintingFormService,
  DeviceSize,
  useAccounts,
  useApi,
  useDeviceSize,
} from '@app/hooks';
import {
  useCollectionGetById,
  useCollectionGetLastTokenId,
  useExtrinsicCacheEntities,
  useTokenCreate,
} from '@app/api';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import {
  Alert,
  Button,
  ConfirmBtn,
  StatusTransactionModal,
  useNotifications,
} from '@app/components';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { config } from '@app/config';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { BottomBar } from '@app/pages/components/BottomBar';
import { ButtonGroup, FormWrapper } from '@app/pages/components/FormComponents';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { Sidebar } from '@app/pages/CreateNFT/Sidebar';
import { Collection, TokenTypeEnum } from '@app/api/graphQL/types';

import { CreateNftForm } from './CreateNftForm';
import { mapTokenForm } from './helpers';
import { AttributeView, FilledTokenForm, Option, TokenForm } from './types';
import { USER_HAS_NO_COLLECTION } from '../constants';
import { ReachedTokensLimitModal } from './ReachedTokensLimitModal';

interface ICreateNFTProps {
  className?: string;
}

const defaultOptions = {
  skip: false,
  pagination: {
    page: 0,
    limit: 300,
  },
};

const WrapperContentStyled = styled(WrapperContent)`
  margin-bottom: calc(var(--prop-gap) * 2.5);

  @media screen and (min-width: 1025px) {
    margin-bottom: 0;
  }
`;

const ButtonsGroup = styled.div`
  position: absolute;
  bottom: 0;
  padding: calc(var(--prop-gap) / 1.6) calc(var(--prop-gap) / 2);
`;

export const CreateNFTComponent: VFC<ICreateNFTProps> = ({ className }) => {
  const deviceSize = useDeviceSize();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isReachedTokensLimitModalVisible, setIsReachedTokensLimitModalVisible] =
    useState(false);

  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { currentChain } = useApi();
  const {
    selectedAccount,
    accounts: { size: accountsLength },
  } = useAccounts();
  const { warning, info } = useNotifications();

  const {
    isValid,
    validationMessage,
    submitWaitResult,
    getFee,
    feeFormatted,
    feeLoading,
    debouncedFormValues,
    isSufficientBalance,
    isLoadingSubmitResult,
  } = useMintingFormService<TokenId, CreateTokenBody, TokenForm>({
    MutateAsyncFunction: useTokenCreate,
    account: selectedAccount,
  });

  const { setPayloadEntity } = useExtrinsicCacheEntities();

  const { control, reset, handleSubmit, setValue, resetField } = useFormContext();

  const formValues = useWatch({ control });

  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress:
      selectedAccount && Address.is.ethereumAddressInAnyForm(selectedAccount?.address)
        ? Address.mirror.ethereumToSubstrate(selectedAccount.address)
        : selectedAccount?.address,
    options: defaultOptions,
  });
  const { data: collection } = useCollectionGetById(formValues.collectionId ?? 0);

  const { data: lastToken } = useCollectionGetLastTokenId(formValues.collectionId ?? 0);

  const isOldCollection = collection?.schema?.schemaName === '_old_';

  const tokenAttributes: AttributeView[] | undefined = useMemo(() => {
    const attrsSchema = collection?.schema?.attributesSchema;
    const formAttrs = formValues.attributes;

    if (!attrsSchema || !formAttrs?.length) {
      return [];
    }

    const attrs: AttributeView[] = [];

    for (let i = 0; i < formAttrs.length; i++) {
      let values: string[] = [];
      const attr = formAttrs[i];

      if (!attr) {
        continue;
      }

      if (Array.isArray(attr)) {
        values = attr.map((val) => val.title || '');
      } else if (typeof attr === 'string') {
        values = [attr];
      } else if (typeof attr === 'object') {
        values = [attr.title || ''];
      }

      attrs.push({ values, group: attrsSchema[i].name._ });
    }

    return attrs;
  }, [collection, formValues]);

  const collectionsOptions = useMemo(() => {
    const presetCollection = locationState as Pick<
      Collection,
      'collection_id' | 'collection_cover' | 'description' | 'name'
    >;
    const presetCollectionExists =
      collections.findIndex(
        ({ collection_id }) => collection_id === presetCollection?.collection_id,
      ) !== -1;
    return [
      ...(collections
        // filter NFT collections only until RFT minting is implemented
        ?.filter((collection) => collection.mode === TokenTypeEnum.NFT)
        .map<Option>((collection) => ({
          id: collection.collection_id,
          title: collection.name,
          description: collection.description,
          img: getTokenIpfsUriByImagePath(collection.collection_cover),
          tokensCount: collection.tokens_count,
          tokensLimit: collection.token_limit,
        })) ?? []),
      ...(presetCollection?.collection_id && !presetCollectionExists
        ? [
            {
              id: presetCollection.collection_id,
              title: presetCollection.name,
              description: presetCollection.description,
              img: getTokenIpfsUriByImagePath(presetCollection.collection_cover),
              tokensCount: 0,
            },
          ]
        : []),
    ];
  }, [collections, locationState]);

  useEffect(() => {
    const presetCollection = locationState as Pick<
      Collection,
      'collection_id' | 'collection_cover' | 'description' | 'name'
    >;
    if (presetCollection?.collection_id) {
      setValue('collectionId', presetCollection?.collection_id);
    }
  }, [locationState]);

  useEffect(() => {
    if (isOldCollection) {
      warning(config.oldCollectionMessage);
    }
  }, [collection]);

  useEffect(() => {
    if (!collection?.limits?.tokenLimit || !lastToken?.tokenId) {
      return;
    }
    if (collection.limits.tokenLimit <= lastToken.tokenId) {
      setIsReachedTokensLimitModalVisible(true);
    }
  }, [collection, lastToken]);

  useEffect(() => {
    const { address, collectionId } = debouncedFormValues;

    if (collectionId && address && isValid && !isOldCollection) {
      getFee(mapTokenForm(debouncedFormValues as FilledTokenForm));
    }
  }, [debouncedFormValues]);

  useEffect(() => {
    if (!accountsLength) {
      navigate(`/${currentChain.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
      return;
    }
    if (selectedAccount) {
      setValue('address', selectedAccount?.address);
      setValue('owner', selectedAccount?.address);
    }
  }, [selectedAccount, accountsLength]);

  const onSubmit = (tokenForm: TokenForm, closable?: boolean) => {
    if (isValid && selectedAccount) {
      logUserEvent(closable ? UserEvents.CONFIRM_CLOSE : UserEvents.CONFIRM_MORE);

      const payload = mapTokenForm(tokenForm as FilledTokenForm);

      submitWaitResult({
        payload: {
          ...payload,
          address: selectedAccount.address,
        },
      }).then((res) => {
        setPayloadEntity({
          type: 'create-token',
          entityData: payload,
          parsed: res?.parsed,
        });
        info('NFT created successfully');

        closable
          ? navigate(
              `/${currentChain?.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
            )
          : reset({ collectionId: payload.collectionId }, { keepDefaultValues: true });
      });
    }
  };

  const isolatedTokenForm = useMemo(
    () => (
      <CreateNftForm
        selectedCollection={collection}
        collectionsOptions={collectionsOptions}
        collectionsOptionsLoading={isCollectionsLoading}
      />
    ),
    [collection, collectionsOptions, isCollectionsLoading],
  );

  const renderSidebar = () => (
    <Sidebar
      hidden={!collection}
      collectionName={collection?.name}
      collectionDescription={collection?.description}
      collectionCoverUrl={collection?.schema?.coverPicture.fullUrl}
      tokenPrefix={collection?.tokenPrefix}
      tokenImageUrl={getTokenIpfsUriByImagePath(formValues?.imageIpfsCid)}
      attributes={tokenAttributes}
    />
  );

  const hasNoCollections = collectionsOptions.length === 0;
  const tooltip = isOldCollection
    ? config.oldCollectionMessage
    : hasNoCollections
    ? USER_HAS_NO_COLLECTION
    : validationMessage;
  const disableButtons =
    !isValid || feeLoading || !isSufficientBalance || isOldCollection;

  return (
    <>
      <MainWrapper className={classNames('create-nft-page', className)}>
        <WrapperContentStyled>
          <FormWrapper>
            {isolatedTokenForm}
            {isValid ? (
              <FeeInformationTransaction fee={feeFormatted} feeLoading={feeLoading} />
            ) : (
              <Alert type="warning">
                A fee will be calculated after corrected filling required fields
              </Alert>
            )}
            <ButtonGroup stack>
              <ConfirmBtn
                role="primary"
                title="Confirm and create more"
                disabled={disableButtons}
                tooltip={tooltip}
                onClick={handleSubmit((tokenForm) => onSubmit(tokenForm))}
              />
              <ConfirmBtn
                title="Confirm and close"
                disabled={disableButtons}
                tooltip={tooltip}
                onClick={handleSubmit((tokenForm) => onSubmit(tokenForm, true))}
              />
            </ButtonGroup>
          </FormWrapper>
        </WrapperContentStyled>
        {collection &&
          (deviceSize >= DeviceSize.lg ? (
            renderSidebar()
          ) : (
            <BottomBar
              buttons={[
                <Button
                  title="Preview"
                  key="toggleDrawer"
                  onClick={() => setDrawerOpen(true)}
                />,
              ]}
              isOpen={isDrawerOpen}
              parent={document.body}
            >
              {renderSidebar()}
              <ButtonsGroup>
                <Button
                  title="Back"
                  key="toggleDrawer"
                  onClick={() => setDrawerOpen(false)}
                />
              </ButtonsGroup>
            </BottomBar>
          ))}
      </MainWrapper>
      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Creating token"
      />
      <ReachedTokensLimitModal
        isVisible={isReachedTokensLimitModalVisible}
        onClose={() => {
          resetField('collectionId');
          setIsReachedTokensLimitModalVisible(false);
        }}
      />
    </>
  );
};

const CreateNFTForm = () => {
  const [params] = useSearchParams();
  const { selectedAccount } = useAccounts();
  const collectionId = params.get('collectionId');

  const tokenForm = useForm<TokenForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      owner: selectedAccount?.address,
      address: selectedAccount?.address,
      collectionId: collectionId ? Number(collectionId) : null,
    },
  });

  return (
    <FormProvider {...tokenForm}>
      <CreateNFTComponent />
    </FormProvider>
  );
};

export const CreateNFT = withPageTitle({
  header: 'Create a token',
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(CreateNFTForm);
