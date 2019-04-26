import * as React from 'react';
import styles from './CrewMemberCard.module.scss';
import { ICrewMemberCardProps } from './ICrewMemberCardProps';
import { ICrewMemberCardState } from './ICrewMemberCardState';
import {
  Persona,
  PersonaSize,
  IPersonaProps
} from 'office-ui-fabric-react/lib/components/Persona';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import { HoverCard, IPlainCardProps, HoverCardType } from 'office-ui-fabric-react/lib/HoverCard';
import { DirectionalHint } from 'office-ui-fabric-react/lib/common/DirectionalHint';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Shimmer, ShimmerElementType, ShimmerElementsGroup } from 'office-ui-fabric-react/lib/Shimmer';
import { ICrewBadge } from '../../../models/ICrewBadge';
import { IBadgeStatus } from '../../../models/IBadgeStatus';

export default class CrewMemberCard extends React.Component<ICrewMemberCardProps, ICrewMemberCardState> {

  constructor(props: ICrewMemberCardProps) {
    super(props);

    this.state = {
      isBadgeDataLoaded: false,
      isPhotoLoaded: false,
      photo: null,
      statusBadges: [],
      progressBadges: [],
      error: null
    };
  }

  public componentDidMount(): void {
    if (this.props.user) {
      this.props.graphClient
        .api(`/users/${this.props.user.id}/extensions/com.contoso.badgeData`)
        .get((error, badgeData: any) => {
          if (error) {
            if (error.statusCode !== 404) {
              this.setState({
                isBadgeDataLoaded: true,
                error: error.message
              });
            }
            return;
          }

          let statusBadges: string[]  = badgeData.statusBadges;
          let progressBadges: ICrewBadge [] = badgeData.progressBadges;

          this.setState({
            isBadgeDataLoaded: true,
            statusBadges: statusBadges,
            progressBadges: progressBadges
          });
        });

      this.props.graphClient
        .api(`/users/${this.props.user.id}/photo/$value`)
        .responseType('blob')
        .get((error, photoResponse) => {
          if (error) {
            if (error.statusCode !== 404) {
              this.setState({
                isPhotoLoaded: true,
                error: error.message
              });
            }
            return;
          }

          const photoUrl = window.URL.createObjectURL(photoResponse);
          this.setState({
            isPhotoLoaded: true,
            photo: photoUrl
          });
        });
    }
  }

  public render(): React.ReactElement<ICrewMemberCardProps> {
    let user = this.props.user;

    if (this.state.error) {
      return (
        <div>{this.state.error}</div>
      );
    } else if (user) {
      return (
        <Shimmer
          className={ styles.crewMemberCard }
          isDataLoaded={this.state.isBadgeDataLoaded && this.state.isPhotoLoaded}
          width={660}
          customElementsGroup={this._getCustomShimmerElements()}>
          <Persona
              text={user.displayName}
              secondaryText={user.jobTitle}
              onRenderSecondaryText={this._onRenderSecondaryText}
              onRenderTertiaryText={this._onRenderTertiaryText}
              imageUrl={this.state.photo}
              size={PersonaSize.size100} />
        </Shimmer>
      );
    }

    return (<div>Loading...</div>);
  }

  private _onRenderSecondaryText = (props: IPersonaProps): React.ReactElement<IPersonaProps> => {
    return (
      <div className={ styles.titleRow }>
        <span>{props.secondaryText}</span>
        {this.state.statusBadges.map((badgeName) => {
          return (
            <Icon
              iconName={this._getIconName(badgeName)}
              className={ styles.statusIcon } />
          );
        })}
      </div>
    );
  }

  private _onRenderTertiaryText = (props: IPersonaProps): React.ReactElement<IPersonaProps> => {
    return (
      <div>
        {this.state.progressBadges.map((badge) => {
          let status = this._getBadgeStatus(badge);
          const cardProps: IPlainCardProps = {
            onRenderPlainCard: this._onRenderHoverCard,
            directionalHint: DirectionalHint.topLeftEdge,
            renderData: status
          };

          return (
            <HoverCard type={HoverCardType.plain} plainCardProps={cardProps}>
              <div className={ `${styles.badge} ${status.level}` }>
                <Icon iconName={this._getIconName(badge.name)} />
              </div>
            </HoverCard>
          );
        })}
      </div>
    );
  }

