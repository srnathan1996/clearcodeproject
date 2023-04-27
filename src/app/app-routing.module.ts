import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddproductComponent } from './components/addproduct/addproduct.component';
import { HomeComponent } from './components/home/home.component';
import { ProductlistComponent } from './components/productlist/productlist.component';

const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'addProject',
    component: AddproductComponent
  },
  {
    path:'listProject',
    component: ProductlistComponent
  },
  {
    path:'editProduct/:id',
    component: AddproductComponent
  },
  {
    path:'home',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
