import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
  providers: [MessageService]
})
export class AddproductComponent implements OnInit {
  myForm!: FormGroup;
  projectId = null;
  date!: Date;
  kickofminDate!: Date;
  devMinDate!: Date;
  testMinDate!: Date;
  delMinDate!: Date;
  maxDate: Date | undefined;
  constructor(private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    this.kickofminDate = new Date();
    this.devMinDate = new Date();
    this.delMinDate = new Date();
    this.testMinDate = new Date();
    this.kickofminDate.setDate(this.kickofminDate.getDate() + 1);
    this.devMinDate.setDate(this.devMinDate.getDate() + 1);
    this.delMinDate.setDate(this.delMinDate.getDate() + 1);
    this.testMinDate.setDate(this.testMinDate.getDate() + 1);

    this.myForm = new FormGroup({
      projectname: new FormControl('', Validators.required),
      kickoffdate: new FormControl('', Validators.required),
      testcd: new FormControl('', Validators.required),
      devcd: new FormControl('', Validators.required),
      nooftesters: new FormControl('', [Validators.required, Validators.min(1)]),
      noofdevelopers: new FormControl('', [Validators.required, Validators.min(1)]),
      projectcost: new FormControl('', Validators.required),
      deliverydate: new FormControl('', Validators.required),
    });

    this.route.params.subscribe({
      next: (res: any) => {
        if(res && res.id) {
        let data = JSON.parse(localStorage.getItem("projects") || '{}');
        let item = data.find((i:any)=>i.id==res.id);
        this.myForm.setValue({
          projectname: item.projectname,
          kickoffdate: item.kickoffdate,
          testcd:item.testcd,
          devcd: item.devcd,
          nooftesters: item.nooftesters,
          noofdevelopers: item.noofdevelopers,
          projectcost: item.projectcost,
          deliverydate: item.deliverydate,
        })
        this.projectId = item.id;
      }
      },
      error: (err: any) => {
        console.log('Err in getting params', err && err.message);
      }
    })
  }

  setKickOffDate(){
    this.setError('devcd', 'testcd', 'deliverydate', 'kickoffdate');
    this.devMinDate = new Date(this.myForm.value.kickoffdate);
    this.devMinDate.setDate(this.devMinDate.getDate() + 1);
    console.log('save date 2',this.myForm);
  }

  setTestDate(){
    this.setError(null, null, 'deliverydate', 'testcd');
    this.delMinDate = new Date(this.myForm.value.testcd);
    this.delMinDate.setDate(this.delMinDate.getDate() + 1);
  }

  setError(control1?: any, control2?: any, control3?: any, tobeChecked?: any) {
    if(this.myForm && this.myForm.value && this.myForm.value[control1] && (new Date(this.myForm.value[control1]) <= new Date(this.myForm.value[tobeChecked]))){
      this.myForm.controls[tobeChecked].setErrors({ 'devdateexceed': true});
    } else if (this.myForm && this.myForm.value && this.myForm.value[control2] && (this.myForm.value.testcd <= this.myForm.value[tobeChecked])) {
      this.myForm.controls[tobeChecked].setErrors({ 'testdateexceed': true});
    } else if(this.myForm && this.myForm.value && this.myForm.value[control3] && (this.myForm.value.deliverydate <= this.myForm.value[tobeChecked])) {
      this.myForm.controls[tobeChecked].setErrors({ 'deliverydateexceed': true});
    } else{
      this.myForm.controls[tobeChecked].setErrors(null);
    }
  }
checkCost(event: any){
  if(event?.target.value<100000){
    this.myForm.controls['projectcost'].setErrors({'costexceed': true});
  }
}
  setDevDate(){  
    this.setError(null, 'testcd', 'deliverydate', 'devcd');
    this.testMinDate = new Date(this.myForm.value.devcd);
    this.testMinDate.setDate(this.testMinDate.getDate() + 1);
  }
  onSubmit(form: FormGroup) {
    if(this.myForm.valid) {
    let data = [];
    if(this.projectId) {
      data = JSON.parse(localStorage.getItem("projects") || '{}');
      let index = data && data.findIndex((s: any)=> s.id== this.projectId);
      data[index] = {...this.myForm.value, id:this.projectId};
      localStorage.clear();
      localStorage.setItem('projects', JSON.stringify(data));   
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project Updated' });
    } else {
      if(localStorage.getItem('projects')) {
        data = JSON.parse(localStorage.getItem("projects") || '{}');
        data.push({...this.myForm.value, id:data[data.length-1].id+1});
        localStorage.clear();
      } else {
        data = [{...this.myForm.value, id: 1}];
      }
      localStorage.setItem('projects', JSON.stringify(data)); 
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project Added' });
    }
    this.myForm.reset();
  }
}
}