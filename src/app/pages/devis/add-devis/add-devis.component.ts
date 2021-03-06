import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Client } from '../../client';
import { Devis } from '../../devis';
import { DevisService } from 'src/app/services/devis.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute  } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule,Validators }
from '@angular/forms';

import '@angular/localize/init';
import { Article } from '../../article';
import { ArticleService } from 'src/app/services/article.service';
import { AddArticleComponent } from '../../article/add-article/add-article.component';


@Component({
  selector: 'app-add-devis',
  templateUrl: './add-devis.component.html',
})
export class AddDevisComponent implements OnInit {

  ClientList: Client[];
  ArticleList: Array<Article>;
  isValid:true;
  ToastrService: ToastrService;
  DateLivraison;

  constructor(
    public service:DevisService,
    private dialog:MatDialog,
    public fb: FormBuilder,
    public clientService :ClientService,
    private toastr :ToastrService,
    public articleService: ArticleService,
    private router :Router,
    private datepipe : DatePipe) { }
    get f() { return this.service.formData.controls }

    ngOnInit(): void {
      if(this.service.choixmenu ==='A'){
        this.InfoForm();
        this.service.list= [];
        this.DateLivraison= new Date();
      }
      else {
        this.articleService.getData(this.service.formData.value.Id).subscribe(res => {
          this.service.formData = this.fb.group(Object.assign({},res));
        });
        this.articleService.getAll(this.service.formData.value.Id).subscribe(
          Response => {this.service.list= Response}
        );
        this.f['DateLivraison'].setValue(this.service.formData.value.DateLivraison)
      }
    }


    InfoForm() {
      this.service.formData = this.fb.group({
        Id:'',
        NomClient:'',
        ClientId:'',
        totTTC: 0,
        article:[],
      });
    }


    ResetForm() {
      this.service.formData.reset();
    }

    AddData(articleIndex, Id){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width='50%';
      dialogConfig.data={articleIndex, Id};
      this.dialog.open(AddArticleComponent, dialogConfig).afterClosed().
      subscribe(b10 => {
        this.calcul();
      });
    }

    onDelete(item: Article, Id: string, i:number){
      if(Id !== '')
      this.service.formData.value.id+=Id;
      this.service.list.splice(i,1);
      this.calcul();
    }

    calcul(){
      this.f.PrixTotal.setValue(this.service.list.reduce((prev, curr)=>{
        return prev + curr.PrixTotal;
      },0));
    }



    onSubmit(){
      this.f[''].setValue(this.service.list);
        this.service.saveOrUpdate(this.service.formData.value).
        subscribe( data => {
          this.toastr.success( 'Validation Faite avec Success');
          this.router.navigate(['/articles']);
        });
     }


    OnselectClient(ctrl) {
      if(ctrl.selectedIndex === 0){
        this.f['Nom'].setValue('');
        this.f['Id'].setValue('');
      }
      else {
        this.f['Nom'].setValue(this.ClientList[ctrl.selectedIndex - 1].nom);
        this.f['Id'].setValue(this.ClientList[ctrl.selectedIndex - 1].id);
      }
    }


  }
