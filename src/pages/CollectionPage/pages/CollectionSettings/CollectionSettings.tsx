import { useCallback, useEffect } from 'react';

import { PagePaper, Heading, Loader } from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import {
  Form,
  FormBody,
  FormHeader,
  FormRow,
  FormWrapper,
} from '@app/pages/components/FormComponents';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { DeviceSize, useDeviceSize } from '@app/hooks';

import { NestingPermissions } from './components/NestingPermissions';
import { Sponsorship } from './components/Sponsorship';
import { Limits } from './components/Limits';
import { BurningPermission } from './components/BurningPermission';

const CollectionSettings = () => {
  const deviseSize = useDeviceSize();
  const { collectionLoading, refetchSettings } = useCollectionContext() || {};
  useEffect(() => {
    logUserEvent(UserEvents.SETTINGS_OF_COLLECTION);
  }, []);

  const onComplite = useCallback(async () => {
    await refetchSettings?.();
  }, [refetchSettings]);

  return (
    <PagePaper noPadding={deviseSize <= DeviceSize.md}>
      <FormWrapper>
        {collectionLoading ? (
          <Loader />
        ) : (
          <>
            <FormHeader>
              <Heading size="3">Advanced settings</Heading>
            </FormHeader>
            <FormBody>
              <Form>
                <NestingPermissions onComplete={onComplite} />
                <FormRow>
                  <Heading size="3">Marketplace related settings</Heading>
                </FormRow>
                <Sponsorship onComplete={onComplite} />
                <Limits onComplete={onComplite} />
                <BurningPermission onComplete={onComplite} />
              </Form>
            </FormBody>
          </>
        )}
      </FormWrapper>
    </PagePaper>
  );
};

export default CollectionSettings;
