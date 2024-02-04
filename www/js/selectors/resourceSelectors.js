
export const canAfford = (state, {cost}) => {
  if (state.free) return true;

  const resources = state.playerResources[state.clientID];
  for (const key in cost) {
    if (resources[key] < cost[key]) {
      return false;
    }
  }
  return true;
}
