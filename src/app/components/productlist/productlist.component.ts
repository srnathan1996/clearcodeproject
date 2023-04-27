import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [MessageService]
})

export class ProductlistComponent implements OnInit {

  dataSource = [];
  constructor(private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
   this.dataSource = JSON.parse(localStorage.getItem("projects") || '{}');
  }

  onRemove(item: any) {
      this.dataSource = JSON.parse(localStorage.getItem("projects") || '{}');
      let index = this.dataSource && this.dataSource.findIndex((s: any)=> s.id== item.id);
      this.dataSource.splice(index,1);
      localStorage.clear();
      if(this.dataSource.length>0){
        localStorage.setItem('projects', JSON.stringify(this.dataSource));
      }
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project Deleted' });
  }
  onEdit(item: any) {
    this.router.navigate(['/editProduct', item.id]);
  }
}







