import './Welcome.scss';
import { AccountsGroupButton } from '../AccountsGroupButton';

type Props = {
  fetchAccounts: () => Promise<void>;
};

const Welcome = ({ fetchAccounts }: Props) => {
  return (
    <div className='unique-card welcome'>
      <h1 className='header-text'>Welcome to Unique network</h1>
      <div className='description'>
        <p className='text'>
          You need to connect a substrate account to use all the features.
        </p>
        <p className='text'>Please select one of the options:</p>
      </div>
      <AccountsGroupButton onClick={fetchAccounts} />
    </div>
  );
};

export default Welcome;
