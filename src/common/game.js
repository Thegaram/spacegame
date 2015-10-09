/* @flow */

import {
  add,
  sub,
  rotate,
  multiply,
  unit,
  cross,
} from './util/vector';

function advanceShip(ship: Ship): Ship {
  const force = ship.thrusters.reduce((force, thruster) => {
    return add(force, multiply(unit(thruster.orientation), thruster.strength));
  }, { x: 0, y: 0 });
  const torqe = ship.thrusters.reduce((momentum, thruster) => {
    return momentum + cross(thruster.position, multiply(unit(thruster.orientation), thruster.strength));
  }, 0);
  const rotation = ship.rotation + torqe;
  const orientation = ship.orientation + rotation;
  const velocity = add(ship.velocity, rotate(force, orientation));
  const position = add(ship.position, velocity);
  return {
    ...ship,
    velocity,
    position,
    rotation,
    orientation,
  };
}

function advanceProjectile(projectile: Projectile): Projectile {
  const position = add(projectile.position, projectile.velocity);
  return {
    ...projectile,
    position,
  };
}

/**
 * Update ship with the specific index with the given modifications
 */
function updateShip(ships: Array<Ship>, index: number, modification: any): Array<Ship> {
  return ships.slice(0, index - 1).concat(
    [{ ...ships[index], ...modification }],
    ships.slice(index + 1)
  );
};

function updateThruster(thrusters: Array<Thruster>, index: number, modification: any): Array<Thruster> {
  return thrusters.slice(0, index).concat(
    [{ ...thrusters[index], ...modification }],
    thrusters.slice(index + 1)
  );
};

export default function reduce(state: State, action: Action): State {
  state = state || {
    ships: [],
    projectiles: [],
  };
  switch (action.type) {
    case 'TICK':
    return {
      ships: state.ships.map(advanceShip),
      projectiles: state.projectiles.map(advanceProjectile),
    };
    case 'SET_THRUSTER_STRENGTH':
    return {
      projectiles: state.projectiles,
      ships: updateShip(
        state.ships,
        action.payload.shipIndex, {
          thrusters: updateThruster(
            state.ships[action.payload.shipIndex].thrusters,
            action.payload.thrusterIndex, {
              strength: action.payload.strength,
            }
          )
        }
      ),
    };
    case 'SYNC_STATE':
    return action.payload;
  }
  return state;
}
