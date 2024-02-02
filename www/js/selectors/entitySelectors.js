
export const getEntitiesAtPos = ({entities}, {x, y}) => {
  const entitiesAtPos = [];
  for (const entityID in entities) {
    const entity = entities[entityID];
    if (entity.x == x && entity.y == y) {
      entitiesAtPos.push(entity);
    }
  }
  return entitiesAtPos;
}
