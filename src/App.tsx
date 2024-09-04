import SolStakingWidgetWrapper from "./components/SOL/SolStakingWidgetWrapper.tsx";
import SolContextProvider from "./components/SOL/SolContext.tsx";
import { SWRConfig } from "swr";
import { swrFetcher } from "./api.ts";

function App() {
  return (
    <div className="max-w-md mx-auto my-12 p-4 laptop:p-0">
      <SWRConfig value={{ fetcher: swrFetcher }}>
        <SolContextProvider>
          <SolStakingWidgetWrapper />
        </SolContextProvider>
      </SWRConfig>
    </div>
  )
}

export default App
