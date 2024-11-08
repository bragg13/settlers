import { Road, Spot } from '@settlers/shared';
import { Socket } from 'socket.io';

export function bfs_spots(
  settlementsBuiltByPlayer: Array<Spot>,
  spots: Map<Spot['id'], Spot>,
  roads: Map<Road['id'], Road>,
  player: Socket['id']
): Array<Spot> {
  const availableSpots = [];
  for (const town of settlementsBuiltByPlayer) {
    const queue: Array<Spot['id']> = [];
    const explored = {};
    explored[town.id] = true;
    queue.push(town.id);

    while (queue.length > 0) {
      const t: Spot['id'] = queue.pop();
      explored[t] = true;

      // check the town
      if (spots[t].owner === null) availableSpots.push(t);

      // check adjacents
      for (const adj of Object.keys(roads[t])) {
        if (!explored[adj]) {
          // se la strada è mia -> queue
          if (roads[t][adj].owner === player) {
            queue.push(parseInt(adj));
          }
        }
      }
    }
  }
  return availableSpots;
}

export function bfs_roads(
  settlementsBuiltByPlayer: Array<Spot>,
  spots: Map<Spot['id'], Spot>,
  roads: {
    [from: Spot['id']]: {
      [to: Spot['id']]: Road;
    };
  },
  player: Socket['id']
): Array<Road> {
  const availableRoads = [];
  for (const town of settlementsBuiltByPlayer) {
    const queue: Array<Spot['id']> = [];
    const explored = {};
    explored[town.id] = true;
    queue.push(town.id);

    while (queue.length > 0) {
      const t: Spot['id'] = queue.pop();
      explored[t] = true;

      // check adjacents
      for (const adj of Object.keys(roads[t])) {
        if (!explored[adj]) {
          // se la strada è libera -> available
          if (roads[t][adj].owner === null) {
            availableRoads.push({
              ...roads[t][adj],
            });
          }

          // se la strada e' mia -> queue
          if (roads[t][adj].owner === player) {
            queue.push(parseInt(adj));
          }
        }
      }
    }
  }
  return availableRoads;
}
