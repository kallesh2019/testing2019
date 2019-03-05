import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {saveAs} from 'file-saver';
import { Http, ResponseContentType, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private http : Http) {}  
   original : any;
   histories = {importhistory:[]};
   selColumn = 0;
   sortOrder = 0;
   interval;
   loader = false;
    selectedCompName = ''; 
    selectedImportId = 0;
   ngOnInit(){
        var dat = new Date();
        dat.setDate( dat.getDate() - 7 );               
        $('input[name="modiDate"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            startDate : dat,
            maxDate : new Date(),
        },function(chosen_date) {
            if($('#todatehis').val() && new Date($('#todatehis').val())<chosen_date) {
                console.log(chosen_date);
                $('#todatehis').val(chosen_date.format('MM/DD/YYYY'));  
              // this.showerror('Transaction from date cannot be greater than Transaction to date');
            } else {
                $('#fromdatehis').val(chosen_date.format('MM/DD/YYYY'));
            }
            console.log(chosen_date);
            console.log($('#todatehis').val());
           
        });
        $('input[name="docDate"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            maxDate : new Date(),
        },function(chosen_date) {
            console.log(chosen_date);
            if($('#fromdatehis').val() && new Date($('#fromdatehis').val())>chosen_date) {
                console.log(chosen_date);
               // this.showerror('Transaction to date cannot be lessar than Transaction from date');
                $('#fromdatehis').val(chosen_date.format('MM/DD/YYYY'));  
            } else {
                $('#todatehis').val(chosen_date.format('MM/DD/YYYY'));
            }
        });
        this.loadHistories();
        // var obj = this;
        // this.interval = setInterval(function(){
        //    obj.loadHistories();
        // }, 30000);
       if (localStorage.getItem("seleCompanyName")) {
        this.selectedCompName = localStorage.getItem("seleCompanyName");
       }    

    }
    ngOnDestroy () {
        clearInterval(this.interval);
      $('.daterangepicker').hide();
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('/');
    }    
    
   loadHistories() {
    this.loader = true;
    this.ajaxService.getHistories(this.formatDate($('#fromdatehis').val()), this.formatDate($('#todatehis').val())).subscribe(result => { 
        this.loader = false;
        this.histories = result; 
        this.original = JSON.parse(JSON.stringify(result));
        if (this.original.importhistory.length == 0) {
          $("#nodatafound").show();
        }else{
           $("#nodatafound").hide();
        }
       $('#table').basictable(); 

               
    });             
   }  
   sortData(arg, colnum) {
    if (colnum == this.selColumn) {
        this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    } else {
        this.sortOrder = 1;
        this.selColumn = colnum;
    }
    var sortOrder = this.sortOrder;
    this.histories.importhistory.sort(function(a,b) {
        var x = a[arg].toLowerCase();
        var y = b[arg].toLowerCase();
        if (sortOrder == 1) {
            return x < y ? -1 : x > y ? 1 : 0;        
        } else {
            return x > y ? -1 : x < y ? 1 : 0;        
        }
    });       
   }
   resetFilter() {
       this.histories = JSON.parse(JSON.stringify(this.original));
   }
   saveFile(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 0)
      }
   }   
   downloadError(argImportId) {
        this.loader = true;
        this.ajaxService.downloadError(argImportId).subscribe(obj => { 
            this.loader = false;
            if (obj.statuscode == 0) {
                let csvContent = atob(obj.filecontent);
                var blob = new Blob([csvContent], {type: "data:application/octet-stream;base64"});
                this.saveFile(blob, "Error.csv");  
            }
        });       
   }

   downloadFile(url): Observable<Blob> {
    let options = new RequestOptions({responseType: ResponseContentType.Blob });
    return this.http.get(url, options)
        .pipe(map(res => res.blob()))
}

   
   downloadSource(argImportId) {
        this.loader = true;
        this.ajaxService.downloadSource(argImportId).subscribe(obj => { 
            this.loader = false;
            if (obj.statuscode == 0) {
                //window.open(obj.fileUrl, '_blank');
                this.downloadFile(obj.fileUrl).subscribe(blob => {
                    saveAs(blob, obj.filename);
                });                         
            }
        });       
   }
   deleteHistory(argImportId) {
      $('#deleteModalHis').modal('show');
      this.selectedImportId = argImportId;
   } 
   okDelHis() {
       if (!$('#deleteCommentsHis').val()) {
           this.toastr.error('Please enter comments.');
           return false;
       }       
        this.loader = true;
        this.ajaxService.deleteSource(this.selectedImportId,$('#deleteCommentsHis').val()).subscribe(obj => { 
            this.loader = false;
            this.toastr.success('Deleted successfully'); 
            this.loadHistories();
            $('#deleteCommentsHis').val('');
            $('#deleteModalHis').modal('hide');
        });       
   }   
}