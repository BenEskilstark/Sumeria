
export const getEntitiesAtPos = ({entities}, {x, y}) => {
  const entitiesAtPos = [];
  for (const entityID in entities) {
    const entity = entities[entityID];
    if (entity.x == x && entity.y == y) {
      entitiesAtPos.push(entity);
      if (!entity.id) entity.id = entityID; // HACK
    }
  }
  return entitiesAtPos;
}


export const getNeighborEntities = ({entities, topo}, {x, y}) => {
  const neighborEntities = [];
  topo.getNeighbors({x,y})
    .forEach(c => {
      neighborEntities.push(...getEntitiesAtPos({entities}, c));
    });
  return neighborEntities;
}


export const getEntitiesByType = (state, entityType) => {
  const byType = [];
  for (const entityID in state.entities) {
    const entity = state.entities[entityID];
    if (entity.type == entityType) {
      byType.push(entity);
      if (!entity.id) entity.id = entityID; // HACK
    }
  }
  return byType;
}
