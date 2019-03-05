import { Component, ViewChild  } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { DropzoneModule ,DropzoneComponent , DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  templateUrl: './import.component.html'
})
export class ImportComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService) {}  
   @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;   
   templates = {importtemplates:[]};
   templatelist = null;
   helps = {};
   selectedTemplate = ""; 
   selectedTemplateName = '';
   base64Data = '';
   filename = '';
   loader = false;
   formerror = false;
   submitting = false;
   selectedCompName = '';
   selectedTemplateId;
    DEFAULT_DROPZONE_CONFIG = {
      url: 'https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ImportFile/UploadDataFile',
      maxFilesize: 50,
      addRemoveLinks: true,
      acceptedFiles: '.csv',
      autoProcessQueue  : false,
      uploadMultiple : false,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };   
   ngOnInit(){
       this.loader = true;
       var that= this;
       this.loadAllTemplates();
	    $('input[name="selectVentorDate"]').daterangepicker({
	        singleDatePicker: true,
          showDropdowns: true,
     }, function (chosen_date) {
      var SelectedDate = $('#selectVentorDate').val();
      for (var i = 0; i < that.templatelist.length; i++) {
        if (that.templatelist[i].template_name == that.selectedTemplateName) {
          console.log(that.selectedTemplate);
          that.templatelist[i].temp_arry.sort(function (a, b) {
            var dateA, dateB;
            dateA = new Date(a.effective_date), dateB = new Date(b.effective_date);
            return dateA - dateB;
          });
          var count = 0;
          for (var x = 0; x < that.templatelist[i].temp_arry.length; x++) {
            if(that.templatelist[i].temp_arry.length > 1) {
              if (new Date(SelectedDate) > new Date(that.templatelist[i].temp_arry[x].effective_date)) {
                count++;
                if(count == that.templatelist[i].temp_arry.length) {
                  that.selectedTemplateId = that.templatelist[i].temp_arry[x].template_id;
                } else {
                  continue;
                }
                
              } else {
                that.selectedTemplateId = that.templatelist[i].temp_arry[x - 1].template_id;
                break;
              }
            } else {
              that.selectedTemplateId = that.templatelist[i].temp_arry[x].template_id;
            }
          }
          console.log(that.selectedTemplateId);
          that.ajaxService.getHelps(that.selectedTemplateId).subscribe(result => { that.helps = result });
        }
      }
  });
     if (localStorage.getItem("seleCompanyName")) {
        this.selectedCompName = localStorage.getItem("seleCompanyName");
     }       
   }
   
    ngOnDestroy () {
      $('.daterangepicker').hide();
    }
    thiscontext = this;
   formatDate(date, format) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (format == 'Month') {
       return [month, day, year].join('/');
    } else {
      return [year, month, day].join('/');
    }
   }   
     
   loadAllTemplates() {
       var localthis = this;
       this.ajaxService.getAllTemplates().subscribe(result => {
        this.templates = result['templatedetails'];
        this.templatelist = JSON.parse(result['templatedetails']);
-       console.log(JSON.parse(result['templatedetails']));
        localthis.loader = false; 
       });
   } 
   
   onChange() {
       var obj = this;
       this.templatelist.forEach(function (eachObj) {
          if (eachObj.template_name ==obj.selectedTemplate) {
        //     $('input[name="selectVentorDate"]').daterangepicker({
        //       singleDatePicker: true,
        //       showDropdowns: true,
        //       minDate : obj.formatDate(eachObj.effective_date,'Month'),
        //  }); 
           obj.selectedTemplateName = eachObj.template_name;
           // $('#selectVentorDate').val(obj.formatDate(eachObj.effective_date,'Month'));
            $('#selectVentorDate').val(obj.formatDate(new Date(),'Month'));
            var SelectedDate = $('#selectVentorDate').val();
            for (var i = 0; i < obj.templatelist.length; i++) {
              if (obj.templatelist[i].template_name == obj.selectedTemplateName) {
                console.log(obj.selectedTemplate);
                obj.templatelist[i].temp_arry.sort(function (a, b) {
                  var dateA, dateB;
                  dateA = new Date(a.effective_date), dateB = new Date(b.effective_date);
                  return dateA - dateB;
                });
                var count = 0;
                for (var x = 0; x < obj.templatelist[i].temp_arry.length; x++) {
                  if(obj.templatelist[i].temp_arry.length > 1) {
                    if (new Date(SelectedDate) > new Date(obj.templatelist[i].temp_arry[x].effective_date)) {
                      count++;
                if(count == obj.templatelist[i].temp_arry.length) {
                  obj.selectedTemplateId = obj.templatelist[i].temp_arry[x].template_id;
                } else {
                  continue;
                }
                    } else {
                      obj.selectedTemplateId = obj.templatelist[i].temp_arry[x - 1].template_id;
                      break;
                    }
                  } else {
                    obj.selectedTemplateId = obj.templatelist[i].temp_arry[x].template_id;
                  }
                }
                console.log(obj.selectedTemplateId);
                obj.ajaxService.getHelps(obj.selectedTemplateId).subscribe(result => { obj.helps = result });
              }
            } 
            
          }
       });
      // obj.ajaxService.getHelps(this.selectedTemplateId).subscribe(result => { this.helps = result });
   }
   startupload() {
       this.formerror = false;
       var obj = this;
       if (!this.selectedTemplate) {
           return false
       }
       if (!this.base64Data || this.filename.indexOf('.csv') == -1) {
           this.formerror = true;
       } else {
           this.submitting = true; 
           var SelectedDate = $('#selectVentorDate').val();
            for (var i = 0; i < obj.templatelist.length; i++) {
              if (obj.templatelist[i].template_name == obj.selectedTemplateName) {
                console.log(obj.selectedTemplate);
                obj.templatelist[i].temp_arry.sort(function (a, b) {
                  var dateA, dateB;
                  dateA = new Date(a.effective_date), dateB = new Date(b.effective_date);
                  return dateA - dateB;
                });
                var count = 0;
                for (var x = 0; x < obj.templatelist[i].temp_arry.length; x++) {
                  if(obj.templatelist[i].temp_arry.length > 1) {
                    if (new Date(SelectedDate) > new Date(obj.templatelist[i].temp_arry[x].effective_date)) {
                      count++;
                if(count == obj.templatelist[i].temp_arry.length) {
                  obj.selectedTemplateId = obj.templatelist[i].temp_arry[x].template_id;
                } else {
                  continue;
                }
                    } else {
                      obj.selectedTemplateId = obj.templatelist[i].temp_arry[x - 1].template_id;
                      break;
                    }
                  } else {
                    obj.selectedTemplateId = obj.templatelist[i].temp_arry[x].template_id;
                  }
                }
                console.log(obj.selectedTemplateId);
                obj.ajaxService.getHelps(obj.selectedTemplateId).subscribe(result => { obj.helps = result });
              }
            } 
           this.ajaxService.uploadFile(JSON.stringify({
                templateid: this.selectedTemplateId,
                userid: localStorage.getItem("userId"),
                companyid: localStorage.getItem("seleCompany"),
                fileextension: "csv",
                importfilename: this.filename,
                filedata: this.base64Data,
                transactioncollectiondate : this.formatDate($('#selectVentorDate').val(), "Year")
          })).subscribe(result => {
            this.toastr.success('Data has been imported successfully.');              
            this.submitting = false;
            this.base64Data = '';
            this.router.navigateByUrl('/history');
          }, error => { 
            this.submitting = false; 
          });          
       }      
   }
   onAdded(file) {
       var reader = new FileReader();
       reader.readAsDataURL(file);
       var directiveRef = this.directiveRef;
       var obj = this;
       reader.onload = function (event) {
            let encoded = reader.result.replace(/^.*;base64,/, '');  
            if ((encoded.length % 4) > 0) {
                encoded += '='.repeat(4 - (encoded.length % 4));
            }            
            obj.base64Data = encoded;
            obj.filename = file.name;
       };        
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
    
  IdentifySelectedTemplateId(context) {
    var obj = context;
    obj.ajaxService.getAllTemplates().subscribe(result => {
      obj.templates = result['templatedetails'];
      obj.templatelist = JSON.parse(result['templatedetails']);
      console.log(JSON.parse(result['templatedetails']));
      var SelectedDate = $('#selectVentorDate').val();
      for (var i = 0; i < obj.templatelist.length; i++) {
        if (obj.templatelist[i].template_name == obj.selectedTemplateName) {
          console.log(obj.selectedTemplate);
          obj.templatelist[i].temp_arry.sort(function (a, b) {
            var dateA, dateB;
            dateA = new Date(a.effective_date), dateB = new Date(b.effective_date);
            return dateA - dateB;
          });
          var count = 0;
          for (var x = 0; x < obj.templatelist[i].temp_arry.length; x++) {

            if(obj.templatelist[i].temp_arry.length > 1) {
              if (new Date(SelectedDate) > new Date(obj.templatelist[i].temp_arry[x].effective_date)) {
                count++;
                if(count == obj.templatelist[i].temp_arry.length) {
                  obj.selectedTemplateId = obj.templatelist[i].temp_arry[x].template_id;
                } else {
                  continue;
                }
              } else {
                obj.selectedTemplateId = obj.templatelist[i].temp_arry[x - 1].template_id;
                break;
              }
            } else {
              obj.selectedTemplateId = obj.templatelist[i].temp_arry[x].template_id;
            }
            
          }
          console.log(obj.selectedTemplateId);
          obj.ajaxService.getHelps(obj.selectedTemplateId).subscribe(result => { obj.helps = result });
        }
      }
    });

  }
   downloadTemplate() {
        this.loader = true;
        this.ajaxService.downloadTemplate(this.selectedTemplateId).subscribe(obj => { 
            this.loader = false;
            if (obj.statuscode == 0) {
                let csvContent = atob(obj.filecontent);
                var blob = new Blob([csvContent], {type: "data:application/octet-stream;base64"});
                this.saveFile(blob, "template.csv");  
            }
        });       
   }
}