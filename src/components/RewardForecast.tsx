type Props = {
  className?: string;
  token_name: string;
  token_daily_rewards: string;
  token_monthly_rewards: string;
  token_yearly_rewards: string;
  fiat_daily_rewards: string;
  fiat_monthly_rewards: string;
  fiat_yearly_rewards: string;
};

const RewardForecast = ({
  className = "",
  token_name,
  token_daily_rewards,
  token_monthly_rewards,
  token_yearly_rewards,
  fiat_daily_rewards,
  fiat_monthly_rewards,
  fiat_yearly_rewards,
}: Props) => {
  return (
    <div className={`my-5 px-4 ${className}`} data-test="reward-forecast">
      <span className="text-sm font-semibold text-black">Estimated Rewards</span>
      <div className="flex items-center justify-between gap-x-2 border-b border-gray-300 py-4">
        <span className="text-small-1 w-1/3 text-gray-700">Daily</span>
        <span className="text-body-2 w-1/3 flex-shrink-0 break-all text-right text-black">
          {token_daily_rewards} <span className="whitespace-nowrap">{token_name}</span>
        </span>
        <span className="text-body-2 w-1/3 flex-shrink-0 break-all text-right text-black">{fiat_daily_rewards}</span>
      </div>
      <div className="flex items-center justify-between gap-x-2 border-b border-gray-300 py-4">
        <span className="text-small-1 w-1/3 text-gray-700">Monthly</span>
        <span className="text-body-2 w-1/3 flex-shrink-0 break-all text-right text-black">
          {token_monthly_rewards} <span className="whitespace-nowrap">{token_name}</span>
        </span>
        <span className="text-body-2 w-1/3 flex-shrink-0 break-all text-right text-black">{fiat_monthly_rewards}</span>
      </div>
      <div className="flex items-center justify-between gap-x-2 pt-4">
        <span className="text-small-1 w-1/3 text-gray-700">Yearly</span>
        <span className="text-body-2 w-1/3 flex-shrink-0 break-all text-right text-black">
          {token_yearly_rewards} <span className="whitespace-nowrap">{token_name}</span>
        </span>
        <span className="text-body-2 w-1/3 flex-shrink-0 break-all text-right text-black">{fiat_yearly_rewards}</span>
      </div>
    </div>
  );
};

export default RewardForecast;
