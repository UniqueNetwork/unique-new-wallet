import { Heading, Typography } from '@app/components';
import { FormBody, FormHeader } from '@app/pages/components/FormComponents';

import { AttributesTable } from './AttributesTable';

export const NFTAttributes = () => {
  return (
    <>
      <FormHeader>
        <Heading size="2">Token attributes</Heading>
        <Typography>
          Customize your token — define your NFTs traits: name, accessory, gender,
          background, face, body, tier, etc.
        </Typography>
      </FormHeader>
      <FormBody>
        <AttributesTable />
      </FormBody>
    </>
  );
};