  private _onRenderHoverCard(badgeStatus: IBadgeStatus): React.ReactElement<IPlainCardProps> {
    return (
      <Stack className={ styles.badgeInfo }>
        <div className={ styles.badgeDescription }>{badgeStatus.description}</div>
        <div className={ styles.badgeProgress }>{badgeStatus.progress}</div>
      </Stack>
    );
  }

  private _getIconName(badgeName: string): string {
    switch(badgeName) {
      case 'first-aid':
        return 'Hospital';
      case 'team-lead':
        return 'PartyLeader';
      case 'trainer':
        return 'Education';
      case 'drinks-served':
        return 'Cafe';
      case 'customer-kudos':
        return 'Like';
      case 'flights':
        return 'Airplane';
      case 'on-time':
        return 'Clock';
      default:
        return '';
    }
  }

  private _getTooltip(badgeName: string): string {
    switch(badgeName) {
      case 'first-aid':
        return 'First Aid Certification';
      case 'team-lead':
        return 'Team Leader';
      case 'trainer':
        return 'Trainer';
      case 'drinks-served':
        return 'Number of drinks served (FY)';
      case 'customer-kudos':
        return 'Number of customer compliments (FY)';
      case 'flights':
        return 'Number of flights (FY)';
      case 'on-time':
        return 'Number of on-time flights (FY)';
      default:
        return '';
    }
  }

  private _getBadgeStatus(badge: ICrewBadge): IBadgeStatus {
    var bronzeLevel: number = 0;
    var silverLevel: number = 0;
    var goldLevel: number = 0;

    var badgeStatus: IBadgeStatus = {
      description: this._getTooltip(badge.name),
      level: '',
      progress: ''
    };

    switch(badge.name) {
      case 'drinks-served':
        bronzeLevel = 500;
        silverLevel = 1000;
        goldLevel = 2000;
        break;
      case 'customer-kudos':
        bronzeLevel = 1;
        silverLevel = 5;
        goldLevel = 10;
        break;
      case 'flights':
      case 'on-time':
        bronzeLevel = 50;
        silverLevel = 100;
        goldLevel = 200;
        break;
      default:
        return badgeStatus;
    }

    if (badge.count < bronzeLevel) {
      badgeStatus.progress = `${badge.count}/${bronzeLevel} to Bronze`;
    }

    if (badge.count >= bronzeLevel && badge.count < silverLevel) {
      badgeStatus.level = styles.bronze;
      badgeStatus.progress = `${badge.count}/${silverLevel} to Silver`;
    }

    if (badge.count >= silverLevel && badge.count < goldLevel) {
      badgeStatus.level = styles.silver;
      badgeStatus.progress = `${badge.count}/${goldLevel} to Gold`;
    }

    if (badge.count >= goldLevel) {
      badgeStatus.level = styles.gold;
      badgeStatus.progress = `${badge.count}`;
    }

    return badgeStatus;
  }

  private _getCustomShimmerElements(): React.ReactElement<ICrewMemberCardProps> {
    return (
      <div style={{ display: 'flex' }}>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.circle, width: 99, height: 99 },
            { type: ShimmerElementType.gap, width: 17, height: 99 }
          ]}/>
        <ShimmerElementsGroup
          flexWrap={true}
          shimmerElements={[
            { type: ShimmerElementType.line, width: 250, height: 21 },
            { type: ShimmerElementType.gap, width: 294, height: 21 },
            { type: ShimmerElementType.line, width: 250, height: 14 },
            { type: ShimmerElementType.gap, width: 294, height: 14 },
            { type: ShimmerElementType.circle, width: 33, height: 33,  },
            { type: ShimmerElementType.gap, width: 4, height: 33 },
            { type: ShimmerElementType.circle, width: 33, height: 33 },
            { type: ShimmerElementType.gap, width: 4, height: 33 },
            { type: ShimmerElementType.circle, width: 33, height: 33 },
            { type: ShimmerElementType.gap, width: 437, height: 33 }
          ]}/>
      </div>
    );
  }
}
