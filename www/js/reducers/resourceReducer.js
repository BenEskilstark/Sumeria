
export const resourceReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_RESOURCES': {
      let {clientID, resources} = action;
      if (clientID == null) clientID = state.clientID;
      for (const key in resources) {
        state.playerResources[clientID][key] += resources[key];
      }
      return state;
    }
    case 'UPDATE_RESOURCES': {
      let {clientID, resources} = action;
      if (clientID == null) clientID = state.clientID;
      state.playerResources[clientID] = {
        ...state.playerResources[clientID],
        ...update,
      };
      return state;
    }
  }
  return state;
}


export const spendResources = (state, {cost}, clientID) => {
  const resources = {};
  for (const key in cost) {
    resources[key] = -1 * cost[key];
  }
  return resourceReducer(state, {
    type: 'ADD_RESOURCES', clientID, resources,
  });
}


export const gainResources = (state, {benefit}, clientID) => {
  return resourceReducer(state, {
    type: 'ADD_RESOURCES', clientID, resources: benefit,
  });
}
