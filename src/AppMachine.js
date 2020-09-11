import { createMachine, assign } from "xstate";

export const appMachine = createMachine(
  {
    id: "appMachine",
    initial: "initialising",
    context: {
      data: null
    },
    on: {
      DATA_RECEIVED: {
        actions: "updateData"
      }
    },
    states: {
      initialising: {
        on: {
          DATA_RECEIVED: {
            actions: "updateData",
            target: "ready"
          }
        }
      },
      ready: {}
    }
  },
  {
    actions: {
      updateData: assign({
        data: (_, event) => event.data
      })
    }
  }
);
