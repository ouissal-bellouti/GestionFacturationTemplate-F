import { Component, OnInit } from '@angular/core';
import { Client } from '../../client';
import { FactureService } from 'src/app/services/facture.service';
import { ClientService } from 'src/app/services/client.service';
import { ArticleService } from 'src/app/services/article.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../../article';


@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.scss']
})

export class AddFactureComponent implements OnInit {
  ngOnInit(): void {}

  constructor(
    private service :FactureService, private router:Router,
    private toastr :ToastrService, public fb: FormBuilder,
    private datePipe : DatePipe,
    public clientService: ClientService,
    public serviceArticle: ArticleService,
    private currentRoute: ActivatedRoute,) {}
    get f() { return this.service.formData.controls }


  newFacture(){
    this.service.choixmenu='A'
    this.router.navigate(['/add-facture']);
  }
}
