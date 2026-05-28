import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsers } from './manage-users/manage-users';

const routes: Routes = [
  { path: '', component: ManageUsers },
  { path: 'users', component: ManageUsers }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
