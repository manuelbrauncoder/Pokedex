import { Routes } from '@angular/router';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyComponent } from './privacy/privacy.component';

export const routes: Routes = [
    { path: '', component: MaincontentComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy', component: PrivacyComponent },
];
