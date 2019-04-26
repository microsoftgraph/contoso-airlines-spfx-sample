import * as React from 'react';
import styles from './CrewGroup.module.scss';
import { ICrewGroupProps } from './ICrewGroupProps';
import { ICrewGroupState } from './ICrewGroupState';
import { Stack } from 'office-ui-fabric-react/lib/components/Stack';

import CrewMemberCard from './CrewMemberCard';

export default class CrewGroup extends React.Component<ICrewGroupProps, ICrewGroupState> {

  constructor(props: ICrewGroupProps) {
    super(props);
  }

  public render(): React.ReactElement<ICrewGroupProps> {
    return (
      <Stack className={ styles.crewGroup }>
        <h2 className= { styles.groupName }>{this.props.groupName}</h2>
        {this.props.users.map((user) =>{
          return (
            <CrewMemberCard user={user} graphClient={this.props.graphClient} />
          );
        })}
      </Stack>
    );
  }
}