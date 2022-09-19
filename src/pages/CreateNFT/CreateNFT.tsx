import { useEffect, useMemo, useState, VFC } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, useNotifications } from '@unique-nft/ui-kit';
import { useDebounce } from 'use-debounce';
import styled from 'styled-components';
import classNames from 'classnames';

import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { TokenApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';
import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';
import { MintingBtn, StatusTransactionModal } from '@app/components';
import {
  DeviceSize,
  useAccounts,
  useApi,
  useBalanceInsufficient,
  useDeviceSize,
} from '@app/hooks';
import { NO_BALANCE_MESSAGE } from '@app/pages';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { config } from '@app/config';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { PreviewBar } from '@app/pages/components/PreviewBar';
import { ButtonGroup, FormWrapper } from '@app/pages/components/FormComponents';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { Sidebar } from '@app/pages/CreateNFT/Sidebar';

import { CreateNftForm } from './CreateNftForm';
import { useTokenFormMapper } from './useTokenFormMapper';
import { AttributeView, FilledTokenForm, Option, TokenForm } from './types';

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

export const CreateNFTComponent: VFC<ICreateNFTProps> = ({ className }) => {
  const deviceSize = useDeviceSize();
  const [closable, setClosable] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { currentChain } = useApi();
  const { selectedAccount } = useAccounts();
  const { error, warning, info } = useNotifications();
  const mapper = useTokenFormMapper();

  const { getFee, fee, feeFormatted, feeError, isFeeError } = useExtrinsicFee(
    TokenApiService.tokenCreateMutation,
  );
  const { flowStatus, flowError, isFlowLoading, signAndSubmitExtrinsic } =
    useExtrinsicFlow(TokenApiService.tokenCreateMutation, 'create-token');

  const { isBalanceInsufficient } = useBalanceInsufficient(selectedAccount?.address, fee);

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

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = tokenForm;

  const formValues = useWatch({ control });
  const [debouncedFormValues] = useDebounce(formValues, 500);

  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: defaultOptions,
  });
  const { data: collection } = useCollectionQuery(formValues.collectionId ?? 0);

  const isOldCollection = collection?.schema?.schemaName === '_old_';

  const mintingButtonTooltip = (() => {
    if (isBalanceInsufficient) {
      return NO_BALANCE_MESSAGE;
    }
    if (isOldCollection) {
      return config.oldCollectionMessage;
    }

    return undefined;
  })();

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

  const collectionsOptions = useMemo(
    () =>
      collections?.map<Option>((collection) => ({
        id: collection.collection_id,
        title: collection.name,
        description: collection.description,
        img: getTokenIpfsUriByImagePath(collection.collection_cover),
      })) ?? [],
    [collections],
  );

  useEffect(() => {
    if (isOldCollection) {
      warning(config.oldCollectionMessage);
    }
  }, [collection]);

  useEffect(() => {
    const { address, collectionId } = debouncedFormValues;

    if (collectionId && address && isValid && !isOldCollection) {
      getFee({ payload: mapper(debouncedFormValues as FilledTokenForm) });
    }
  }, [debouncedFormValues]);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('NFT created successfully');

      closable
        ? navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`)
        : reset(undefined, { keepDefaultValues: true });
    }

    if (flowStatus === 'error') {
      error(flowError?.message);
    }
  }, [flowStatus]);

  useEffect(() => {
    if (isFeeError) {
      error(feeError?.message);
    }
  }, [isFeeError]);

  const onSubmit = (tokenForm: TokenForm, closable?: boolean) => {
    if (isValid) {
      logUserEvent(closable ? UserEvents.CONFIRM_CLOSE : UserEvents.CONFIRM_MORE);

      setClosable(!!closable);

      signAndSubmitExtrinsic({
        payload: mapper(tokenForm as FilledTokenForm),
      });
    }
  };

  const isolatedTokenForm = useMemo(
    () => (
      <FormProvider {...tokenForm}>
        <CreateNftForm
          selectedCollection={collection}
          collectionsOptions={collectionsOptions}
          collectionsOptionsLoading={isCollectionsLoading}
        />
      </FormProvider>
    ),
    [collection, collectionsOptions, isCollectionsLoading, tokenForm],
  );

  const root = document.getElementById('root');
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

  return (
    <>
      <MainWrapper className={classNames('create-nft-page', className)}>
        <WrapperContentStyled>
          <FormWrapper>
            {isolatedTokenForm}
            {feeFormatted && isValid ? (
              <FeeInformationTransaction fee={feeFormatted} />
            ) : (
              <Alert type="warning">
                A fee will be calculated after corrected filling required fields
              </Alert>
            )}
            <ButtonGroup>
              <MintingBtn
                role="primary"
                title="Confirm and create more"
                tooltip={mintingButtonTooltip}
                disabled={!isValid || isBalanceInsufficient || isOldCollection}
                onClick={handleSubmit((tokenForm) => onSubmit(tokenForm))}
              />
              <MintingBtn
                title="Confirm and close"
                tooltip={mintingButtonTooltip}
                disabled={!isValid || isBalanceInsufficient || isOldCollection}
                onClick={handleSubmit((tokenForm) => onSubmit(tokenForm, true))}
              />
            </ButtonGroup>
          </FormWrapper>
        </WrapperContentStyled>
        {collection &&
          (deviceSize >= DeviceSize.lg ? (
            renderSidebar()
          ) : (
            <PreviewBar
              buttons={[
                <Button
                  title={isDrawerOpen ? 'Back' : 'Preview'}
                  key="toggleDrawer"
                  onClick={() => setDrawerOpen(!isDrawerOpen)}
                />,
              ]}
              isOpen={isDrawerOpen}
              parent={root as Element}
            >
              {renderSidebar()}
            </PreviewBar>
          ))}
      </MainWrapper>
      <StatusTransactionModal isVisible={isFlowLoading} description="Creating NFT" />
    </>
  );
};

export const CreateNFT = withPageTitle({
  header: 'Create a NFT',
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(CreateNFTComponent);
