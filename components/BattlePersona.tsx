import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Enemy } from '../database/enemies';
import { Ally } from '../database/party';
import ActionControls from './ActionControls';
import { ActionToPerform } from './Battle';
import { PlayerInventory } from './structures/DomBasedComponent';
import TimedBar from './TimedBar';

export type Persona = Enemy | Ally;

export type Foes<T, O> = {
  friendly: T[];
  unfriendly: O[];
};

type Props<T, O> = {
  persona: T;
  setActionArr: Dispatch<SetStateAction<ActionToPerform<Persona>[]>>;
  actionArr: ActionToPerform<Persona>[];
  foeOptions: Foes<T, O>;
  allyActionQueue?: number[];
  setAllyActionQueue?: Dispatch<SetStateAction<number[]>>;
  inventory?: [PlayerInventory, Dispatch<SetStateAction<PlayerInventory>>];
};

export default function BattlePersona<T extends Persona, O extends Persona>({
  persona,
  setActionArr,
  actionArr,
  foeOptions,
  allyActionQueue,
  setAllyActionQueue,
  inventory,
}: Props<T, O>) {
  const [isGettingReady, setIsGettingReady] = useState(true);
  const [isSelectingAction, setIsSelectingAction] = useState(false);
  const [loadActionBeginTime, setLoadActionBeginTime] = useState(+Date.now());

  const loadActionEndTime =
    loadActionBeginTime + 8000 - persona.stats.speed * 1000;

  useEffect(() => {
    // if the id is not in the actionArr, is not selecting action and have no action bar loading
    if (
      !actionArr.some((action) => action.performer.id === persona.id) &&
      !isSelectingAction &&
      !isGettingReady
    ) {
      setLoadActionBeginTime(+Date.now());
      setIsGettingReady(true);
    }
  }, [actionArr, isGettingReady, isSelectingAction, persona.id]);

  useEffect(() => {
    // useEffect needed to make sure the getting ready state happen after isSelectingAction is true to avoid weird bugs in the action queue array
    if (isSelectingAction) {
      setIsGettingReady(false);
    }
  }, [isSelectingAction]);

  return (
    <div>
      {isGettingReady
        ? ''
        : isSelectingAction
        ? 'Thinking...'
        : 'ready to attack...'}
      {isGettingReady ? (
        <TimedBar
          endTime={loadActionEndTime}
          startTime={loadActionBeginTime}
          callback={() => {
            setIsSelectingAction(true);
            if (setAllyActionQueue) {
              setAllyActionQueue((current) => [...current, persona.id]);
            }
          }}
        />
      ) : (
        ''
      )}
      <br />
      {isSelectingAction ? (
        <ActionControls
          setIsSelectingAction={setIsSelectingAction}
          setActionArr={setActionArr}
          persona={persona}
          foeOptions={foeOptions}
          allyActionQueue={allyActionQueue}
          setAllyActionQueue={setAllyActionQueue}
          inventory={inventory}
        />
      ) : (
        ''
      )}
    </div>
  );
}
