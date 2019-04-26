import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ICrewBadge } from '../../../models/ICrewBadge';

export interface ICrewMemberCardState {
  photo: string;
  statusBadges: string[];
  progressBadges: ICrewBadge[];
  error: string;
}