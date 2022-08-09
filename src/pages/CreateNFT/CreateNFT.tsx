import { useCallback, useContext, useEffect, useMemo, useState, VFC } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, useNotifications } from '@unique-nft/ui-kit';
import { useDebounce } from 'use-debounce';
import styled from 'styled-components';
import classNames from 'classnames';
import { DevTool } from '@hookform/devtools';

import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { Collection, TokenApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';
import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';
import {
  Alert,
  MintingBtn,
  StatusTransactionModal,
  TooltipButtonWrapper,
} from '@app/components';
import { usePageSettingContext } from '@app/context';
import { useAccounts, useApi, useBalanceInsufficient } from '@app/hooks';
import { NO_BALANCE_MESSAGE } from '@app/pages';
import { ButtonGroup, FormWrapper } from '@app/pages/components/FormComponents';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { Sidebar } from '@app/pages/CreateNFT/Sidebar';
import { ROUTE } from '@app/routes';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

import { AttributeView, Option, TokenForm } from './types';
import { CreateNftForm } from './CreateNftForm';
import { useTokenFormMapper } from './useTokenFormMapper';

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

export const CreateNFTComponent: VFC<ICreateNFTProps> = ({ className }) => {
  const [closable, setClosable] = useState(false);
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();

  const navigate = useNavigate();
  const { currentChain } = useApi();
  const { selectedAccount } = useAccounts();
  const { error, info } = useNotifications();
  const mapper = useTokenFormMapper();

  const { getFee, fee, feeFormatted, feeError, isFeeError } = useExtrinsicFee(
    TokenApiService.tokenCreateMutation,
  );
  const { flowStatus, flowError, isFlowLoading, signAndSubmitExtrinsic } =
    useExtrinsicFlow(TokenApiService.tokenCreateMutation);

  const { isBalanceInsufficient } = useBalanceInsufficient(selectedAccount?.address, fee);
  const tokenForm = useForm<TokenForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      owner: selectedAccount?.address,
      address: selectedAccount?.address,
    },
  });

  const {
    control,
    reset,
    formState: { isValid },
  } = tokenForm;

  const formValues = useWatch({ control });
  const [debouncedFormValues] = useDebounce(formValues, 500);
  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: defaultOptions,
  });
  const { data: collection } = useCollectionQuery(formValues.collectionId ?? 0);

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
      collections?.map<Option>((collection: Collection) => ({
        id: collection.collection_id,
        title: collection.name,
        description: collection.description,
        img: getTokenIpfsUriByImagePath(collection.collection_cover),
      })) ?? [],
    [collections],
  );

  useEffect(() => {
    setPageBreadcrumbs({ options: [] });
    setPageHeading('Create a NFT');
  }, []);

  useEffect(() => {
    const { address, collectionId } = debouncedFormValues;

    if (collectionId && address && isValid) {
      getFee({ token: mapper(debouncedFormValues as Required<TokenForm>) });
    }
  }, [debouncedFormValues]);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('NFT created successfully');

      closable ? navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`) : reset();
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

  const confirmFormHandler = (closable?: boolean) => {
    const { address, collectionId } = debouncedFormValues;

    if (address && collectionId && isValid) {
      logUserEvent(closable ? UserEvents.CONFIRM_CLOSE : UserEvents.CONFIRM_MORE);

      setClosable(!!closable);

      signAndSubmitExtrinsic({
        token: mapper(debouncedFormValues as Required<TokenForm>),
      });
    }
  };

  return (
    <>
      <MainWrapper className={classNames('create-nft-page', className)}>
        <WrapperContent>
          <FormWrapper>
            <FormProvider {...tokenForm}>
              <CreateNftForm
                selectedCollection={collection}
                collectionsOptions={collectionsOptions}
                collectionsOptionsLoading={isCollectionsLoading}
              />
            </FormProvider>
            <Alert className="alert" type="warning">
              {isValid
                ? `A fee of ~ ${feeFormatted} can be applied to the transaction`
                : 'A fee will be calculated after corrected filling required fields'}
            </Alert>
            <ButtonGroup className="buttons">
              <MintingBtn
                role="primary"
                title="Confirm and create more"
                tooltip={isBalanceInsufficient ? NO_BALANCE_MESSAGE : undefined}
                disabled={!isValid}
                onClick={() => confirmFormHandler()}
              />
              <MintingBtn
                title="Confirm and close"
                tooltip={isBalanceInsufficient ? NO_BALANCE_MESSAGE : undefined}
                disabled={!isValid}
                onClick={() => confirmFormHandler(true)}
              />
            </ButtonGroup>
          </FormWrapper>
        </WrapperContent>
        <Sidebar
          hidden={!collection}
          collectionName={collection?.name}
          collectionDescription={collection?.description}
          collectionCoverUrl={collection?.schema?.coverPicture.fullUrl}
          tokenPrefix={collection?.tokenPrefix}
          tokenImageUrl={getTokenIpfsUriByImagePath(formValues?.imageIpfsCid || null)}
          attributes={tokenAttributes}
        />
      </MainWrapper>
      <StatusTransactionModal isVisible={isFlowLoading} description="Creating NFT" />
      <DevTool control={control} />
    </>
  );
};

export const CreateNFT = styled(CreateNFTComponent)`
  .alert {
    margin-top: 32px;
  }

  .buttons {
    margin-top: 32px;
  }
`;
