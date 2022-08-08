import { useCallback, useContext, useEffect, useMemo, useState, VFC } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, useNotifications } from '@unique-nft/ui-kit';
import { useDebounce } from 'use-debounce';
import styled from 'styled-components';
import classNames from 'classnames';

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

import { Option, TokenForm } from './types';
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
    formState: { isValid },
  } = tokenForm;

  // const { replace } = useFieldArray({ name: 'attributes', control: control as any });

  const formValues = useWatch({ control });
  const [debouncedFormValues] = useDebounce(formValues, 500);

  // TODO - use searchOnType here
  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: defaultOptions,
  });
  const { data: collection } = useCollectionQuery(formValues.collectionId ?? 0);

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
    if (debouncedFormValues?.collectionId && isValid) {
      console.log(debouncedFormValues);

      getFee({ token: mapper(debouncedFormValues as TokenForm) });
    }
  }, [debouncedFormValues, isValid]);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('NFT created successfully');

      closable && navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`);
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
    if (closable) {
      logUserEvent(UserEvents.CONFIRM_CLOSE);
    } else {
      logUserEvent(UserEvents.CONFIRM_MORE);
    }

    setClosable(!!closable);

    signAndSubmitExtrinsic({
      token: mapper(debouncedFormValues as TokenForm),
    });
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
            {feeFormatted && (
              <Alert className="alert" type="warning">
                A fee of ~ {feeFormatted} can be applied to the transaction
              </Alert>
            )}
            <ButtonGroup className="buttons">
              <MintingBtn
                role="primary"
                title="Confirm and create more"
                // tooltip={isBalanceInsufficient ? NO_BALANCE_MESSAGE : undefined}
                disabled={!isValid}
                onClick={() => confirmFormHandler()}
              />
              <MintingBtn
                title="Confirm and close"
                // tooltip={isBalanceInsufficient ? NO_BALANCE_MESSAGE : undefined}
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
        />
      </MainWrapper>
      <StatusTransactionModal isVisible={isFlowLoading} description="Creating NFT" />
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
