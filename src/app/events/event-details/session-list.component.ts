import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ISession } from '../shared';
import { AuthService} from '../../user/auth.service'
import { VoterService } from './voter.service'
import { fromEventPattern } from 'rxjs';

@Component({
    selector: 'session-list',
    templateUrl: 'session-list.component.html'
})

export class SessionListComponent implements OnInit, OnChanges {
    @Input() sessions:ISession[];
    @Input() filterBy:string;
    @Input() sortBy:string;
    visibleSessions: ISession[] = [];
    
    constructor(private auth: AuthService, private voterService: VoterService) { }

    ngOnInit() { }

    ngOnChanges() {
        if (this.sessions) {
            this.filterSessions(this.filterBy);
            (this.sortBy==='name') ? this.visibleSessions.sort(SortByNameAsc) : this.visibleSessions.sort(SortByVotesDesc);
        }
    }

    toggleVote(session:ISession ) {
        if(this.userHasVoted(session)) {
            this.voterService.deleteVoter(session, this.auth.currentUser.userName);
        } else {
            this.voterService.addVoter(session, this.auth.currentUser.userName);
        }
        if(this.sortBy === 'votes')
            this.visibleSessions.sort(SortByVotesDesc);
    }

    filterSessions(filter) {
        if (filter==='all') {
            this.visibleSessions = this.sessions.slice(0);
        } else {
            this.visibleSessions = this.sessions.filter(session => { return session.level.toLowerCase()===filter});
        }
    }

    userHasVoted(session: ISession) {
        return this.voterService.userHasVoted(session, this.auth.currentUser.userName);
    }


}

function SortByNameAsc(s1: ISession, s2: ISession) {
    if (s1.name > s2.name) return 1;
    else if (s1.name === s2.name) return 0;
    else return -1;
}

function SortByVotesDesc(s1: ISession, s2: ISession) {
    return s2.voters.length - s1.voters.length;
}