import React, { useEffect } from "react";
import "./styles.css";

import { useQuery } from "react-query";
import { useMachine } from "@xstate/react";

import { loadData } from "./loader";
import { appMachine } from "./AppMachine";

export default function App() {
  const { status, data } = useQuery("myQueryKey", loadData);

  useEffect(() => {
    if (status === "success") {
      sendToMachine("DATA_RECEIVED", { data });
    }
  }, [status, data]);

  const [machineState, sendToMachine] = useMachine(appMachine);

  return (
    <div className="App">
      {machineState.matches("initialising") && (
        <div id="loadingIndicator">data loading...</div>
      )}
      {machineState.matches("ready") && (
        <div id="data">{machineState.context.data}</div>
      )}
      <p>
        status: {status}; machineState: {machineState.value}
      </p>
    </div>
  );
}
