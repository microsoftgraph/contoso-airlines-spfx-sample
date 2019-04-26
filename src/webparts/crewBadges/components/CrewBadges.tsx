import * as React from 'react';
import styles from './CrewBadges.module.scss';
import { ICrewBadgesProps } from './ICrewBadgesProps';
import { ICrewBadgesState } from './ICrewBadgesState';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import CrewGroup from './CrewGroup';

export default class CrewBadges extends React.Component<ICrewBadgesProps, ICrewBadgesState> {

  constructor(props: ICrewBadgesProps) {
    super(props);

    this.state = {
      siteCompatible: true,
      pilots: [],
      flightAttendants: [],
      error: null
    };
  }

  public componentDidMount(): void {
    if (this.props.group) {
      this.props.graphClient
        .api(`/groups/${this.props.group._id._guid}/members`)
        .select('id,displayName,jobTitle')
        .get((error, membersResponse: any) => {
          if (error) {
            this.setState({
              error: error.message
            });

            return;
          }

          const members: MicrosoftGraph.User[] = membersResponse.value;
          var pilots: MicrosoftGraph.User[] = [];
          var flightAttendants: MicrosoftGraph.User[] = [];

          members.forEach((user, index) => {
            if (user.jobTitle === 'Pilot') {
              pilots.push(user);
            } else if (user.jobTitle === 'Flight Attendant') {
              flightAttendants.push(user);
            }
          });

          this.setState({
            pilots: pilots,
            flightAttendants: flightAttendants
          });
        });
    }
    else {
      this.setState({ siteCompatible: false });
    }
  }

  public render(): React.ReactElement<ICrewBadgesProps> {
    if (this.state.siteCompatible) {
      return (
        <div className={ styles.crewBadges }>
          <div className={ styles.container }>
            <CrewGroup users={this.state.pilots} groupName="Pilots" graphClient={this.props.graphClient}/>
            <CrewGroup users={this.state.flightAttendants} groupName="Flight Attendants" graphClient={this.props.graphClient}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={ styles.crewBadges }>
          <div className={ styles.container }>
            <div className={ styles.row }>
              <div className={ styles.column }>
                <span className={ styles.title }>This webpart requires a team site associated with a Microsoft 365 group.</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

  }
}
