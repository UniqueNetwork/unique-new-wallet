import { Heading, Modal, Loader } from '@unique-nft/ui-kit';

export const LoadingBurnCollection = () => (
  <Modal isVisible={true}>
    <Heading>Please wait</Heading>
    <Loader label={'Burning collection'} />
  </Modal>
);
