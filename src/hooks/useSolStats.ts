import useSWR from "swr";

type SolStats = {
  nbValidators: number | undefined;
  networkApy: number | undefined;
  supplyStakedPercent: number | undefined;
  solPrice: number | undefined;
  isLoading: boolean;
  isError: boolean;
};

const useSolStats = (): SolStats => {
  const { data, error, isLoading } = useSWR("/v1/sol/network-stats");

  return {
    nbValidators: data?.data?.nb_validators,
    networkApy: data?.data?.network_gross_apy,
    supplyStakedPercent: data?.data?.supply_staked_percent,
    solPrice: data?.data?.sol_price_usd,
    isLoading,
    isError: Boolean(error),
  };
};

export default useSolStats;
