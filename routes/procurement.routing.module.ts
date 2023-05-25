import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CooperationOrderComponent } from '../views/cooperation/cooperation-order/cooperation-order.component';
import { CooperationIssueComponent } from '../views/cooperation/cooperation-issue/cooperation-issue.component';
import { CooperationTakeoverComponent } from '../views/cooperation/cooperation-takeover/cooperation-takeover.component';
import { SupplierOrdersComponent } from '../views/cooperation/supplier-orders/supplier-orders.component';
import { CooperationTakeoverEvaluationComponent } from '../views/cooperation/cooperation-takeover-evaluation/cooperation-takeover-evaluation.component';

const routes: Routes = [
  {
    path: "supplierorders",
    component: SupplierOrdersComponent,
    data: {
      title: "SIDEBAR.PROCUREMENT.SUPPLIERORDERS.name"
    }
  },
  {
    path: "cooperation/orders",
    component: CooperationOrderComponent,
    data: {
      title: "SIDEBAR.PROCUREMENT.COOPERATIONORDERS.name"
    }
  },
  {
    path: "cooperation/issues",
    component: CooperationIssueComponent,
    data: {
      title: "SIDEBAR.PROCUREMENT.COOPERATIONISSUES.name"
    }
  },
  {
    path: "cooperation/takeovers",
    component: CooperationTakeoverComponent,
    data: {
      title: "SIDEBAR.PROCUREMENT.COOPERATIONTAKEOVERS.name"
    }
  },
  {
    path: "cooperation/takeover-evaluation",
    component: CooperationTakeoverEvaluationComponent,
    data: {
      title: "SIDEBAR.PROCUREMENT.COOPERATIONTAKEOVEREVALUATION.name"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurementRoutingModule {

}
