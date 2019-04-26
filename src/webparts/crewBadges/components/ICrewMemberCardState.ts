import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ICrewBadge } from '../../../models/ICrewBadge';

export interface ICrewMemberCardState {
  isPhotoLoaded: boolean;
  isBadgeDataLoaded: boolean;
  photo: string;
  statusBadges: string[];
  progressBadges: ICrewBadge[];
  error: string;
}