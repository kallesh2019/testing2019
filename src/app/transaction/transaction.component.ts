import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Transactions } from './transactions';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import Avatax from 'avatax';

declare var $: any;

//var Avatax = require('avatax');

// resolve configuration and credentials
const config = {
    appName: 'MyTestApp',
    appVersion: '1.0',
    environment: 'sandbox',
    machineName: 'Chetan'
};

const creds = {
    accountId: '2000321935',
    licenseKey: '0C1FA8309F4B01DD'
};


@Component({
    templateUrl: './transaction.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TransactionComponent {
    constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) { }
    trustedVendors: any;
    locations: any;
    alllocations: any;
    transactions: Transactions = { itemlist: [], summarydetails: {} };
    costCenter = [];
    itemCodes = [];
    taxCode: any;
    i_is_balancing = false;
    purpose: any;
    allpurpose: any;
    purchaseorder: any;
    purchaseorderWithoutFil: any;
    purchaseagent: any;
    purchaseagentWithoutFil: any;
    revagent: any;
    revagentWithoutFil: any;
    custom1: any;
    custom1WithoutFil: any;
    custom2: any;
    custom2WithoutFil: any;
    filteredTaxCodeValue;
    filteredItemCodeValue;
    editedItemTaxCodeValue;
    editedItemCodeValue;
    doctypes = {};
    companies = {};
    loader = false;
    isAmountItemsEdited = false;
    isAllocationAmountItemsEdited = "";
    totalAjax = 0;
    selectedVendor = "";
    date;
    focusedLineItemId;
    GlobalfilterColoumn = "";
    index = null;
    item = null;
    bulkAllocationLineItemDetails = [];
    bulkAllocationLineItemsAfterCalculation = [];
    filterByItem = "";
    filterByTaxCode = "";
    filterByPurpose = "";
    filterByDocType = "";
    filterByAccural = "";
    filterByImportFilename = "";
    filterByMinVariance = "";
    filterByMaxVariance = "";
    filterPurOrd = "";
    filterpurchaseagent = "";
    filterrevenuaccountid = "";
    filtercustomref1 = "";
    filtercustomref2 = "";
    p: number = 1;
    total: number;
    idgetclicked = "";
    toppositionget;
    SelectedCostCenterId: 0;
    SelectedPurposeId: 0;
    SelectedCustomRef1: 0;
    SelectedCustomRef2: 0;
    SelectedLocationId: 0;
    editId;
    taxCodeList;
    splitId;
    selColumn;
    sortOrder;
    importFileNames;
    selectedlineItems = [];
    checkAll = false;
    selectedBulkAction = '';
    protected dataService: CompleterData;
    protected docTypeService: CompleterData;
    protected taxCodeService: CompleterData;
    timeout;
    selDispColumn;
    selectedCompName = '';
    backup;
    taxcodeforupdateitem = '';
    itemcodeforupdateitem = '';
    commentsupdateItem = '';
    selDynaColumn = '';
    setAcuural = false;
    selectedExpOpt = "linelevel";
    taxAndsummary: any = {};
    bulkAllocation = [];
    ngOnInit() {
        
        this.loadTrustedvendors();
        this.loadLocations();
        this.loadAllLocations();
        this.loadCostCenter();
        this.loadTaxCode();
        this.loadTaxCodeFilter();
        this.loadPurpose();
        this.loadAllPurpose();
        this.loadDocType();
        this.loadCompany();
        this.loadFullLocations();
        this.loadPurchaseOrderNumFil();
        this.loadPurchaseAgentsFil();
        this.loadPurchaseAgentsWithoutFil()
        this.loadPurchaseOrderNumWithFil();
        this.loadRevenueAgentsFil();
        this.loadRevenueAgentsithoutFil();
        this.loadCustFil();
        this.loadCustWithoutFil()
        this.loadCust2Fil();
        this.loadCust2WithoutFil();
        this.loadItemCodes();
        this.loadImportFileNames();

        $(".TransactionFilterBody").hide();
        $(".TransactionFilterBody").hide();
        
        //this.date = new Date();
        // this.date.setDate(this.date.getDate() - 7);
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var d = new Date(firstDay),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;


        $('#fromdate').val([month, day, year].join('/'));
        $('input[name="modiDate"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            startDate: this.date,
        }, function (chosen_date) {
            if ($('#todate').val() && new Date($('#todate').val()) < chosen_date) {
                console.log(chosen_date);
                $('#todate').val(chosen_date.format('MM/DD/YYYY'));
                // this.showerror('Transaction from date cannot be greater than Transaction to date');
            } else {
                $('#fromdate').val(chosen_date.format('MM/DD/YYYY'));
            }
            console.log(chosen_date);
            console.log($('#todate').val());

        });
        $('input[name="docDate"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
        }, function (chosen_date) {
            console.log(chosen_date);
            if ($('#fromdate').val() && new Date($('#fromdate').val()) > chosen_date) {
                console.log(chosen_date);
                // this.showerror('Transaction to date cannot be lessar than Transaction from date');
                $('#fromdate').val(chosen_date.format('MM/DD/YYYY'));
            } else {
                $('#todate').val(chosen_date.format('MM/DD/YYYY'));
            }
        });
        $('#fromdate1').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            autoUpdateInput: false,
            maxDate: new Date(),
        }, function (chosen_date) {

            if ($('#todate1').val() && new Date($('#todate1').val()) < chosen_date) {
                console.log(chosen_date);
                $('#todate1').val(chosen_date.format('MM/DD/YYYY'));
                $('#fromdate1').val(chosen_date.format('MM/DD/YYYY'));
                // this.showerror('Transaction from date cannot be greater than Transaction to date');
            } else {
                $('#fromdate1').val(chosen_date.format('MM/DD/YYYY'));
            }
            // $('#fromdate1').val(chosen_date.format('MM-DD-YYYY'));
        });
        $('#todate1').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            autoUpdateInput: false,
            maxDate: new Date(),
        }, function (chosen_date) {
            if ($('#fromdate1').val() && new Date($('#fromdate1').val()) > chosen_date) {
                console.log(chosen_date);
                // this.showerror('Transaction to date cannot be lessar than Transaction from date');
                $('#fromdate1').val(chosen_date.format('MM/DD/YYYY'));
                $('#todate1').val(chosen_date.format('MM/DD/YYYY'));
            } else {
                $('#todate1').val(chosen_date.format('MM/DD/YYYY'));
            }
            // $('#todate1').val(chosen_date.format('MM-DD-YYYY'));
        });
        //$('#itemcodefast').fastselect();
        $('.singleSelect').fastselect();
        //$('#taxcodefilter').fastselect();
        this.applyFilter(this.p, this.GlobalfilterColoumn);
        this.selDispColumn = localStorage.getItem('selDispColumn') ? localStorage.getItem('selDispColumn') : [];
        setTimeout(function () {
            $('#selDispColumn').fastselect();
        }, 10);
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        if (localStorage.getItem("selDynaColumn")) {
            this.selDynaColumn = localStorage.getItem("selDynaColumn");
        } else {
            this.selDynaColumn = 'costcenters';
        }
        $('.move_top').on('click', function (e) {
            var wrapper = $(this).closest('li')
            wrapper.insertBefore(wrapper.prev())
        })
        $('.move_down').on('click', function (e) {
            var wrapper = $(this).closest('li')
            wrapper.insertAfter(wrapper.next())
        })
    }
    showerror(message) {
        this.toastr.error(message);
    }
    openFilter() {
        $(".TransactionFilterHeader").addClass("changeHeight");
        $(".TransactionFilterBody").show();
        $(".btn_top").hide();
    }
    closeFilter() {
        $(".TransactionFilterHeader").removeClass("changeHeight");
        $(".TransactionFilterBody").hide();
        $(".btn_top").show();
    }
    loadTrustedvendors() {
        this.ajaxService.getVendorCodeValidFilter().subscribe(result => {
            this.trustedVendors = JSON.parse(result.jsondata);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadLocations() {
        this.ajaxService.GetLocationsListByCompanyId().subscribe(result => {
            this.locations = JSON.parse(result.jsondata);
            this.totalAjax = this.totalAjax + 1;
            setTimeout(function () {
                $('.selectLocation').dropdown({});
            });
            this.disableLoader();
        });
    }
    loadAllLocations() {
        this.ajaxService.GetLocationsListByCompanyIdAll().subscribe(result => {
            this.alllocations = result;
        });
    }
    loadCostCenter() {
        this.ajaxService.getFilteredCostCenters().subscribe(result => {

            this.costCenter = JSON.parse(result.jsondata);
            this.totalAjax = this.totalAjax + 1;
            setTimeout(function () {
                $('.selectCostCenter').dropdown({});
            });
            this.disableLoader();
        });
    }
    loadTaxCode() {
        this.ajaxService.GetTaxCodeByCompanyId().subscribe(result => {
            this.taxCodeService = this.completerService.local(result.taxcodelist, 'taxcode', 'taxcode');
            this.taxCodeList = result.taxcodelist;
        });
    }
    loadTaxCodeFilter() {
        this.ajaxService.GetTaxCodeFilter().subscribe(result => {
            if (result.jsondata != "") {
                this.taxCode = JSON.parse(result.jsondata);
            }
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadPurchaseOrderNumFil() {
        this.ajaxService.GetPurchaseOrderFilter().subscribe(result => {
            this.purchaseorder = JSON.parse(result.jsondata);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadPurchaseOrderNumWithFil() {
        this.ajaxService.GetPurchaseOrderWithoutFilter().subscribe(result => {
            this.purchaseorderWithoutFil = JSON.parse(result.jsondata);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadPurchaseAgentsFil() {
        this.ajaxService.GetPurchaseAgentFilter().subscribe(result => {
            this.purchaseagent = JSON.parse(result.purchaseagents);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadPurchaseAgentsWithoutFil() {
        this.ajaxService.GetPurchaseAgentWithoutFilter().subscribe(result => {
            this.purchaseagentWithoutFil = JSON.parse(result.purchaseagents);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadRevenueAgentsFil() {
        this.ajaxService.GetRevAgentsFilter().subscribe(result => {
            this.revagent = JSON.parse(result.revenueaccountdata);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadRevenueAgentsithoutFil() {
        this.ajaxService.GetRevAgentsWithoutFilter().subscribe(result => {
            this.revagentWithoutFil = JSON.parse(result.revenueaccountdata);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadCustFil() {
        this.ajaxService.GetCus1Filter().subscribe(result => {
            this.custom1 = JSON.parse(result.customref1data);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadCustWithoutFil() {
        this.ajaxService.GetCus1WithoutFilter().subscribe(result => {
            this.custom1WithoutFil = JSON.parse(result.customref1data);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadCust2Fil() {
        this.ajaxService.GetCus2Filter().subscribe(result => {
            this.custom2 = JSON.parse(result.customref2data);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadCust2WithoutFil() {
        this.ajaxService.GetCus2WithoutFilter().subscribe(result => {
            this.custom2WithoutFil = JSON.parse(result.customref2data);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadPurpose() {
        this.ajaxService.GetPurposeCodesByCompany().subscribe(result => {
            this.purpose = JSON.parse(result.jsondata);
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadAllPurpose() {
        this.ajaxService.GetAllPurposeCodesByCompany().subscribe(result => {
            this.allpurpose = result;
        });
    }

    loadItemCodes() {
        this.ajaxService.getItems().subscribe(result => {
            this.itemCodes = JSON.parse(result.jsondata);
            this.disableLoader();
        });

    }

    loadImportFileNames() {
        this.ajaxService.getImportFileNames().subscribe(result => {
            this.importFileNames = result.files;
            this.disableLoader();
        });

    }

    loadDocType() {
        this.ajaxService.GetDocumentTypesByCompany().subscribe(result => {
            this.doctypes = result;
            this.docTypeService = this.completerService.local(result.documentstypelist, 'documenttype', 'documenttype');
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadCompany() {
        this.ajaxService.GetCompaniesByUser().subscribe(result => {
            this.companies = result;
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    loadFullLocations() {
        this.ajaxService.loadFullLocations().subscribe(result => {
            for (var i = 0; i < result.destinationslist.length; i++) {
                result.destinationslist[i].fullAddress = result.destinationslist[i].locationcode + ' ' + result.destinationslist[i].address + ' ' + result.destinationslist[i].city + ' ' + result.destinationslist[i].region + ' ' + result.destinationslist[i].postalcode + ' ' + result.destinationslist[i].country;
            }
            this.dataService = this.completerService.local(result.destinationslist, 'fullAddress', 'fullAddress');
            this.totalAjax = this.totalAjax + 1;
            this.disableLoader();
        });
    }
    disableLoader() {
        if (this.totalAjax > 12) {
            this.loader = false;
            this.totalAjax = 7;
        }
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

    onChange(val) {
        this.filterByTaxCode = val;
    }

    onChangeItemCode(val) {
        this.filterByItem = val;
    }

    applyFilter(argPage, filterColum) {
        this.GlobalfilterColoumn = filterColum;
        if (argPage == 1) {
            this.p = argPage;
        }
        var obj = {
            "fromdate": this.formatDate($('#fromdate').val()),
            "todate": this.formatDate($('#todate').val()),
            "vendorid": "",
            "companyid": localStorage.getItem("seleCompany"),
            "locationid": "",
            "costcenterid": "",
            "itemid": "",
            "taxcode": "",
            "purposeid": "",
            "docid": "",
            "accrualmethod": "",
            "importid": "",
            "importfrom": "",
            "importto": "",
            "importfilename": "",
            "pagenumber": argPage,
            "noofrecords": "20",
            "documentype": "",
            "sortcolumn": "import_id",
            "sortby": "desc",
            "minvariance": "",
            "maxvariance": "",
            "purchaseorderno": "",
            "purchaseagent": "",
            "revenuaccountid": "",
            "customref1": "",
            "customref2": "",
            "filtercolumn": ''
        }
        if (this.selColumn) {
            obj.sortcolumn = this.selColumn;
        }
        if (this.sortOrder) {
            obj.sortby = this.sortOrder;
        }
        if (this.selectedVendor) {
            obj.vendorid = this.selectedVendor;
        }
        var locationName = $('#location_filter').val();
        if (locationName) {
            obj.locationid = locationName;
        }
        var costcenter = $('#cost_center').val();
        if (costcenter) {
            obj.costcenterid = costcenter;
        }
        // if (this.filterByItem) {
        //     obj.itemid = this.filterByItem;
        // }
        // if (this.filterByTaxCode) {
        //     obj.itemid = this.filterByTaxCode;
        // }    

        if ($('#taxcodefilter').val() != "" && $('#taxcodefilter').val() != null) {
            obj.taxcode = $('#taxcodefilter').val();
        }
        if ($('#itemcodefilter').val() != "" && $('#itemcodefilter').val() != null) {
            obj.itemid = $('#itemcodefilter').val();
        }
        if (this.filterByPurpose) {
            obj.purposeid = this.filterByPurpose;
        }
        if (this.filterByDocType) {
            obj.documentype = this.filterByDocType;
        }
        if (this.filterByAccural) {
            obj.accrualmethod = this.filterByAccural;
        }
        // if (this.filterByImportFilename) {
        //     obj.importfilename = this.filterByImportFilename;
        // }
        if($('#filterByImportFilename').val() !="" && $('#filterByImportFilename').val() != null) {
            obj.importfilename = $('#filterByImportFilename').val();
        }
        if ($('#fromdate1').val()) {
            obj.importfrom = this.formatDate($('#fromdate1').val());
        }
        if ($('#todate1').val()) {
            obj.importto = this.formatDate($('#todate1').val());
        }
        if (this.filterByMinVariance) {
            obj.minvariance = this.filterByMinVariance;
        }
        if (this.filterByMaxVariance) {
            obj.maxvariance = this.filterByMaxVariance;
        }
        if (filterColum) {
            obj.filtercolumn = filterColum;
            this.GlobalfilterColoumn = filterColum;
        }
        obj.purchaseorderno = this.filterPurOrd;
        obj.purchaseagent = this.filterpurchaseagent;
        obj.revenuaccountid = this.filterrevenuaccountid;
        obj.customref1 = this.filtercustomref1;
        obj.customref2 = this.filtercustomref2;
        this.loader = true;
        //closing edit container
        this.editId = 0;
        //closing allocate container 
        this.splitId = 0;
        this.ajaxService.getTransactions(obj).subscribe(result => {
            this.totalAjax = this.totalAjax + 1;
            this.loader = false;
            this.transactions = result;

            for (var z = 0; z < this.transactions.itemlist.length; z++) {
                this.transactions.itemlist[z].caluculated_tax = this.transactions.itemlist[z].caluculated_tax == '0' ? '' : this.transactions.itemlist[z].caluculated_tax;
            }
            //console.log(filterColum);
            if (filterColum == 'MARTOALLO') {
                this.total = result.summarydetails.tobeallocatedcount;
            } else if (filterColum == 'RULEFAILED') {
                this.total = result.summarydetails.erroredcount;
            } else if (filterColum == 'IMPANDCAL') {
                this.total = result.summarydetails.autoprocessedcount;
            } else if (filterColum == 'MARFORREV') {
                this.total = result.summarydetails.tobereviewed;
            } else if (filterColum == 'AUTCON') {
                this.total = result.summarydetails.confirmedcount;
            } else if (filterColum == 'AUTCOM') {
                this.total = result.summarydetails.committed;
            } else if (filterColum == 'UNRSLVD') {
                this.total = result.summarydetails.unsolved;
            } else {
                this.total = result.summarydetails.totalcount;
            }
            var summary = JSON.parse(result.summarydetails.summaryjson);
            if (summary != undefined) {
                for (let ele of summary) {
                    this.taxAndsummary[ele["Transaction Type"]] = { "TAXABLE": ele["TAXABLE"], "CHARGEDTAX": ele["CHARGED TAX"], "CALCULATEDTAX": ele["CALCULATED TAX"], "OVERACCRUAL": ele["OVER ACCRUAL"], "UNDERACCRUAL": ele["UNDER ACCRUAL"] }
                }
            }
            var tot = JSON.parse(result.summarydetails.totalsummaryjson);
            if (tot != null && tot.length > 0) {
                tot = tot[0];
            }
            if(tot != null) {
                this.taxAndsummary['Totals'] = { "TAXABLE": tot["Total_TAXABLE"], "CHARGEDTAX": tot["Total_CHARGED TAX"], "CALCULATEDTAX": tot["Total_CALCULATED TAX"], "OVERACCRUAL": tot["Total_OVER ACCRUAL"], "UNDERACCRUAL": tot["Total_UNDER ACCRUAL"] }
            }
            
            this.selectAllButton();
            this.initscroll();
        });
    }
    getPage($event) {
        this.p = $event;
        this.applyFilter($event, this.GlobalfilterColoumn);
    }
    resetMinFilter() {
        this.selectedVendor = '';
        var date1 = new Date(); var date2 = new Date();
        date1.setDate(date1.getDate() - 30);
       // $('#fromdate').val((date1.getMonth() + 1) + '/' + date1.getDate() + '/' + date1.getFullYear());
       var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var d = new Date(firstDay),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;


        $('#fromdate').val([month, day, year].join('/'));
        $('#todate').val((date2.getMonth() + 1) + '/' + date2.getDate() + '/' + date2.getFullYear());
        //$('.selectLocation').data('dropdown').reset();
        $('#location_filter').val('');
        $('#cost_center').val('');

        // $('.selectCostCenter').data('dropdown').reset()
        this.filterByItem = '';
        this.filterByTaxCode = '';
        this.filterByPurpose = '';
        this.filterByDocType = '';
        this.filterByAccural = '';
        this.filterByMinVariance = '';
        this.filterByMaxVariance = '';
        this.filterByImportFilename = '';
        this.filterPurOrd = '';
        this.filterpurchaseagent = '';
        this.filterrevenuaccountid = '';
        this.filtercustomref1 = '';
        this.filtercustomref2 = '';
        $('#fromdate1').val('');
        $('#todate1').val('');
        var divitems = document.getElementsByClassName('fstResultItem');  
        console.log(divitems);

        for(var i=0;i<divitems.length;i++) {
            if(divitems[i].innerHTML == " Select One ") {
                divitems[i].className = 'fstResultItem fstSelected'
            } else {
                divitems[i].className = 'fstResultItem'
            }
        }
        var selecteditems = document.getElementsByClassName('fstToggleBtn');  
        console.log(selecteditems);
        for(var i=0;i<selecteditems.length;i++) {
            selecteditems[i].innerHTML = " Select One ";
        }

        document.getElementById('itemcodefilter').innerHTML = "";
        document.getElementById('taxcodefilter').innerHTML = "";
        document.getElementById('filterByImportFilename').innerHTML = "";

        setTimeout(function () {
           // $('#itemcodefilter').fastselect();
            // $('#taxcodefilter').fastselect();
            // $('#filterByImportFilename').fastselect();
        }, 10);

        $('input[name="modiDate"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,

        });
        $('input[name="docDate"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
        });
        this.applyFilter(this.p, this.GlobalfilterColoumn);
    }

    openEdit(item) {

        this.idgetclicked = item.doc + item.cutlinenumber;
        this.toppositionget = $('tbody#' + this.idgetclicked).offset();
        // alert("Top: " + this.toppositionget.top + " Left: " + this.toppositionget.left); 
        // if(item.splitcount>0) {
        //     this.toastr.error('This item is already allocated, you cannot edit'); 
        //     return false
        // } else if(item.splitcount==0) {
        // rajan 25Jan if(item.splitcount) {
        if (item.splitcount) {
            this.splitId = 0;
            this.editId = item.lineitemid;
            setTimeout(function () {
                // $('.editdate').daterangepicker({
                //   singleDatePicker: true,
                //   showDropdowns: true,
                //   autoUpdateInput: false              
                // });

                $('#fromdate3').daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    autoUpdateInput: false,
                    maxDate: new Date(),
                }, function (chosen_date) {
                    $('#fromdate3').val(chosen_date.format('MM-DD-YYYY'));
                });
            }, 10);
            this.loader = true;
            this.backup = $.extend(true, {}, item);
            item.fulldetails = [{}];
            this.ajaxService.getItemDetails(item.lineitemid, "EDIT").subscribe(result => {
                item.fulldetails = JSON.parse(result.lineitemdata);
                if (item.fulldetails[0].purchase_agent_id == null) {
                    item.fulldetails[0].purchase_agent_id = 0;
                }
                var d = new Date(item.fulldetails[0].tax_calc_date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                item.fulldetails[0].tax_calc_date = [month, day, year].join('-');



                item.fulldetails[0].marked_for_review = item.fulldetails[0].marked_for_review == 0 ? false : true;
                item.fulldetails[0].marked_for_allocation = item.fulldetails[0].marked_for_allocation == 0 ? false : true;
                if (item.fulldetails[0].revenue_account_id == null) {
                    item.fulldetails[0].revenue_account_id = 0;
                }

                // item.fulldetails[0].marked_for_review = item.fulldetails[0].marked_for_review == 1 ? true : false;

                for (var i = 0; i < this.costCenter.length; i++) {
                    if (item.fulldetails[0].cost_center_name === this.costCenter[i].cost_center_name) {
                        this.SelectedCostCenterId = this.costCenter[i].cost_center_id;
                        break;
                    }
                }
                if (item.fulldetails[0].accural_amount == 0 || item.fulldetails[0].accural_amount == null) {
                    item.fulldetails[0].accural_amount = item.fulldetails[0].variance;
                }
                for (var j = 0; j < this.purpose.length; j++) {
                    if (item.fulldetails[0].purpose_desc === this.purpose[j].purpose_desc) {
                        this.SelectedPurposeId = this.purpose[j].purpose_id;
                        break;
                    }
                }

                for (var j = 0; j < this.custom1.length; j++) {
                    if (item.fulldetails[0].ref1 === this.custom1[j].custom1) {
                        this.SelectedCustomRef1 = this.custom1[j].custom1_id;
                        break;
                    }
                }
                for (var j = 0; j < this.custom2.length; j++) {
                    if (item.fulldetails[0].ref2 === this.custom2[j].custom2) {
                        this.SelectedCustomRef2 = this.custom2[j].custom2_id;
                        break;
                    }
                }


                for (var k = 0; k < this.locations.length; k++) {
                    if (item.fulldetails[0].dest_location_code === this.locations[k].location_code) {
                        this.SelectedLocationId = this.locations[k].destination_address_id;
                        break;
                    }
                }

                this.loader = false;
            });
        }

    }
    closeEdit() {
        this.editId = 0;
    }
    openSplit(item) {
        this.editId = 0;
        this.splitId = item.lineitemid;
        this.loader = true;
        this.backup = $.extend(true, {}, item)
        this.ajaxService.getItemDetails(item.lineitemid, "EDIT").subscribe(result => {
            item.fulldetails = JSON.parse(result.lineitemdata);
            item.fulldetails[0].marked_for_allocation = item.fulldetails[0].marked_for_allocation == 0 ? false : true;
            this.ajaxService.getAllocatedItems(item.lineitemid).subscribe(result => {
                this.loader = false;
                if (result.allocatedItemDetails) {
                    item.allocations = JSON.parse(result.allocatedItemDetails);
                }
                if (!item.allocations || item.allocations.length == 0) {
                    item.allocations = [];
                    this.addAnother(item);
                }

            });
        });
    }
    closeSplit() {
        this.splitId = 0;
    }

    AmountItemsEdited(item,fieldEdited) {
        this.isAmountItemsEdited = true;
        if(item.modifiedfields == "") {
            item.modifiedfields = ""+fieldEdited;
        } else {
            if(item.modifiedfields.indexOf(fieldEdited) == -1) {
                item.modifiedfields = item.modifiedfields +"-" + fieldEdited;
            }
            
        }
        // alert('edited');
    }
    AllocatedAmountItemsEdited(event: any) {
        this.isAllocationAmountItemsEdited = event.target.value;
        //alert("if change in method "+this.isAllocationAmountItemsEdited);

    }
    onInput(event,item) {
        let accuralupdate: string = event.target.value;
        if (accuralupdate) {
            this.setAcuural = true;
            if(item.modifiedfields == "" || item.modifiedfields == null) {
                item.modifiedfields = 'ACCURAL';
            } else {
                if(item.modifiedfields.indexOf('ACCURAL') == -1) {
                    item.modifiedfields = item.modifiedfields  + '-' + 'ACCURAL';
                }
                
            }
        }
        else {
            this.setAcuural = false;
        }
    }

    AddItemEditedText() {

    }

    // saveItem(item) {
    //     if ($('#audit_note').val() != "") {

    //         this.loader = true;
    //         var Comments = $('#audit_note').val().replace("'", "''");
    //         this.focusedLineItemId = item.doc + item.cutlinenumber;
    //         var that = this;
    //         var tax_calc_date = this.formatDate($('#fromdate3').val());
    //         this.editId = 0;
    //         if (item.fulldetails) {
    //             var fullDet = item.fulldetails;

    //             if (fullDet.length > 0) {
    //                 // if(this.setAcuural == true){
    //                 //     if(item.itemstatus.indexOf('!') == -1){
    //                 //     item.itemstatus = item.itemstatus+"!";
    //                 //     }
    //                 //     //item.itemstatus = item.itemstatus+"!";          
    //                 // }    
    //                 if (this.isAmountItemsEdited == true) {

    //                     var client = new Avatax(config).withSecurity(creds);
    //                     console.log(client);
    //                     console.log(item.accural);
    //                     //accural variance
    //                     var createTransactionObj = {
    //                         "lines": [{
    //                             "number": fullDet[0].cut_line_number,
    //                             "quantity": item.quantity,
    //                             "amount": item.taxable,
    //                             "taxIncluded": fullDet[0].tax_included,
    //                             "taxCode": item.taxcode,
    //                             "itemCode": fullDet[0].item_id,
    //                             "description": "Commit",
    //                             "addresses": {
    //                                 "shipFrom": {
    //                                     "line1": fullDet[0].org_address == null ? "" : fullDet[0].org_address,
    //                                     "city": fullDet[0].org_city == null ? "" : fullDet[0].org_city,
    //                                     "region": fullDet[0].org_region == null ? "" : fullDet[0].org_region,
    //                                     "country": fullDet[0].org_country == null ? "" : fullDet[0].org_country,
    //                                     "postalCode": fullDet[0].org_postal_code == null ? "" : fullDet[0].org_postal_code
    //                                 },
    //                                 "shipTo": {
    //                                     "line1": fullDet[0].dest_address,
    //                                     "city": fullDet[0].dest_city,
    //                                     "region": fullDet[0].dest_region,
    //                                     "country": fullDet[0].dest_country,
    //                                     "postalCode": fullDet[0].dest_postal_code
    //                                 }
    //                             },
    //                             "taxOverride": {
    //                                 "type": "taxAmount",
    //                                 "taxAmount": item.taxable,
    //                                 "taxDate": tax_calc_date,
    //                                 "reason": "Change in Tax Amount"
    //                             }
    //                         }],
    //                         "type": "PurchaseInvoice",
    //                         "companyCode": "ICONICSOLUTIONS",
    //                         "date": fullDet[0].doc_date,
    //                         "customerCode": "ICONICSOLUTIONS-Customer",
    //                         "purchaseOrderNo": fullDet[0].doc_code,
    //                         "commit": false,
    //                         "code": fullDet[0].doc_code,
    //                         "currencyCode": "USD",
    //                         "description": "Commit"

    //                     }

    //                     $.ajax({
    //                         timeout: 0,
    //                         type: 'POST',
    //                         async: true,
    //                         url: client.baseUrl + '/api/v2/transactions/createoradjust',
    //                         contentType: 'application/json',
    //                         dataType: "json",
    //                         data: JSON.stringify({
    //                             createTransactionModel: createTransactionObj
    //                         })
    //                         , headers: {
    //                             'Authorization': client.auth
    //                         },
    //                         success: function (data) {
    //                             console.log(data);
    //                             // Edit More Allocation Item --Rajan                        
    //                             that.ajaxService.getAllocatedItems(item.lineitemid).subscribe(result => {
    //                                 that.loader = false;
    //                                 if (result.allocatedItemDetails) {
    //                                     item.allocations = JSON.parse(result.allocatedItemDetails);
    //                                 }
    //                                 var client = new Avatax(config).withSecurity(creds);
    //                                 if (item.allocations && item.allocations.length > 0) {
    //                                     var createTransactionObj = {
    //                                         "lines": [],
    //                                         "type": "PurchaseInvoice",
    //                                         "companyCode": "ICONICSOLUTIONS",
    //                                         "date": fullDet[0].doc_date,
    //                                         "customerCode": "ICONICSOLUTIONS-Customer",
    //                                         "purchaseOrderNo": fullDet[0].doc_code,
    //                                         "commit": false,
    //                                         "code": fullDet[0].line_item_id,
    //                                         "currencyCode": "USD",
    //                                         "description": "Commit"
    //                                     }

    //                                     for (var i = 0; i < item.allocations.length; i++) {

    //                                         createTransactionObj.lines.push(
    //                                             {
    //                                                 "number": i + 1,
    //                                                 "quantity": (parseFloat(fullDet[0].quantity) * item.allocations[i].allocated_percentage) / 100,
    //                                                 "amount": (parseFloat(item.taxable) * item.allocations[i].allocated_percentage) / 100,
    //                                                 "taxCode": fullDet[0].tax_code,
    //                                                 "itemCode": fullDet[0].item_id,
    //                                                 "description": "Commit",
    //                                                 "taxIncluded": fullDet[0].tax_included,
    //                                                 "addresses": {
    //                                                     "shipFrom": {
    //                                                         "line1": fullDet[0].org_address == null ? "" : fullDet[0].org_address,
    //                                                         "city": fullDet[0].org_city == null ? "" : fullDet[0].org_city,
    //                                                         "region": fullDet[0].org_region == null ? "" : fullDet[0].org_region,
    //                                                         "country": fullDet[0].org_country == null ? "" : fullDet[0].org_country,
    //                                                         "postalCode": fullDet[0].org_postal_code == null ? "" : fullDet[0].org_postal_code
    //                                                     },
    //                                                     "shipTo": {
    //                                                         "line1": item.allocations[i].dest_address,
    //                                                         "city": item.allocations[i].dest_city,
    //                                                         "region": item.allocations[i].dest_region,
    //                                                         "country": item.allocations[i].dest_country,
    //                                                         "postalCode": item.allocations[i].dest_postal_code
    //                                                     }
    //                                                 },
    //                                                 "taxOverride": {
    //                                                     "type": "taxAmount",
    //                                                     "taxAmount": (parseFloat(item.taxable) * item.allocations[i].allocated_percentage) / 100,
    //                                                     "taxDate": tax_calc_date,
    //                                                     "reason": "Change in Tax Amount"
    //                                                 }
    //                                             }
    //                                         );
    //                                     }



    //                                     /*******************Recalculating Tax********************/

    //                                     $.ajax({
    //                                         timeout: 0,
    //                                         type: 'POST',
    //                                         async: true,
    //                                         url: client.baseUrl + '/api/v2/transactions/createoradjust',
    //                                         contentType: 'application/json',
    //                                         dataType: "json",
    //                                         data: JSON.stringify({
    //                                             createTransactionModel: createTransactionObj
    //                                         })
    //                                         , headers: {
    //                                             'Authorization': client.auth
    //                                         },
    //                                         success: function (json) {
    //                                             console.log("After Allocation Calculation JSON is : " + json);
    //                                             for (var i = 0; i < json.lines.length; i++) {
    //                                                 for (var j = 0; j < item.allocations.length; j++) {
    //                                                     if (json.lines[i].lineNumber == (j + 1)) {
    //                                                         item.allocations[j].calculated_tax = json.lines[i].taxCalculated;
    //                                                         // that.setAcuural == true ? (item.alllocations[j].allocated_percentage * item.fulldetails[0].accural_amount)/100 : parseFloat(item.allocations[j].charged_tax ? item.allocations[j].charged_tax : 0) - json.lines[i].taxCalculated;
    //                                                         item.allocations[j].variance = that.setAcuural == true ? (item.allocations[j].allocated_percentage * item.fulldetails[0].accural_amount) / 100 : parseFloat(item.allocations[j].charged_tax ? item.allocations[j].charged_tax : 0) - json.lines[i].taxCalculated;
    //                                                         item.allocations[j].taxable_amount = json.lines[i].taxOverrideAmount;
    //                                                         //item.allocations[j].total_amount = json.lines[i].totalAmount * item.allocations[j].allocated_percentage / 100;                                                 //(parseFloat(item.totalAmount) * item.allocations[i].allocated_percentage) / 100;
    //                                                     }
    //                                                 }
    //                                             }

    //                                             // console.log(item);
    //                                             var allocationObj = [{
    //                                                 "doc_code": item.docid,
    //                                                 "doc_type": item.documentype,
    //                                                 "line_number": fullDet[0].line_number,
    //                                                 "doc_date": item.documentdate,
    //                                                 "cost_center_id": that.SelectedCostCenterId,
    //                                                 "tax_calc_date": tax_calc_date,
    //                                                 "vendor_id": fullDet[0].vendor_id,
    //                                                 "destination_address_id": that.SelectedLocationId,
    //                                                 "origin_address_id": fullDet[0].origin_address_id,
    //                                                 "use_id": localStorage.getItem('userId'),
    //                                                 "tax_code": item.taxcode,
    //                                                 "item_id": fullDet[0].item_id,
    //                                                 "description": item.itemdescription,
    //                                                 "quantity": item.quantity ? item.quantity : 0,
    //                                                 "discount": fullDet[0].discount,
    //                                                 "tax_included": fullDet[0].tax_included,
    //                                                 "taxable_amount": item.taxable == "" ? null : item.taxable,
    //                                                 "charged_tax": item.charged_tax ? item.charged_tax : 0,
    //                                                 "total_amount": item.amount,
    //                                                 "Ref1": that.SelectedCustomRef1,
    //                                                 "Ref2": that.SelectedCustomRef2,
    //                                                 "revenue_account_id": fullDet[0].revenue_account_id,
    //                                                 "DestAddress": fullDet[0].dest_address,
    //                                                 "DestCity": fullDet[0].dest_city,
    //                                                 "DestRegion": fullDet[0].dest_region,
    //                                                 "DestPostalCode": fullDet[0].dest_postal_code,
    //                                                 "DestCountry": fullDet[0].dest_country,
    //                                                 "OrigAddress": fullDet[0].org_address,
    //                                                 "OrigCity": fullDet[0].org_city,
    //                                                 "OrigRegion": fullDet[0].org_region,
    //                                                 "OrigPostalCode": fullDet[0].org_postal_code,
    //                                                 "OrigCountry": fullDet[0].org_country,
    //                                                 "DestLocationCode": fullDet[0].dest_location_code,
    //                                                 "OrigLocationCode": fullDet[0].org_location_code,
    //                                                 "purchase_agent_id": fullDet[0].purchase_agent_id,
    //                                                 "purchasing_order_number": fullDet[0].purchasing_order_number,
    //                                                 "import_id": fullDet[0].import_id,
    //                                                 "company_id": fullDet[0].company_id,
    //                                                 "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
    //                                                 "is_allocated": "",
    //                                                 "accrual_method": fullDet[0].accrual_method,
    //                                                 "allocation_method": "",
    //                                                 "calculated_tax": data.lines[0].taxCalculated,
    //                                                 "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
    //                                                 "line_item_status": fullDet[0].line_item_status,
    //                                                 "warning_status": fullDet[0].warning_status,
    //                                                 "insert_user": localStorage.getItem('userId'),
    //                                                 "cut_line_number": fullDet[0].cut_line_number,
    //                                                 "processing_stage": null,
    //                                                 "user_id": localStorage.getItem('userId'),
    //                                                 "cut_proc_number": fullDet[0].cut_proc_number,
    //                                                 "variance": that.setAcuural == true ? fullDet[0].accural_amount : parseFloat(item.charged_tax ? item.charged_tax : 0) - data.lines[0].taxCalculated,
    //                                                 //"variance": fullDet[0].variance == fullDet[0].accural_amount ? data.lines[0].taxCalculated - parseFloat(item.charged_tax ? item.charged_tax : 0) : fullDet[0].accural_amount,
    //                                                 //"variance": data.lines[0].taxCalculated - parseFloat(item.charged_tax ? item.charged_tax : 0),
    //                                                 "purpose_id": that.SelectedPurposeId,
    //                                                 "error_code_id": fullDet[0].error_code_id,
    //                                                 "islocked": null,
    //                                                 "address": fullDet[0].org_address,
    //                                                 "city": fullDet[0].org_city,
    //                                                 "region": fullDet[0].org_region,
    //                                                 "postal_code": fullDet[0].org_postal_code,
    //                                                 "country": fullDet[0].org_country,
    //                                                 "audit_note": Comments,
    //                                                 "line_item_id": fullDet[0].line_item_id,
    //                                                 "nontaxable": item.nontaxable ? item.nontaxable : 0,
    //                                                 "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
    //                                                 "documentname": item.documentname,
    //                                                 "itemcode": item.itemcode,
    //                                                 //"status_code": item.itemstatus ? item.itemstatus : ""
    //                                                 "status_code": "IMPANDCAL"
    //                                             }];

    //                                             for (var i = 0; i < item.allocations.length; i++) {
    //                                                 //item.allocations[i].taxable_amount = (parseFloat(item.taxable) * item.allocations[i].allocated_percentage) / 100;
    //                                                 // item.allocations[i].taxable_amount = (parseFloat(item.taxable) * item.allocations[i].allocated_percentage) / 100;
    //                                                 // item.allocations[i].total_amount =(parseFloat(item.totalAmount) * item.allocations[i].allocated_percentage) / 100;
    //                                                 // item.allocations[i].calculated_tax = json.lines[i].taxCalculated;  
    //                                                 item.allocations[i].total_amount = (parseFloat(item.amount) * item.allocations[i].allocated_percentage) / 100;
    //                                                 allocationObj.push(item.allocations[i]);

    //                                             }

    //                                             that.ajaxService.saveItem(allocationObj).subscribe(result => {
    //                                                 item.history = result;
    //                                                 that.loader = false;
    //                                                 that.toastr.success('Saved successfully.');
    //                                                 that.setAcuural = false;
    //                                                 item.splitcount = item.allocations.length;
    //                                                 that.selectedlineItems = [];
    //                                                 that.applyFilter(that.p, that.GlobalfilterColoumn);
    //                                                 // var myClassName = "foo";
    //                                                 $('html, body').animate({
    //                                                     scrollTop: 0
    //                                                 }, 0);
    //                                                 $('html, body').animate({
    //                                                     scrollTop: that.toppositionget.top - 350
    //                                                 }, 1000);
    //                                                 // setTimeout(function () {
    //                                                 //     $('tbody#'+that.focusedLineItemId).addClass('focusitem');
    //                                                 //     //document.getElementById(that.focusedLineItemId).scrollIntoView();
    //                                                 // }, 1000);

    //                                             }, error => {
    //                                                 that.toastr.error('Error.');
    //                                                 that.loader = false;
    //                                             });

    //                                             console.log(allocationObj);
    //                                             that.loader = false;

    //                                         }, error: function (jqXHR, exception) {
    //                                             console.log(exception);
    //                                             //that.loader = false;
    //                                             var def = JSON.parse(jqXHR.responseText);
    //                                             if (def.error.message) {
    //                                                 that.toastr.error("We cannot recalculate tax," + def.error.message);
    //                                             }


    //                                             var allocationObj = [{
    //                                                 "doc_code": item.docid,
    //                                                 "doc_type": item.documentype,
    //                                                 "line_number": fullDet[0].line_number,
    //                                                 "doc_date": item.documentdate,
    //                                                 "cost_center_id": that.SelectedCostCenterId,
    //                                                 "tax_calc_date": tax_calc_date,
    //                                                 "vendor_id": fullDet[0].vendor_id,
    //                                                 "destination_address_id": that.SelectedLocationId,
    //                                                 "origin_address_id": fullDet[0].origin_address_id,
    //                                                 "use_id": localStorage.getItem('userId'),
    //                                                 "accrual_method": fullDet[0].accrual_method,
    //                                                 "tax_code": item.taxcode,
    //                                                 "item_id": fullDet[0].item_id,
    //                                                 "description": item.itemdescription,
    //                                                 "quantity": item.quantity ? item.quantity : 0,
    //                                                 "discount": fullDet[0].discount,
    //                                                 "tax_included": fullDet[0].tax_included,
    //                                                 "taxable_amount": item.taxable == "" ? null : item.taxable,
    //                                                 "charged_tax": item.charged_tax ? item.charged_tax : 0,
    //                                                 "total_amount": item.amount,
    //                                                 "Ref1": that.SelectedCustomRef1,
    //                                                 "Ref2": that.SelectedCustomRef2,
    //                                                 "revenue_account_id": fullDet[0].revenue_account_id,
    //                                                 "DestAddress": fullDet[0].dest_address,
    //                                                 "DestCity": fullDet[0].dest_city,
    //                                                 "DestRegion": fullDet[0].dest_region,
    //                                                 "DestPostalCode": fullDet[0].dest_postal_code,
    //                                                 "DestCountry": fullDet[0].dest_country,
    //                                                 "OrigAddress": fullDet[0].org_address,
    //                                                 "OrigCity": fullDet[0].org_city,
    //                                                 "OrigRegion": fullDet[0].org_region,
    //                                                 "OrigPostalCode": fullDet[0].org_postal_code,
    //                                                 "OrigCountry": fullDet[0].org_country,
    //                                                 "DestLocationCode": fullDet[0].dest_location_code,
    //                                                 "OrigLocationCode": fullDet[0].org_location_code,
    //                                                 "purchase_agent_id": fullDet[0].purchase_agent_id,
    //                                                 "purchasing_order_number": fullDet[0].purchasing_order_number,
    //                                                 "import_id": fullDet[0].import_id,
    //                                                 "company_id": fullDet[0].company_id,
    //                                                 "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
    //                                                 "is_allocated": "",
    //                                                 "allocation_method": "",
    //                                                 "calculated_tax": item.caluculated_tax == "" ? null : item.caluculated_tax,
    //                                                 "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
    //                                                 "line_item_status": fullDet[0].line_item_status,
    //                                                 "warning_status": fullDet[0].warning_status,
    //                                                 "insert_user": localStorage.getItem('userId'),
    //                                                 "cut_line_number": fullDet[0].cut_line_number,
    //                                                 "processing_stage": null,
    //                                                 "user_id": localStorage.getItem('userId'),
    //                                                 "cut_proc_number": fullDet[0].cut_proc_number,
    //                                                 "variance": that.setAcuural == true ? fullDet[0].accural_amount : parseFloat(item.charged_tax ? item.charged_tax : 0) - data.lines[0].taxCalculated,
    //                                                 //"variance": fullDet[0].variance == fullDet[0].accural_amount ? data.lines[0].taxCalculated - parseFloat(item.charged_tax ? item.charged_tax : 0) : fullDet[0].accural_amount,
    //                                                 //"variance": data.lines[0].taxCalculated - parseFloat(item.charged_tax ? item.charged_tax : 0),
    //                                                 "purpose_id": that.SelectedPurposeId,
    //                                                 "error_code_id": fullDet[0].error_code_id,
    //                                                 "islocked": null,
    //                                                 "address": fullDet[0].org_address,
    //                                                 "city": fullDet[0].org_city,
    //                                                 "region": fullDet[0].org_region,
    //                                                 "postal_code": fullDet[0].org_postal_code,
    //                                                 "country": fullDet[0].org_country,
    //                                                 "audit_note": Comments,
    //                                                 "line_item_id": fullDet[0].line_item_id,
    //                                                 "nontaxable": item.nontaxable ? item.nontaxable : 0,
    //                                                 "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
    //                                                 "documentname": item.documentname,
    //                                                 "itemcode": item.itemcode,
    //                                                 "status_code": item.itemstatus ? item.itemstatus : ""

    //                                             }];

    //                                             for (var i = 0; i < item.allocations.length; i++) {
    //                                                 //item.allocations[i].taxable_amount = (parseFloat(item.taxable) * item.allocations[i].allocated_percentage) / 100;
    //                                                 // item.allocations[i].calculated_tax = json.lines[i].taxCalculated; 
    //                                                 item.allocations[i].total_amount = (parseFloat(item.amount) * item.allocations[i].allocated_percentage) / 100;
    //                                                 allocationObj.push(item.allocations[i]);


    //                                             }

    //                                             that.ajaxService.saveItem(allocationObj).subscribe(result => {
    //                                                 item.history = result;
    //                                                 that.loader = false;
    //                                                 that.setAcuural = false;
    //                                                 that.toastr.success('Saved successfully.');
    //                                                 item.splitcount = item.allocations.length;
    //                                                 that.selectedlineItems = [];
    //                                                 that.applyFilter(that.p, that.GlobalfilterColoumn);
    //                                                 $('html, body').animate({
    //                                                     scrollTop: 0
    //                                                 }, 0);
    //                                                 $('html, body').animate({
    //                                                     scrollTop: that.toppositionget.top - 350
    //                                                 }, 1000);
    //                                                 // setTimeout(function () {
    //                                                 //     $('tbody#'+that.focusedLineItemId).addClass('focusitem');
    //                                                 //     //document.getElementById(that.focusedLineItemId).scrollIntoView();
    //                                                 // }, 1000);
    //                                             }, error => {
    //                                                 that.toastr.error('Error.');
    //                                                 that.loader = false;
    //                                             });

    //                                         }
    //                                     });
    //                                 } else {
    //                                     var subObj = [{
    //                                         "doc_code": item.docid,
    //                                         "doc_type": item.documentype,
    //                                         "line_number": fullDet[0].line_number,
    //                                         "doc_date": item.documentdate,
    //                                         "cost_center_id": that.SelectedCostCenterId,
    //                                         "tax_calc_date": tax_calc_date,
    //                                         "vendor_id": fullDet[0].vendor_id,
    //                                         "destination_address_id": that.SelectedLocationId,
    //                                         "origin_address_id": fullDet[0].origin_address_id,
    //                                         "use_id": localStorage.getItem('userId'),
    //                                         "tax_code": item.taxcode,
    //                                         "item_id": fullDet[0].item_id,
    //                                         "description": item.itemdescription,
    //                                         "quantity": item.quantity ? item.quantity : 0,
    //                                         "discount": fullDet[0].discount,
    //                                         "tax_included": fullDet[0].tax_included,
    //                                         "taxable_amount": item.taxable == "" ? null : item.taxable,
    //                                         "charged_tax": item.charged_tax ? item.charged_tax : 0,
    //                                         "total_amount": item.amount,
    //                                         "Ref1": that.SelectedCustomRef1,
    //                                         "Ref2": that.SelectedCustomRef2,
    //                                         "accrual_method": fullDet[0].accrual_method,
    //                                         "revenue_account_id": fullDet[0].revenue_account_id,
    //                                         "DestAddress": fullDet[0].dest_address,
    //                                         "DestCity": fullDet[0].dest_city,
    //                                         "DestRegion": fullDet[0].dest_region,
    //                                         "DestPostalCode": fullDet[0].dest_postal_code,
    //                                         "DestCountry": fullDet[0].dest_country,
    //                                         "OrigAddress": fullDet[0].org_address,
    //                                         "OrigCity": fullDet[0].org_city,
    //                                         "OrigRegion": fullDet[0].org_region,
    //                                         "OrigPostalCode": fullDet[0].org_postal_code,
    //                                         "OrigCountry": fullDet[0].org_country,
    //                                         "DestLocationCode": fullDet[0].dest_location_code,
    //                                         "OrigLocationCode": fullDet[0].org_location_code,
    //                                         "purchase_agent_id": fullDet[0].purchase_agent_id,
    //                                         "purchasing_order_number": fullDet[0].purchasing_order_number,
    //                                         "import_id": fullDet[0].import_id,
    //                                         "company_id": fullDet[0].company_id,
    //                                         "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
    //                                         "is_allocated": "",
    //                                         "allocation_method": "",
    //                                         "calculated_tax": data.lines[0].taxCalculated,
    //                                         "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
    //                                         "line_item_status": fullDet[0].line_item_status,
    //                                         "warning_status": fullDet[0].warning_status,
    //                                         "insert_user": localStorage.getItem('userId'),
    //                                         "cut_line_number": fullDet[0].cut_line_number,
    //                                         "processing_stage": null,
    //                                         "user_id": localStorage.getItem('userId'),
    //                                         "cut_proc_number": fullDet[0].cut_proc_number,
    //                                         "variance": that.setAcuural == true ? fullDet[0].accural_amount : parseFloat(item.charged_tax ? item.charged_tax : 0) - data.lines[0].taxCalculated,
    //                                         //"variance": fullDet[0].variance == fullDet[0].accural_amount ? data.lines[0].taxCalculated - parseFloat(item.charged_tax ? item.charged_tax : 0) : fullDet[0].accural_amount,
    //                                         // "variance": data.lines[0].taxCalculated - parseFloat(item.charged_tax ? item.charged_tax : 0),
    //                                         "purpose_id": that.SelectedPurposeId,
    //                                         "error_code_id": fullDet[0].error_code_id,
    //                                         "islocked": null,
    //                                         "address": fullDet[0].org_address,
    //                                         "city": fullDet[0].org_city,
    //                                         "region": fullDet[0].org_region,
    //                                         "postal_code": fullDet[0].org_postal_code,
    //                                         "country": fullDet[0].org_country,
    //                                         "audit_note": Comments,
    //                                         "line_item_id": fullDet[0].line_item_id,
    //                                         "nontaxable": item.nontaxable ? item.nontaxable : 0,
    //                                         "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
    //                                         "documentname": item.documentname,
    //                                         "itemcode": item.itemcode,
    //                                         //"status_code": item.itemstatus ? item.itemstatus : ""
    //                                         "status_code": "IMPANDCAL"
    //                                     }]

    //                                     that.ajaxService.saveItem(subObj).subscribe(result => {
    //                                         that.loader = false;
    //                                         if (result.statuscode == 0) {
    //                                             that.editId = 0;
    //                                             that.selectedlineItems = [];
    //                                             that.setAcuural = false;
    //                                             that.applyFilter(that.p, that.GlobalfilterColoumn);
    //                                             that.toastr.success('Item has been saved successfully.');
    //                                             $('html, body').animate({
    //                                                 scrollTop: 0
    //                                             }, 0);
    //                                             $('html, body').animate({
    //                                                 scrollTop: that.toppositionget.top - 350
    //                                             }, 1000);
    //                                             // setTimeout(function () {
    //                                             //     $('tbody#'+ that.focusedLineItemId).addClass('focusitem');
    //                                             //     //document.getElementById(that.focusedLineItemId).scrollIntoView();
    //                                             // }, 1000);
    //                                         } else {
    //                                             that.toastr.error('Error');
    //                                         }
    //                                     }, error => {
    //                                         that.toastr.error('Error.');
    //                                         that.loader = false;
    //                                     });
    //                                 }
    //                             });
    //                             /***************************************/

    //                             //***************End *********************************

    //                         }, error: function (jqXHR, exception) {
    //                             console.log(exception);
    //                             //that.loader = false;
    //                             var def = JSON.parse(jqXHR.responseText);
    //                             if (def.error.message) {
    //                                 that.toastr.error("We cannot recalculate tax," + def.error.message);
    //                             }
    //                             /***********Even the Avatax Call fails the item will be saved******************/
    //                             // Code for Allocation
    //                             that.ajaxService.getAllocatedItems(item.lineitemid).subscribe(result => {
    //                                 that.loader = false;
    //                                 if (result.allocatedItemDetails) {
    //                                     item.allocations = JSON.parse(result.allocatedItemDetails);
    //                                 }
    //                                 var subObj = [{
    //                                     "doc_code": item.docid,
    //                                     "doc_type": item.documentype,
    //                                     "line_number": fullDet[0].line_number,
    //                                     "doc_date": item.documentdate,
    //                                     "cost_center_id": that.SelectedCostCenterId,
    //                                     "tax_calc_date": tax_calc_date,
    //                                     "vendor_id": fullDet[0].vendor_id,
    //                                     "destination_address_id": that.SelectedLocationId,
    //                                     "origin_address_id": fullDet[0].origin_address_id,
    //                                     "use_id": localStorage.getItem('userId'),
    //                                     "tax_code": item.taxcode,
    //                                     "item_id": fullDet[0].item_id,
    //                                     "description": item.itemdescription,
    //                                     "quantity": item.quantity ? item.quantity : 0,
    //                                     "discount": fullDet[0].discount,
    //                                     "tax_included": fullDet[0].tax_included,
    //                                     "taxable_amount": item.taxable == "" ? null : item.taxable,
    //                                     "charged_tax": item.charged_tax ? item.charged_tax : 0,
    //                                     "total_amount": item.amount,
    //                                     "Ref1": that.SelectedCustomRef1,
    //                                     "Ref2": that.SelectedCustomRef2,
    //                                     "revenue_account_id": fullDet[0].revenue_account_id,
    //                                     "DestAddress": fullDet[0].dest_address,
    //                                     "DestCity": fullDet[0].dest_city,
    //                                     "DestRegion": fullDet[0].dest_region,
    //                                     "DestPostalCode": fullDet[0].dest_postal_code,
    //                                     "DestCountry": fullDet[0].dest_country,
    //                                     "OrigAddress": fullDet[0].org_address,
    //                                     "OrigCity": fullDet[0].org_city,
    //                                     "OrigRegion": fullDet[0].org_region,
    //                                     "OrigPostalCode": fullDet[0].org_postal_code,
    //                                     "OrigCountry": fullDet[0].org_country,
    //                                     "DestLocationCode": fullDet[0].dest_location_code,
    //                                     "OrigLocationCode": fullDet[0].org_location_code,
    //                                     "purchase_agent_id": fullDet[0].purchase_agent_id,
    //                                     "purchasing_order_number": fullDet[0].purchasing_order_number,
    //                                     "import_id": fullDet[0].import_id,
    //                                     "company_id": fullDet[0].company_id,
    //                                     "accrual_method": fullDet[0].accrual_method,
    //                                     "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
    //                                     "is_allocated": "",
    //                                     "allocation_method": "",
    //                                     "calculated_tax": item.caluculated_tax == "" ? null : item.caluculated_tax,
    //                                     "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
    //                                     "line_item_status": fullDet[0].line_item_status,
    //                                     "warning_status": fullDet[0].warning_status,
    //                                     "insert_user": localStorage.getItem('userId'),
    //                                     "cut_line_number": fullDet[0].cut_line_number,
    //                                     "processing_stage": null,
    //                                     "user_id": localStorage.getItem('userId'),
    //                                     "cut_proc_number": fullDet[0].cut_proc_number,
    //                                     //"variance": item.variance,
    //                                     "variance": that.setAcuural == false ? fullDet[0].variance : fullDet[0].accural_amount,
    //                                     // "variance": fullDet[0].variance,
    //                                     "purpose_id": that.SelectedPurposeId,
    //                                     "error_code_id": fullDet[0].error_code_id,
    //                                     "islocked": null,
    //                                     "address": fullDet[0].org_address,
    //                                     "city": fullDet[0].org_city,
    //                                     "region": fullDet[0].org_region,
    //                                     "postal_code": fullDet[0].org_postal_code,
    //                                     "country": fullDet[0].org_country,
    //                                     "audit_note": Comments,
    //                                     "line_item_id": fullDet[0].line_item_id,
    //                                     "nontaxable": item.nontaxable ? item.nontaxable : 0,
    //                                     //"accural": item.accural_amount ? item.accural_amount : 0,
    //                                     "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
    //                                     "documentname": item.documentname,
    //                                     "itemcode": item.itemcode,
    //                                     "status_code": item.itemstatus ? item.itemstatus : ""
    //                                 }];
    //                                 for (var i = 0; i < item.allocations.length; i++) {
    //                                     subObj.push(item.allocations[i]);
    //                                 }
    //                                 that.ajaxService.saveItem(subObj).subscribe(result => {
    //                                     that.loader = false;
    //                                     if (result.statuscode == 0) {
    //                                         that.editId = 0;
    //                                         that.selectedlineItems = [];
    //                                         that.setAcuural = false;
    //                                         that.applyFilter(that.p, that.GlobalfilterColoumn);
    //                                         that.toastr.success('Item has been saved successfully.');
    //                                         $('html, body').animate({
    //                                             scrollTop: 0
    //                                         }, 0);
    //                                         $('html, body').animate({
    //                                             scrollTop: that.toppositionget.top - 350
    //                                         }, 1000);
    //                                         setTimeout(function () {
    //                                             $('tbody#' + that.focusedLineItemId).addClass('focusitem');
    //                                             //document.getElementById(that.focusedLineItemId).scrollIntoView();
    //                                         }, 1000);
    //                                     } else {
    //                                         that.toastr.error('Error-1');
    //                                     }
    //                                 }, error => {
    //                                     that.toastr.error('Error.');
    //                                     that.loader = false;
    //                                 });
    //                                 /****************************/
    //                             });

    //                         }
    //                     });


    //                 } else {
    //                     // if (this.setAcuural == true) {
    //                     //     if (item.itemstatus.indexOf('!') == -1) {
    //                     //         item.itemstatus = item.itemstatus + "!";
    //                     //     }
    //                     //     //item.itemstatus = item.itemstatus+"!";          
    //                     // }
    //                     // Code for Allocation
    //                     that.ajaxService.getAllocatedItems(item.lineitemid).subscribe(result => {
    //                         that.loader = false;
    //                         if (result.allocatedItemDetails) {
    //                             item.allocations = JSON.parse(result.allocatedItemDetails);
    //                         }
    //                         if (item.allocations) {
    //                             var subObj = [{
    //                                 "doc_code": item.docid,
    //                                 "doc_type": item.documentype,
    //                                 "line_number": fullDet[0].line_number,
    //                                 "doc_date": item.documentdate,
    //                                 "cost_center_id": that.SelectedCostCenterId,
    //                                 "tax_calc_date": tax_calc_date,
    //                                 "vendor_id": fullDet[0].vendor_id,
    //                                 "destination_address_id": that.SelectedLocationId,
    //                                 "origin_address_id": fullDet[0].origin_address_id,
    //                                 "use_id": localStorage.getItem('userId'),
    //                                 "tax_code": item.taxcode,
    //                                 "item_id": fullDet[0].item_id,
    //                                 "description": item.itemdescription,
    //                                 "quantity": item.quantity ? item.quantity : 0,
    //                                 "discount": fullDet[0].discount,
    //                                 "tax_included": fullDet[0].tax_included,
    //                                 "taxable_amount": item.taxable == "" ? null : item.taxable,
    //                                 "charged_tax": item.charged_tax ? item.charged_tax : 0,
    //                                 "total_amount": item.amount,
    //                                 "Ref1": this.SelectedCustomRef1,
    //                                 "Ref2": this.SelectedCustomRef2,
    //                                 "revenue_account_id": fullDet[0].revenue_account_id,
    //                                 "DestAddress": fullDet[0].dest_address,
    //                                 "DestCity": fullDet[0].dest_city,
    //                                 "DestRegion": fullDet[0].dest_region,
    //                                 "DestPostalCode": fullDet[0].dest_postal_code,
    //                                 "DestCountry": fullDet[0].dest_country,
    //                                 "OrigAddress": fullDet[0].org_address,
    //                                 "OrigCity": fullDet[0].org_city,
    //                                 "OrigRegion": fullDet[0].org_region,
    //                                 "OrigPostalCode": fullDet[0].org_postal_code,
    //                                 "OrigCountry": fullDet[0].org_country,
    //                                 "DestLocationCode": fullDet[0].dest_location_code,
    //                                 "OrigLocationCode": fullDet[0].org_location_code,
    //                                 "purchase_agent_id": fullDet[0].purchase_agent_id,
    //                                 "purchasing_order_number": fullDet[0].purchasing_order_number,
    //                                 "import_id": fullDet[0].import_id,
    //                                 "company_id": fullDet[0].company_id,
    //                                 "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
    //                                 "is_allocated": "",
    //                                 "allocation_method": "",
    //                                 "accrual_method": fullDet[0].accrual_method,
    //                                 "calculated_tax": item.caluculated_tax == "" ? null : item.caluculated_tax,
    //                                 "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
    //                                 "line_item_status": fullDet[0].line_item_status,
    //                                 "warning_status": fullDet[0].warning_status,
    //                                 "insert_user": localStorage.getItem('userId'),
    //                                 "cut_line_number": fullDet[0].cut_line_number,
    //                                 "processing_stage": null,
    //                                 "user_id": localStorage.getItem('userId'),
    //                                 "cut_proc_number": fullDet[0].cut_proc_number,
    //                                 "variance": that.setAcuural == false ? fullDet[0].variance : fullDet[0].accural_amount,
    //                                 //"variance": fullDet[0].variance,
    //                                 // "variance": item.variance == item.accural_amount ? item.variance : item.accural_amount,
    //                                 "purpose_id": this.SelectedPurposeId,
    //                                 "error_code_id": fullDet[0].error_code_id,
    //                                 "islocked": null,
    //                                 "address": fullDet[0].org_address,
    //                                 "city": fullDet[0].org_city,
    //                                 "region": fullDet[0].org_region,
    //                                 "postal_code": fullDet[0].org_postal_code,
    //                                 "country": fullDet[0].org_country,
    //                                 "audit_note": Comments,
    //                                 "line_item_id": fullDet[0].line_item_id,
    //                                 "nontaxable": item.nontaxable ? item.nontaxable : 0,
    //                                 "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
    //                                 "documentname": item.documentname,
    //                                 "itemcode": item.itemcode,
    //                                 "status_code": item.itemstatus ? item.itemstatus : ""
    //                             }];
    //                             for (var i = 0; i < item.allocations.length; i++) {
    //                                 //item.allocations[i].taxable_amount = (parseFloat(item.taxable) * item.allocations[i].allocated_percentage) / 100;
    //                                 //item.allocations[i].total_amount = (parseFloat(item.totalAmount) * item.allocations[i].allocated_percentage) / 100;
    //                                 item.allocations[i].variance = that.setAcuural == true ? (item.allocations[i].allocated_percentage * fullDet[0].accural_amount) / 100 : parseFloat(item.allocations[i].charged_tax ? item.allocations[i].charged_tax : 0) - item.caluculated_tax;
    //                                 subObj.push(item.allocations[i]);
    //                             }
    //                         } else {

    //                             var subObj = [{
    //                                 "doc_code": item.docid,
    //                                 "doc_type": item.documentype,
    //                                 "line_number": fullDet[0].line_number,
    //                                 "doc_date": item.documentdate,
    //                                 "cost_center_id": that.SelectedCostCenterId,
    //                                 "tax_calc_date": tax_calc_date,
    //                                 "vendor_id": fullDet[0].vendor_id,
    //                                 "destination_address_id": that.SelectedLocationId,
    //                                 "origin_address_id": fullDet[0].origin_address_id,
    //                                 "use_id": localStorage.getItem('userId'),
    //                                 "tax_code": item.taxcode,
    //                                 "item_id": fullDet[0].item_id,
    //                                 "description": item.itemdescription,
    //                                 "quantity": item.quantity ? item.quantity : 0,
    //                                 "discount": fullDet[0].discount,
    //                                 "tax_included": fullDet[0].tax_included,
    //                                 "taxable_amount": item.taxable == "" ? null : item.taxable,
    //                                 "charged_tax": item.charged_tax ? item.charged_tax : 0,
    //                                 "total_amount": item.amount,
    //                                 "Ref1": that.SelectedCustomRef1,
    //                                 "Ref2": that.SelectedCustomRef2,
    //                                 "accrual_method": fullDet[0].accrual_method,
    //                                 "revenue_account_id": fullDet[0].revenue_account_id,
    //                                 "DestAddress": fullDet[0].dest_address,
    //                                 "DestCity": fullDet[0].dest_city,
    //                                 "DestRegion": fullDet[0].dest_region,
    //                                 "DestPostalCode": fullDet[0].dest_postal_code,
    //                                 "DestCountry": fullDet[0].dest_country,
    //                                 "OrigAddress": fullDet[0].org_address,
    //                                 "OrigCity": fullDet[0].org_city,
    //                                 "OrigRegion": fullDet[0].org_region,
    //                                 "OrigPostalCode": fullDet[0].org_postal_code,
    //                                 "OrigCountry": fullDet[0].org_country,
    //                                 "DestLocationCode": fullDet[0].dest_location_code,
    //                                 "OrigLocationCode": fullDet[0].org_location_code,
    //                                 "purchase_agent_id": fullDet[0].purchase_agent_id,
    //                                 "purchasing_order_number": fullDet[0].purchasing_order_number,
    //                                 "import_id": fullDet[0].import_id,
    //                                 "company_id": fullDet[0].company_id,
    //                                 "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
    //                                 "is_allocated": "",
    //                                 "allocation_method": "",
    //                                 "calculated_tax": item.caluculated_tax == "" ? null : item.caluculated_tax,
    //                                 "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
    //                                 "line_item_status": fullDet[0].line_item_status,
    //                                 "warning_status": fullDet[0].warning_status,
    //                                 "insert_user": localStorage.getItem('userId'),
    //                                 "cut_line_number": fullDet[0].cut_line_number,
    //                                 "processing_stage": null,
    //                                 "user_id": localStorage.getItem('userId'),
    //                                 "cut_proc_number": fullDet[0].cut_proc_number,
    //                                 "variance": that.setAcuural == false ? fullDet[0].variance : fullDet[0].accural_amount,
    //                                 //"variance":  fullDet[0].variance,
    //                                 // "variance": item.variance,
    //                                 "purpose_id": this.SelectedPurposeId,
    //                                 "error_code_id": fullDet[0].error_code_id,
    //                                 "islocked": null,
    //                                 "address": fullDet[0].org_address,
    //                                 "city": fullDet[0].org_city,
    //                                 "region": fullDet[0].org_region,
    //                                 "postal_code": fullDet[0].org_postal_code,
    //                                 "country": fullDet[0].org_country,
    //                                 "audit_note": Comments,
    //                                 "line_item_id": fullDet[0].line_item_id,
    //                                 "nontaxable": item.nontaxable ? item.nontaxable : 0,
    //                                 "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
    //                                 "documentname": item.documentname,
    //                                 "itemcode": item.itemcode,
    //                                 "status_code": item.itemstatus ? item.itemstatus : ""
    //                             }]
    //                         }

    //                         that.ajaxService.saveItem(subObj).subscribe(result => {
    //                             that.loader = false;
    //                             if (result.statuscode == 0) {
    //                                 that.editId = 0;
    //                                 that.selectedlineItems = [];
    //                                 that.setAcuural = false;
    //                                 that.applyFilter(that.p, that.GlobalfilterColoumn);
    //                                 that.toastr.success('Item has been saved successfully.');
    //                                 $('html, body').animate({
    //                                     scrollTop: 0
    //                                 }, 0);
    //                                 $('html, body').animate({
    //                                     scrollTop: that.toppositionget.top - 350
    //                                 }, 1000);
    //                                 setTimeout(function () {
    //                                     $('tbody#' + that.focusedLineItemId).addClass('focusitem');
    //                                     //document.getElementById(that.focusedLineItemId).scrollIntoView();
    //                                 }, 1000);
    //                             } else {
    //                                 that.toastr.error('Error');
    //                             }
    //                         }, error => {
    //                             that.toastr.error('Error.');
    //                             that.loader = false;
    //                         });
    //                     });
    //                 }

    //             }

    //         }
    //     } else {
    //         this.toastr.error('Please enter comments');
    //     }
    // }


    saveItem(item){
        var finalItems= [];
        if ($('#audit_note').val() != "") {

            this.loader = true;
            var Comments = $('#audit_note').val().replace("'", "''");
            this.focusedLineItemId = item.doc + item.cutlinenumber;
            var that = this;
            var tax_calc_date = this.formatDate($('#fromdate3').val());
            this.editId = 0;
            if (item.fulldetails) {
                var fullDet = item.fulldetails;

                item.fulldetails[0].taxable_amount = item.taxable;
                item.fulldetails[0].tax_calc_date =  tax_calc_date;
                item.fulldetails[0].document_name = item.documentname;
                item.fulldetails[0].doc_type = item.documentype;
                item.fulldetails[0].tax_code = item.itemcode;
                item.fulldetails[0].quantity = item.quantity;
                item.fulldetails[0].total_amount = item.amount;
                item.fulldetails[0].description = item.itemdescription;
                item.fulldetails[0].charged_tax = item.charged_tax;
                item.fulldetails[0].non_taxable_amount  = item.nontaxable == "" ? 0.00 : item.nontaxable ;
                item.fulldetails[0].destination_address_id = this.SelectedLocationId;
                item.fulldetails[0].costcenter_id = this.SelectedCostCenterId;
                item.fulldetails[0].purpose_id = this.SelectedPurposeId;
                item.fulldetails[0].ref1 = this.SelectedCustomRef1;
                item.fulldetails[0].ref2 = this.SelectedCustomRef2;
                item.fulldetails[0].audit_note = Comments;
                item.fulldetails[0].modifiedfields = item.modifiedfields;
                item.fulldetails[0].modify_fields = item.modifiedfields;
                item.fulldetails[0].marked_for_allocation = fullDet[0].marked_for_allocation == true ? 1 : 0;
                item.fulldetails[0].marked_for_review = fullDet[0].marked_for_review == true ? 1 : 0;

                if (fullDet.length > 0) {
                    // if(this.setAcuural == true){
                    //     if(item.itemstatus.indexOf('!') == -1){
                    //     item.itemstatus = item.itemstatus+"!";
                    //     }
                    //     //item.itemstatus = item.itemstatus+"!";          
                    // }    
                    if (this.isAmountItemsEdited == true) {
                        that.ajaxService.getAllocatedItems(item.lineitemid).subscribe(result => {
                                 if(JSON.parse(result.allocatedItemDetails)) {
                                     item.allocations = JSON.parse(result.allocatedItemDetails);
                                 }
                                 finalItems.push(item);
                                 this.ajaxService.calculate(finalItems).subscribe(result => {
                                    if(result.statuscode == 0) {
                                    this.toastr.success('Calculation initiated sucessfully.');
                                    this.selectedlineItems = [];
                                    this.selectedlineItems = [];
                                    this.applyFilter(this.p, this.GlobalfilterColoumn);
                                    this.loader = false;
                                    $('#calculateComments').val('');
                                    $('#calculateModal').modal('hide');
                                    } else {
                                        this.loader = false;
                                        this.toastr.error('Failed to initiate calculate');
                                    }
                                }, error => {
                                    this.loader = false;
                                    this.toastr.error('Failed to initiate calculate');
                                });
                        }, error => {
                            this.loader = false;
                            this.toastr.error('Error.');
                        });
                    } else {
                        // if (this.setAcuural == true) {
                        //     if (item.itemstatus.indexOf('!') == -1) {
                        //         item.itemstatus = item.itemstatus + "!";
                        //     }
                        //     //item.itemstatus = item.itemstatus+"!";          
                        // }
                        // Code for Allocation
                        that.ajaxService.getAllocatedItems(item.lineitemid).subscribe(result => {
                            that.loader = false;
                            if (result.allocatedItemDetails) {
                                item.allocations = JSON.parse(result.allocatedItemDetails);
                            }
                            if (item.allocations) {
                                var subObj = [{
                                    "doc_code": item.docid,
                                    "doc_type": item.documentype,
                                    "line_number": fullDet[0].line_number,
                                    "doc_date": item.documentdate,
                                    "cost_center_id": that.SelectedCostCenterId,
                                    "tax_calc_date": tax_calc_date,
                                    "vendor_id": fullDet[0].vendor_id,
                                    "destination_address_id": that.SelectedLocationId,
                                    "origin_address_id": fullDet[0].origin_address_id,
                                    "use_id": localStorage.getItem('userId'),
                                    "tax_code": item.taxcode,
                                    "item_id": fullDet[0].item_id,
                                    "description": item.itemdescription,
                                    "quantity": item.quantity ? item.quantity : 0,
                                    "discount": fullDet[0].discount,
                                    "tax_included": fullDet[0].tax_included,
                                    "taxable_amount": item.taxable == "" ? null : item.taxable,
                                    "charged_tax": item.charged_tax ? item.charged_tax : 0,
                                    "total_amount": item.amount,
                                    "Ref1": this.SelectedCustomRef1,
                                    "Ref2": this.SelectedCustomRef2,
                                    "revenue_account_id": fullDet[0].revenue_account_id,
                                    "DestAddress": fullDet[0].dest_address,
                                    "DestCity": fullDet[0].dest_city,
                                    "DestRegion": fullDet[0].dest_region,
                                    "DestPostalCode": fullDet[0].dest_postal_code,
                                    "DestCountry": fullDet[0].dest_country,
                                    "OrigAddress": fullDet[0].org_address,
                                    "OrigCity": fullDet[0].org_city,
                                    "OrigRegion": fullDet[0].org_region,
                                    "OrigPostalCode": fullDet[0].org_postal_code,
                                    "OrigCountry": fullDet[0].org_country,
                                    "DestLocationCode": fullDet[0].dest_location_code,
                                    "OrigLocationCode": fullDet[0].org_location_code,
                                    "purchase_agent_id": fullDet[0].purchase_agent_id,
                                    "purchasing_order_number": fullDet[0].purchasing_order_number,
                                    "import_id": fullDet[0].import_id,
                                    "company_id": fullDet[0].company_id,
                                    "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
                                    "is_allocated": "",
                                    "allocation_method": "",
                                    "accrual_method": fullDet[0].accrual_method,
                                    "calculated_tax": item.caluculated_tax == "" ? null : item.caluculated_tax,
                                    "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
                                    "line_item_status": fullDet[0].line_item_status,
                                    "warning_status": fullDet[0].warning_status,
                                    "insert_user": localStorage.getItem('userId'),
                                    "cut_line_number": fullDet[0].cut_line_number,
                                    "processing_stage": null,
                                    "user_id": localStorage.getItem('userId'),
                                    "cut_proc_number": fullDet[0].cut_proc_number,
                                    "variance": that.setAcuural == false ? fullDet[0].variance : fullDet[0].accural_amount,
                                    //"variance": fullDet[0].variance,
                                    // "variance": item.variance == item.accural_amount ? item.variance : item.accural_amount,
                                    "purpose_id": this.SelectedPurposeId,
                                    "error_code_id": fullDet[0].error_code_id,
                                    "islocked": null,
                                    "address": fullDet[0].org_address,
                                    "city": fullDet[0].org_city,
                                    "region": fullDet[0].org_region,
                                    "postal_code": fullDet[0].org_postal_code,
                                    "country": fullDet[0].org_country,
                                    "audit_note": Comments,
                                    "line_item_id": fullDet[0].line_item_id,
                                    "nontaxable": item.nontaxable ? item.nontaxable : 0,
                                    "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
                                    "documentname": item.documentname,
                                    "itemcode": item.itemcode,
                                    "status_code": item.itemstatus ? item.itemstatus : ""
                                }];
                                for (var i = 0; i < item.allocations.length; i++) {
                                    //item.allocations[i].taxable_amount = (parseFloat(item.taxable) * item.allocations[i].allocated_percentage) / 100;
                                    //item.allocations[i].total_amount = (parseFloat(item.totalAmount) * item.allocations[i].allocated_percentage) / 100;
                                    item.allocations[i].variance = that.setAcuural == true ? (item.allocations[i].allocated_percentage * fullDet[0].accural_amount) / 100 : parseFloat(item.allocations[i].charged_tax ? item.allocations[i].charged_tax : 0) - item.caluculated_tax;
                                    subObj.push(item.allocations[i]);
                                }
                            } else {

                                var subObj = [{
                                    "doc_code": item.docid,
                                    "doc_type": item.documentype,
                                    "line_number": fullDet[0].line_number,
                                    "doc_date": item.documentdate,
                                    "cost_center_id": that.SelectedCostCenterId,
                                    "tax_calc_date": tax_calc_date,
                                    "vendor_id": fullDet[0].vendor_id,
                                    "destination_address_id": that.SelectedLocationId,
                                    "origin_address_id": fullDet[0].origin_address_id,
                                    "use_id": localStorage.getItem('userId'),
                                    "tax_code": item.taxcode,
                                    "item_id": fullDet[0].item_id,
                                    "description": item.itemdescription,
                                    "quantity": item.quantity ? item.quantity : 0,
                                    "discount": fullDet[0].discount,
                                    "tax_included": fullDet[0].tax_included,
                                    "taxable_amount": item.taxable == "" ? null : item.taxable,
                                    "charged_tax": item.charged_tax ? item.charged_tax : 0,
                                    "total_amount": item.amount,
                                    "Ref1": that.SelectedCustomRef1,
                                    "Ref2": that.SelectedCustomRef2,
                                    "accrual_method": fullDet[0].accrual_method,
                                    "revenue_account_id": fullDet[0].revenue_account_id,
                                    "DestAddress": fullDet[0].dest_address,
                                    "DestCity": fullDet[0].dest_city,
                                    "DestRegion": fullDet[0].dest_region,
                                    "DestPostalCode": fullDet[0].dest_postal_code,
                                    "DestCountry": fullDet[0].dest_country,
                                    "OrigAddress": fullDet[0].org_address,
                                    "OrigCity": fullDet[0].org_city,
                                    "OrigRegion": fullDet[0].org_region,
                                    "OrigPostalCode": fullDet[0].org_postal_code,
                                    "OrigCountry": fullDet[0].org_country,
                                    "DestLocationCode": fullDet[0].dest_location_code,
                                    "OrigLocationCode": fullDet[0].org_location_code,
                                    "purchase_agent_id": fullDet[0].purchase_agent_id,
                                    "purchasing_order_number": fullDet[0].purchasing_order_number,
                                    "import_id": fullDet[0].import_id,
                                    "company_id": fullDet[0].company_id,
                                    "marked_for_allocation": fullDet[0].marked_for_allocation == true ? 1 : 0,
                                    "is_allocated": "",
                                    "allocation_method": "",
                                    "calculated_tax": item.caluculated_tax == "" ? null : item.caluculated_tax,
                                    "marked_for_review": fullDet[0].marked_for_review == true ? 1 : 0,
                                    "line_item_status": fullDet[0].line_item_status,
                                    "warning_status": fullDet[0].warning_status,
                                    "insert_user": localStorage.getItem('userId'),
                                    "cut_line_number": fullDet[0].cut_line_number,
                                    "processing_stage": null,
                                    "user_id": localStorage.getItem('userId'),
                                    "cut_proc_number": fullDet[0].cut_proc_number,
                                    "variance": that.setAcuural == false ? fullDet[0].variance : fullDet[0].accural_amount,
                                    //"variance":  fullDet[0].variance,
                                    // "variance": item.variance,
                                    "purpose_id": this.SelectedPurposeId,
                                    "error_code_id": fullDet[0].error_code_id,
                                    "islocked": null,
                                    "address": fullDet[0].org_address,
                                    "city": fullDet[0].org_city,
                                    "region": fullDet[0].org_region,
                                    "postal_code": fullDet[0].org_postal_code,
                                    "country": fullDet[0].org_country,
                                    "audit_note": Comments,
                                    "line_item_id": fullDet[0].line_item_id,
                                    "nontaxable": item.nontaxable ? item.nontaxable : 0,
                                    "accural": fullDet[0].accural_amount ? fullDet[0].accural_amount : 0,
                                    "documentname": item.documentname,
                                    "itemcode": item.itemcode,
                                    "status_code": item.itemstatus ? item.itemstatus : ""
                                }]
                            }

                            that.ajaxService.saveItem(subObj).subscribe(result => {
                                that.loader = false;
                                if (result.statuscode == 0) {
                                    that.editId = 0;
                                    that.selectedlineItems = [];
                                    that.setAcuural = false;
                                    that.applyFilter(that.p, that.GlobalfilterColoumn);
                                    that.toastr.success('Item has been saved successfully.');
                                    $('html, body').animate({
                                        scrollTop: 0
                                    }, 0);
                                    $('html, body').animate({
                                        scrollTop: that.toppositionget.top - 350
                                    }, 1000);
                                    setTimeout(function () {
                                        $('tbody#' + that.focusedLineItemId).addClass('focusitem');
                                        //document.getElementById(that.focusedLineItemId).scrollIntoView();
                                    }, 1000);
                                } else {
                                    that.toastr.error('Error');
                                }
                            }, error => {
                                that.toastr.error('Error.');
                                that.loader = false;
                            });
                        });
                    }

                }

            }
        } else {
            this.toastr.error('Please enter comments');
        }
    }

    sortData(colnum) {
        if (colnum == this.selColumn) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.selColumn = colnum;
        } else {
            this.sortOrder = 'asc';
            this.selColumn = colnum;
        }
        this.applyFilter(this.p, this.GlobalfilterColoumn);
    }
    selectItem(itemId) {
        if (this.selectedlineItems.indexOf(itemId) == -1) {
            this.selectedlineItems.push(itemId);
        } else {
            var index = this.selectedlineItems.indexOf(itemId);
            if (index !== -1) this.selectedlineItems.splice(index, 1);
        }
        this.selectAllButton();
    }
    selectAll() {
        for (var i = 0; i < this.transactions.itemlist.length; i++) {
            if (this.checkAll) {
                if (this.selectedlineItems.indexOf(this.transactions.itemlist[i].lineitemid) == -1) {
                    this.selectedlineItems.push(this.transactions.itemlist[i].lineitemid);
                }
            } else {
                var index = this.selectedlineItems.indexOf(this.transactions.itemlist[i].lineitemid);
                if (index !== -1) this.selectedlineItems.splice(index, 1);
            }
        }
    }
    selectAllButton() {
        this.checkAll = false;
        for (var i = 0; i < this.transactions.itemlist.length; i++) {
            if (this.selectedlineItems.indexOf(this.transactions.itemlist[i].lineitemid) == -1) {
                return true;
            }
        }
        this.checkAll = true;
    }

    okmarkforAllocate() {
        this.loader = true;
        this.ajaxService.markforallocation(this.selectedlineItems).subscribe(result => {
            this.loader = false;
            this.selectedlineItems = [];
            this.toastr.success('Success.');
            $('#markAllocationModal').modal('hide');
        }, error => {
            this.loader = false;
            this.toastr.error('Error.');
        });
    }
    bulkapply() {
        if (this.selectedlineItems.length == 0) {
            this.toastr.error('Please select atleast one item.');
            return false
        }
        if (this.selectedBulkAction == 'Markforallocation') {
            $('#markAllocationModal').modal('show');
            //    this.loader = true;
            //    this.ajaxService.markforallocation(this.selectedlineItems).subscribe(result => {
            //        this.loader = false;
            //        this.selectedlineItems = [];
            //        this.toastr.success('Success.');
            //    }, error => {
            //        this.loader = false;
            //        this.toastr.error('Error.');
            //    });  
        }
        if (this.selectedBulkAction == 'Allocate') {
            this.bulkAllocation = [];
            var ItemIds = "";
            if (this.selectedlineItems.length > 0) {
                ItemIds = "" + this.selectedlineItems[0];

                for (var i = 1; i < this.selectedlineItems.length; i++) {
                    ItemIds = ItemIds + "," + this.selectedlineItems[i];
                }

                this.ajaxService.getItemDetails(ItemIds, "EDIT").subscribe(result => {
                    this.bulkAllocationLineItemDetails = JSON.parse(result.lineitemdata);
                    console.log(this.bulkAllocationLineItemDetails);
                    $('#defineallocationmodal1').modal('show');
                    this.addAnotherBulkSec();
                });
            }


        }
        if (this.selectedBulkAction == 'Calculate') {
            $('#calculateModal').modal('show');
            //  this.loader = true;           
            //  this.ajaxService.calculate(this.selectedlineItems).subscribe(result => {
            //     this.selectedlineItems = [];
            //     this.toastr.success('Success.');
            //      this.loader = false;
            //  }, error => {
            //     this.loader = false;
            //     this.toastr.error('Error.');
            //  });  
        }
        if (this.selectedBulkAction == 'Confirmtransactios') {
            $('#confirmtransactionModal').modal('show');
            //  this.loader = true;           
            //  this.ajaxService.Confirmtransactios(this.selectedlineItems).subscribe(result => {
            //     this.selectedlineItems = [];
            //      this.toastr.success('Success.');
            //      this.loader = false;
            //  }, error => {
            //      this.loader = false;
            //      this.toastr.error('Error.');
            //  });  
        }
        if (this.selectedBulkAction == 'Committoavatax') {
            //$('#CommittoavataxModal').modal('show');

            var tempItemDetailsList = [];

            /*  for (var i = 0; i < this.selectedlineItems.length; i++) {
                  for(var j=0;j<this.transactions.itemlist.length;j++) {
                      if(this.selectedlineItems[i] == this.transactions.itemlist[j].lineitemid) {
                       tempItemDetailsList.push(this.transactions.itemlist[j]);
                       break;
                      }
                  }
              }
   
              console.log(tempItemDetailsList);
              var sameDocFlag = true;
              for(var h=1;h<tempItemDetailsList.length;h++) {
                  if(tempItemDetailsList[0].doc != tempItemDetailsList[h].doc) {
                      sameDocFlag = false;
                      break;
                  }
              }
   
              if(sameDocFlag==false) {
               this.toastr.error('You cannot commit transactions from different documents.');
               this.selectedlineItems = [];
               this.applyFilter(this.p, this.GlobalfilterColoumn);
               this.loader = false;
               $('#CommittoavataxComments').val('');
               $('#CommittoavataxModal').modal('hide');
              } else {*/
            $('#CommittoavataxModal').modal('show');
            // }

            //  this.loader = true;           
            //  this.ajaxService.Committoavatax(this.selectedlineItems).subscribe(result => {
            //      this.selectedlineItems = [];
            //      this.toastr.success('Success.');
            //      this.loader = false;
            //  }, error => {
            //      this.loader = false;
            //      this.toastr.error('Error.');
            //  });  
        }
        if (this.selectedBulkAction == 'Export') {
            $('#exporttransactionmodal').modal('show');
        }
        if (this.selectedBulkAction == 'Delete') {
            $('#deleteModal').modal('show');
        }
        if (this.selectedBulkAction == 'assignitemcodeortaxcode') {
           // $('#itemcodeforupdateitem').fastselect();
           // $('#assigntaxcodeinput').fastselect();
            $('#assignitemtax').modal('show');
        }
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
    openHistory(item) {
        this.loader = true;
        this.ajaxService.getLineItemHistory(item.docid, item.cutlinenumber).subscribe(result => {
            item.history = result;
            console.log(result);
            this.loader = false;
        });
    }
    addAnother(item) {
        var obj = {
            line_item_id: "",
            document_id: "",
            line_number: "",
            doc_date: "",
            cost_center_id: 0,
            tax_calc_date: null,
            vendor_id: "",
            use_id: "",
            tax_code: "",
            item_id: "",
            description: "",
            allocated_percentage: 100,
            discount: "",
            tax_included: "",
            taxable_amount: item.taxable,
            charged_tax: item.charged_tax,
            total_amount: "",
            ref1: null,
            ref2: null,
            rev_account: null,
            dest_address: "",
            dest_city: "",
            dest_region: "",
            dest_postal_code: "",
            dest_country: "",
            org_address: item.fulldetails[0].org_address,
            org_city: item.fulldetails[0].org_city,
            org_region: item.fulldetails[0].org_region,
            org_postal_code: item.fulldetails[0].org_postal_code,
            org_country: item.fulldetails[0].org_country,
            dest_location_code: "",
            org_location_code: "",
            purchasing_agent_code: null,
            purchasing_order_number: null,
            address: null,
            city: null,
            region: null,
            postal_code: null,
            country: null,
            import_id: "",
            company_id: null,
            cost_center_id_2: "",
            calculated_tax: item.caluculated_tax,
            marked_for_review: "",
            marked_for_allocation: "",
            line_item_status: "",
            warning_status: "",
            insert_user: "",
            cut_line_number: "",
            processing_stage: "",
            user_id: "",
            cut_proc_number: "",
            variance: item.variance,
            purpose_id: 0,
            error_code_id: "",
            islocked: "",
            audit_note: "",
            accrual: item.accrual,
            orderNumber: "",
            accrual_method: "DISTRIBUTED",
            "status_code": 'ALLOCATED'
        };
        if (item.fulldetails) {
            var fullDet = item.fulldetails;
            for (var j = 0; j < this.purpose.length; j++) {
                if (item.fulldetails[0].purpose_desc === this.purpose[j].purpose_desc) {
                    this.SelectedPurposeId = this.purpose[j].purpose_id;
                    break;
                }
            }
            for (var j = 0; j < this.custom1.length; j++) {
                if (item.fulldetails[0].ref1 === this.custom1[j].custom1) {
                    this.SelectedCustomRef1 = this.custom1[j].custom1_id;
                    break;
                }
            }
            for (var j = 0; j < this.custom2.length; j++) {
                if (item.fulldetails[0].ref2 === this.custom2[j].custom2) {
                    this.SelectedCustomRef2 = this.custom2[j].custom2_id;
                    break;
                }
            }
            for (var i = 0; i < this.costCenter.length; i++) {
                if (item.fulldetails[0].cost_center_name === this.costCenter[i].cost_center_name) {
                    this.SelectedCostCenterId = this.costCenter[i].cost_center_id;
                    break;
                }
            }

            if (fullDet.length > 0) {
                obj.line_item_id = fullDet[0].line_item_id;
                obj.document_id = fullDet[0].document_id;
                obj.line_number = fullDet[0].line_number;
                obj.doc_date = fullDet[0].doc_date;
                obj.cost_center_id = this.SelectedCostCenterId;
                obj.tax_calc_date = fullDet[0].tax_calc_date;
                obj.vendor_id = fullDet[0].vendor_id;
                obj.use_id = fullDet[0].use_id;
                obj.tax_code = fullDet[0].tax_code;
                obj.item_id = fullDet[0].item_id;
                obj.description = fullDet[0].description;
                obj.discount = fullDet[0].discount;
                obj.tax_included = fullDet[0].tax_included;
                obj.total_amount = fullDet[0].total_amount;
                obj.ref1 = this.SelectedCustomRef1;
                obj.ref2 = this.SelectedCustomRef2;
                obj.rev_account = fullDet[0].rev_account;
                obj.dest_address = fullDet[0].dest_address;
                obj.dest_city = fullDet[0].dest_city;
                obj.dest_region = fullDet[0].dest_region;
                obj.dest_postal_code = fullDet[0].dest_postal_code;
                obj.dest_country = fullDet[0].dest_country;
                obj.org_address = fullDet[0].org_address;
                obj.org_city = fullDet[0].org_city;
                obj.org_region = fullDet[0].org_region;
                obj.org_postal_code = fullDet[0].org_postal_code;
                obj.org_country = fullDet[0].org_country;
                obj.dest_location_code = fullDet[0].dest_location_code;
                obj.org_location_code = fullDet[0].org_location_code;
                obj.purchasing_agent_code = fullDet[0].purchasing_agent_code;
                obj.purchasing_order_number = fullDet[0].purchasing_order_number;
                obj.address = fullDet[0].org_address;
                obj.city = fullDet[0].org_city;
                obj.region = fullDet[0].org_region;
                obj.postal_code = fullDet[0].org_postal_code;
                obj.country = fullDet[0].org_country;
                obj.import_id = fullDet[0].import_id;
                obj.company_id = fullDet[0].company_id;
                obj.cost_center_id_2 = null;
                obj.marked_for_review = fullDet[0].marked_for_review;
                obj.marked_for_allocation = fullDet[0].marked_for_allocation;
                obj.line_item_status = fullDet[0].line_item_status;
                obj.warning_status = fullDet[0].warning_status;
                obj.insert_user = fullDet[0].insert_user;
                obj.cut_line_number = fullDet[0].cut_line_number;
                obj.processing_stage = null;
                obj.user_id = fullDet[0].doc_user_id;
                obj.cut_proc_number = fullDet[0].cut_proc_number;
                obj.purpose_id = this.SelectedPurposeId;
                obj.error_code_id = fullDet[0].error_code_id;
                obj.islocked = null;
                obj.audit_note = fullDet[0].line_audit_note;
            }
        }
        if (item.allocations.length === 0) {
            obj.allocated_percentage = 100;
            obj.taxable_amount = item.taxable;
            obj.charged_tax = item.charged_tax;
            obj.calculated_tax = item.caluculated_tax;
            obj.variance = item.variance;
        } else {
            obj.allocated_percentage = 0;
            obj.taxable_amount = 0;
            obj.charged_tax = 0;
            obj.calculated_tax = 0;
            obj.variance = 0;
        }
        item.allocations.push(obj);
    }
    askfordeleteallocation(index, item) {
        this.index = index;
        this.item = item;
       // $('#deleteallocationModal').modal('show');
       this.okDeleteRow();
       this.changePercentValueAfterDelete(item,index);
    }

    okDeleteRow() {
        this.item.allocations[0].quantity = parseFloat(this.item.allocations[0].quantity) + parseFloat(this.item.allocations[this.index].quantity);
        this.item.allocations[0].taxable_amount = parseFloat(this.item.allocations[0].taxable_amount) + parseFloat(this.item.allocations[this.index].taxable_amount);
        this.item.allocations[0].charged_tax = parseFloat(this.item.allocations[0].charged_tax) + parseFloat(this.item.allocations[this.index].charged_tax);
        this.item.allocations[0].calculated_tax = parseFloat(this.item.allocations[0].calculated_tax) + parseFloat(this.item.allocations[this.index].calculated_tax);
        this.item.allocations[0].variance = parseFloat(this.item.allocations[0].variance) + parseFloat(this.item.allocations[this.index].variance);
        this.item.allocations.splice(this.index, 1);
        $('#deleteallocationModal').modal('hide');
    }

    deleteRow(index, item) {
        if (confirm("Are you sure want to continue?")) {
            item.allocations[0].quantity = parseFloat(item.allocations[0].quantity) + parseFloat(item.allocations[index].quantity);
            item.allocations[0].taxable_amount = parseFloat(item.allocations[0].taxable_amount) + parseFloat(item.allocations[index].taxable_amount);
            item.allocations[0].charged_tax = parseFloat(item.allocations[0].charged_tax) + parseFloat(item.allocations[index].charged_tax);
            item.allocations[0].calculated_tax = parseFloat(item.allocations[0].calculated_tax) + parseFloat(item.allocations[index].calculated_tax);
            item.allocations[0].variance = parseFloat(item.allocations[0].variance) + parseFloat(item.allocations[index].variance);
            item.allocations.splice(index, 1);
        }
    }
    allocateItem(item) {
        this.idgetclicked = item.doc + item.cutlinenumber;
        this.toppositionget = $('tbody#' + this.idgetclicked).offset();
        var totPercent = 0;
        var error = false;
        var that = this;
        var orderNumber = [];
        for (var i = 0; i < item.allocations.length; i++) {
            item.allocations[i].submit = true;
            totPercent = totPercent + item.allocations[i].allocationnum;
            if (!item.allocations[i].company_id ||
                // !item.allocations[i].cost_center_id || !item.allocations[i].purpose_id ||
                !item.allocations[i].accrual_method) {
                error = true;
            }
            item.allocations[i].accrual = item.allocations[i].accrual_method;
            item.allocations[i].total_amount = (parseFloat(item.fulldetails[0].total_amount) * item.allocations[i].allocated_percentage) / 100;
            item.allocations[i].orderNumber = i;
            if (item.fulldetails[0].marked_for_allocation == true) {
                item.allocations[i].marked_for_allocation = 1;
                item.allocations[i].status_code = 'MARTOALLO';
                // if(this.isAllocationAmountItemsEdited) {
                // item.allocations[i].status_code ='ALLOCATED';
                // }else{
                // item.allocations[i].status_code ='MARTOALLO';
                // }
            } else {
                item.allocations[i].marked_for_allocation = 0;
                item.allocations[i].status_code = 'ALLOCATED';
                // if(item.allocations.length > 1){
                //     item.allocations[i].status_code ='ALLOCATED';
                // }
            }




        }
        if (error) {
            this.toastr.error('Please enter all the required fields');
            return false;
        }
        if (totPercent === 100) {
            this.toastr.error('Please keep aggregate percentage equal to 100.');
            return false;
        }
        this.splitId = 0;
        this.loader = true;
        /*****************************************************************************************/
        var client = new Avatax(config).withSecurity(creds);
        console.log(client);
        var fullDet = item.fulldetails;

        var createTransactionObj = {
            "lines": [],
            "type": "PurchaseInvoice",
            "companyCode": "ICONICSOLUTIONS",
            "date": fullDet[0].doc_date,
            "customerCode": "ICONICSOLUTIONS-Customer",
            "purchaseOrderNo": fullDet[0].doc_code,
            "commit": false,
            "code": fullDet[0].doc_code,
            "currencyCode": "USD",
            "description": "Commit"
        }

        for (var i = 0; i < item.allocations.length; i++) {

            createTransactionObj.lines.push(
                {
                    "number": i + 1,
                    "quantity": (parseFloat(fullDet[0].quantity) * item.allocations[i].allocated_percentage) / 100,
                    "amount": item.allocations[i].taxable_amount,
                    "taxCode": item.taxcode,
                    "itemCode": item.allocations[i].item_id,
                    "description": "Commit",
                    "addresses": {
                        "shipFrom": {
                            "line1": fullDet[0].org_address == null ? "" : fullDet[0].org_address,
                            "city": fullDet[0].org_city == null ? "" : fullDet[0].org_city,
                            "region": fullDet[0].org_region == null ? "" : fullDet[0].org_region,
                            "country": fullDet[0].org_country == null ? "" : fullDet[0].org_country,
                            "postalCode": fullDet[0].org_postal_code == null ? "" : fullDet[0].org_postal_code
                        },
                        "shipTo": {
                            "line1": item.allocations[i].dest_address,
                            "city": item.allocations[i].dest_city,
                            "region": item.allocations[i].dest_region,
                            "country": item.allocations[i].dest_country,
                            "postalCode": item.allocations[i].dest_postal_code
                        }
                    }
                }
            );
        }

        /*******************Recalculating Tax********************/

        $.ajax({
            timeout: 0,
            type: 'POST',
            async: true,
            url: client.baseUrl + '/api/v2/transactions/createoradjust',
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify({
                createTransactionModel: createTransactionObj
            })
            , headers: {
                'Authorization': client.auth
            },
            success: function (json) {
                console.log("After Allocation Calculation JSON is : " + json);
                for (var i = 0; i < json.lines.length; i++) {
                    for (var j = 0; j < item.allocations.length; j++) {
                        if (json.lines[i].lineNumber == (j + 1)) {
                            item.allocations[j].calculated_tax = json.lines[i].taxCalculated;
                            item.allocations[j].variance = parseFloat(item.allocations[j].charged_tax ? item.allocations[j].charged_tax : 0) - json.lines[i].taxCalculated;
                        }
                    }
                }

                console.log(item);
                that.ajaxService.allocateItem(item.allocations, item.lineitemid).subscribe(result => {
                    item.history = result;
                    that.loader = false;
                    that.toastr.success('Saved successfully.');
                    item.splitcount = item.allocations.length;
                    that.selectedlineItems = [];
                    that.applyFilter(that.p, that.GlobalfilterColoumn);

                    $('html, body').animate({
                        scrollTop: 0
                    }, 0);
                    $('html, body').animate({
                        scrollTop: that.toppositionget.top - 350
                    }, 1000);

                }, error => {
                    that.toastr.error('Error.');
                    that.loader = false;
                });

                that.loader = false;

            }, error: function (jqXHR, exception) {
                console.log(exception);
                //that.loader = false;
                var def = JSON.parse(jqXHR.responseText);
                if (def.error.message) {
                    that.toastr.error("We cannot recalculate tax," + def.error.message);
                }
                that.ajaxService.allocateItem(item.allocations, item.lineitemid).subscribe(result => {
                    item.history = result;
                    that.loader = false;
                    that.toastr.success('Saved successfully.');
                    item.splitcount = item.allocations.length;
                    that.selectedlineItems = [];
                    that.applyFilter(that.p, that.GlobalfilterColoumn);
                    $('html, body').animate({
                        scrollTop: 0
                    }, 0);
                    $('html, body').animate({
                        scrollTop: that.toppositionget.top - 350
                    }, 1000);

                }, error => {
                    that.toastr.error('Error.');
                    that.loader = false;
                });

            }
        });

        /***************************************/



        /*****************************************************************************************/





    }
    onItemSelect(selected, allocation) {
        allocation.dest_location_code = selected.originalObject.locationcode;
        allocation.dest_country = selected.originalObject.country;
        allocation.dest_address = selected.originalObject.address;
        allocation.dest_city = selected.originalObject.city;
        allocation.dest_region = selected.originalObject.region;
        allocation.dest_postal_code = selected.originalObject.postalcode;
    }
    changePercentValueAfterDelete(item,index) {
        var that = this;
        var totQuant = 0;
        var allquantity = 0;
            for (var i = 1; i < item.allocations.length; i++) {
                allquantity = allquantity + parseFloat(item.allocations[i].allocated_percentage);
            }
            item.allocations[0].allocated_percentage = 100 - allquantity;
    }
    onchangebulkpercent(event, item, index) {
        var that = this;
        var totQuant = 0;
        if (event.target.value != "") {

            this.timeout = setTimeout(function () {

                if (event.target.value < 0 || event.target.value > 100) {
                    that.toastr.error('Please enter valid percentage.');
                    return false;
                }

                var totQuant = parseFloat(that.bulkAllocation[0].allocated_percentage) + parseFloat(that.bulkAllocation[index].allocated_percentage);
                if (totQuant - event.target.value < 0) {
                    that.toastr.error('Please enter the percentage on or below ' + that.bulkAllocation[0].allocated_percentage);
                    return false;
                }

                if (index > 0 && event.target.value) {
                    item[index].allocated_percentage = event.target.value;
                    item[0].allocated_percentage = totQuant - event.target.value;
                }

            }, 400)
        } else {
            var allquantity = 0;
            for (var i = 1; i < item.length - 1; i++) {
                allquantity = allquantity + parseFloat(item[i].allocated_percentage);
            }
            item[0].allocated_percentage = 100 - allquantity - event.target.value;
            this.bulkAllocation[index].allocated_percentage = 0;
        }

    }

    onchangepercent(evnt, item, index) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        var that = this;
        this.timeout = setTimeout(function () {
            if (evnt.target.value < 0 || evnt.target.value > 100) {
                that.toastr.error('Please enter valid percentage.');
                return false;
            }
            var totQuant = parseFloat(item.allocations[0].allocated_percentage) + parseFloat(item.allocations[index].allocated_percentage);
            if (totQuant - evnt.target.value < 0) {
                that.toastr.error('Please enter the percentage on or below ' + item.allocations[0].allocated_percentage);
                return false;
            }
            if (index > 0 && evnt.target.value) {
                item.allocations[index].allocated_percentage = evnt.target.value;

                var totTaxAmount = parseFloat(item.allocations[0].taxable_amount) + parseFloat(item.allocations[index].taxable_amount);
                item.allocations[0].taxable_amount = (totTaxAmount / totQuant) * (totQuant - evnt.target.value);
                item.allocations[index].taxable_amount = (totTaxAmount / totQuant) * item.allocations[index].allocated_percentage;

                var charged_tax = parseFloat(item.allocations[0].charged_tax) + parseFloat(item.allocations[index].charged_tax);
                item.allocations[0].charged_tax = (charged_tax / totQuant) * (totQuant - evnt.target.value);
                item.allocations[index].charged_tax = (charged_tax / totQuant) * item.allocations[index].allocated_percentage;

                var calculated_tax = parseFloat(item.allocations[0].calculated_tax) + parseFloat(item.allocations[index].calculated_tax);
                item.allocations[0].calculated_tax = (calculated_tax / totQuant) * (totQuant - evnt.target.value);
                item.allocations[index].calculated_tax = (calculated_tax / totQuant) * item.allocations[index].allocated_percentage;

                var variance = parseFloat(item.allocations[0].variance) + parseFloat(item.allocations[index].variance);
                item.allocations[0].variance = (variance / totQuant) * (totQuant - evnt.target.value);
                item.allocations[index].variance = (variance / totQuant) * item.allocations[index].allocated_percentage;

                item.allocations[0].allocated_percentage = totQuant - evnt.target.value;
            }
        }, 200)
    }
    saveSel() {
        if ($("#selDispColumn").val()) {
            localStorage.setItem('selDispColumn', $("#selDispColumn").val().join(','));
            this.selDispColumn = $("#selDispColumn").val();
        } else {
            localStorage.setItem('selDispColumn', '');
            this.selDispColumn = '';
        }
        this.toastr.success('Saved successfully.');
        $('#ColumnsModal').modal('hide');
    }
    cancelSel() {
        if (localStorage.getItem("selDispColumn")) {
            var value = localStorage.getItem("selDispColumn");
        } else {
            var value = ''
        }
        $('#selDispColumn option').each(function () {
            if (value.indexOf($(this).val()) >= 0) {
                $(this).attr('selected', 'selected');
            } else {
                $(this).attr('selected', false);
            }

        });
        $('#selDispColumn').data('fastselect').destroy();
        $('#selDispColumn').fastselect();
        $('#ColumnsModal').modal('hide');
    }
    confirmTrans(item) {
        this.loader = true;
        this.ajaxService.Confirmtransactios([item.lineitemid]).subscribe(result => {
            this.toastr.success('Success.');
            this.applyFilter(this.p, this.GlobalfilterColoumn);
            this.loader = false;
        }, error => {
            this.loader = false;
            this.toastr.error('Error.');
        });
    }
    commitToAva(item) {
        this.loader = true;
        var that = this;
        var finalLineItemIds = '';
        var orderNumber = [];
        this.ajaxService.getItemDetails(item.lineitemid, "COMMIT").subscribe(result => {
            //    item.fulldetails = JSON.parse(result.lineitemdata);

            if (result.statusmessage == "success") {
                that.ajaxService.Committoavatax(item.lineitemid, 'MANCOM').subscribe(response => {
                    that.toastr.success('commit to AvaTax sucessfully.');
                    that.selectedlineItems = [];
                    that.selectedlineItems = [];
                    that.applyFilter(that.p, that.GlobalfilterColoumn);
                    that.loader = false;
                    $('#CommittoavataxComments').val('');
                    $('#CommittoavataxModal').modal('hide');
                }, error => {
                    that.loader = false;
                    that.toastr.error('Error.');
                });
            } else if (result.statuscode == "-1") {
                that.loader = false;
                that.toastr.error('Failed to initiate commit');
            }

            //    var client = new Avatax(config).withSecurity(creds);
            //    console.log(client);
            //    var fullDet = item.fulldetails[0];

            //    var createTransactionObj = {
            //        "lines":[],
            //          "type":"PurchaseInvoice",
            //          "companyCode":"ICONICSOLUTIONS",
            //          "date":fullDet.doc_date,
            //          "customerCode":"ICONICSOLUTIONS-Customer",
            //          "purchaseOrderNo":fullDet.doc_code,
            //          "commit":true,
            //          "code":fullDet.doc_code,
            //          "currencyCode":"USD",
            //          "description":"Commit"
            //  }

            //    for (var i = 0; i < item.fulldetails.length; i++) {

            //        createTransactionObj.lines.push(
            //            {
            //                "number":i+1,
            //                "quantity":parseFloat(item.fulldetails[i].quantity),
            //                "amount":item.fulldetails[i].taxable_amount,
            //                "taxCode":item.fulldetails[i].taxcode == undefined ? null :item.fulldetails[i].taxcode,
            //                "itemCode":item.fulldetails[i].item_id,
            //                "description":"Commit",
            //                "addresses": {
            //                    "shipFrom": {
            //                        "line1":item.fulldetails[i].org_address==null?"":item.fulldetails[i].org_address,
            //                        "city":item.fulldetails[i].org_city==null?"":item.fulldetails[i].org_city,
            //                        "region":item.fulldetails[i].org_region==null?"":item.fulldetails[i].org_region,
            //                        "country":item.fulldetails[i].org_country==null?"":item.fulldetails[i].org_country,
            //                        "postalCode":item.fulldetails[i].org_postal_code==null?"":item.fulldetails[i].org_postal_code
            //                    },
            //                    "shipTo": {
            //                        "line1": item.fulldetails[i].dest_address,
            //                        "city": item.fulldetails[i].dest_city,
            //                        "region": item.fulldetails[i].dest_region,
            //                        "country": item.fulldetails[i].dest_country,
            //                        "postalCode": item.fulldetails[i].dest_postal_code
            //                      }
            //                }
            //              }
            //        );
            //            }

            //            console.log(createTransactionObj);

            //      /*******************Recalculating Tax********************/

            //      $.ajax({
            //        timeout: 0,
            //        type: 'POST',
            //        async: true,
            //        url: client.baseUrl + '/api/v2/transactions/createoradjust',
            //        contentType: 'application/json',
            //        dataType: "json",
            //        data: JSON.stringify({
            //            createTransactionModel: createTransactionObj
            //        })
            //        ,headers: {
            //            'Authorization': client.auth
            //          },
            //        success: function (json) {
            //          console.log("After Allocation Calculation JSON is : "+json);
            //          that.loader = false;

            //          finalLineItemIds = "" + item.fulldetails[0].line_item_id;

            //         for(var i=1;i<item.fulldetails.length;i++) {
            //             finalLineItemIds = finalLineItemIds + "," + item.fulldetails[i].line_item_id;
            //         }

            //         that.ajaxService.Committoavatax(finalLineItemIds,'MANCOM').subscribe(result => {
            //             that.toastr.success('commit to AvaTax sucessfully.');
            //             that.selectedlineItems = [];
            //             that.selectedlineItems = [];
            //             that.applyFilter(that.p, that.GlobalfilterColoumn);
            //             that.loader = false;
            //             $('#CommittoavataxComments').val('');
            //             $('#CommittoavataxModal').modal('hide');
            //         }, error => {
            //             that.loader = false;
            //             that.toastr.error('Error.');
            //         });

            //        },error: function (jqXHR, exception) { 
            //            console.log(exception);
            //            //that.loader = false;
            //            var def = JSON.parse(jqXHR.responseText);
            //            if(def.error.message) {
            //                that.toastr.error("We cannot recalculate tax,"+def.error.message);
            //            }

            //            finalLineItemIds = "" + item.fulldetails[0].lineitemid;

            //         for(var i=1;i<item.fulldetails.length;i++) {
            //             finalLineItemIds = finalLineItemIds + "," + item.fulldetails[i].lineitemid;
            //         }

            //         that.ajaxService.Committoavatax(finalLineItemIds,'CALCFAILED').subscribe(result => {
            //             that.toastr.success('commit to AvaTax sucessfully.');
            //             that.selectedlineItems = [];
            //             that.selectedlineItems = [];
            //             that.applyFilter(that.p, that.GlobalfilterColoumn);
            //             that.loader = false;
            //             $('#CommittoavataxComments').val('');
            //             $('#CommittoavataxModal').modal('hide');
            //         }, error => {
            //             that.loader = false;
            //             that.toastr.error('Error.');
            //         });

            //        }
            //    }); 
        });


        //    this.ajaxService.Committoavatax([item.lineitemid]).subscribe(result => {
        //        this.toastr.success('Success.');
        //        this.loader = false;
        //    }, error => {
        //        this.loader = false;
        //        this.toastr.error('Error.');
        //    });         
    }
    cancelItem(index) {
        this.splitId = 0;
        this.editId = 0;
        this.transactions.itemlist[index] = this.backup;
    }
    cancelAllocItem(index) {
        this.splitId = 0;
        this.editId = 0;
        this.transactions.itemlist[index] = this.backup;
    }
    saveInfo() {
        if ($('#itemcodeforupdateitem').val() == null && $('#taxcodeforupdateitem').val() == null && $('#itemcodeforupdateitem').val() == "" && $('#taxcodeforupdateitem').val() == "") {
            this.toastr.error('Please enter tax code or item code to continue.');
            return false;
        }

        this.loader = true;
        var obj = {
            "lineitemsjsondata": JSON.stringify([{
                "taxcode": $('#taxcodeforupdateitem').val(),
                "itemcode": $('#itemcodeforupdateitem').val(),
                "comment": this.commentsupdateItem,
                "lineitemids": this.selectedlineItems.join(','),
                "companyid": localStorage.getItem("seleCompany")
            }])
        }
        this.ajaxService.saveTaxorItemCode(obj).subscribe(result => {
            this.toastr.success('Success.');
            this.taxcodeforupdateitem = "";
            this.itemcodeforupdateitem = "";
            this.loader = false;
            var divitems = document.getElementsByClassName('fstResultItem');  
            console.log(divitems);

            for(var i=0;i<divitems.length;i++) {
                if(divitems[i].innerHTML == " Select One ") {
                    divitems[i].className = 'fstResultItem fstSelected'
                } else {
                    divitems[i].className = 'fstResultItem'
                }
            }
            var selecteditems = document.getElementsByClassName('fstToggleBtn');  
            console.log(selecteditems);
            for(var i=0;i<selecteditems.length;i++) {
                selecteditems[i].innerHTML = " Select One ";
            }

            document.getElementById('itemcodeforupdateitem').innerHTML = "";
            document.getElementById('taxcodeforupdateitem').innerHTML = "";
            this.commentsupdateItem = '';
            this.selectedlineItems = [];
            this.applyFilter(this.p, this.GlobalfilterColoumn);
            $('#assignitemtax').modal('hide');
        }, error => {
            this.loader = false;
            this.toastr.error('Error.');
        });
    }
    openDynamicCol() {
        $('#dynamicColumnsModal').modal('show');
    }
    saveDynamicCol() {
        if ($("#selDynaColumn").val()) {
            localStorage.setItem('selDynaColumn', $("#selDynaColumn").val());
            this.selDynaColumn = $("#selDynaColumn").val();
        } else {
            localStorage.setItem('selDynaColumn', '');
            this.selDynaColumn = '';
        }
        this.toastr.success('Saved successfully.');
        $('#dynamicColumnsModal').modal('hide');
    }
    cancelDynaSel() {
        if (localStorage.getItem("selDynaColumn")) {
            var value = localStorage.getItem("selDynaColumn");
        } else {
            var value = 'costcenters'
        }
        $('#selDynaColumn option').each(function () {
            if (value.indexOf($(this).val()) >= 0) {
                $(this).prop('selected', 'selected');
            } else {
                $(this).prop('selected', false);
            }
        });
        $('#dynamicColumnsModal').modal('hide');
    }
    okDel() {
        if (!$('#deleteComments').val()) {
            this.toastr.error('Please enter comments.');
            return false;
        }
        this.loader = true;
        var foundflag = false;
        var tempItemDetailsList = [];
        for (var i = 0; i < this.selectedlineItems.length; i++) {
            for (var j = 0; j < this.transactions.itemlist.length; j++) {
                if (this.selectedlineItems[i] == this.transactions.itemlist[j].lineitemid) {
                    tempItemDetailsList.push(this.transactions.itemlist[j]);
                    break;
                }
            }
        }

        for(var x = 0;x<tempItemDetailsList.length;x++) {
            if(tempItemDetailsList[x].itemstatus == 'MANCOM' || tempItemDetailsList[x].itemstatus == 'AUTOCOM') {
                foundflag = true;
                break;
            }
        }

        if(foundflag == true) {
            this.toastr.error('You cannot delete already committed items');
            this.loader = false;
            $('#deleteComments').val('');
            $('#deleteModal').modal('hide');
            return false;
        }

        this.ajaxService.deleteLineItems($('#deleteComments').val(), this.selectedlineItems).subscribe(result => {
            this.toastr.success('Deleted sucessfully.');
            this.selectedlineItems = [];
            this.selectedlineItems = [];
            this.applyFilter(this.p, this.GlobalfilterColoumn);
            this.loader = false;
            $('#deleteComments').val('');
            $('#deleteModal').modal('hide');
        }, error => {
            this.loader = false;
            this.toastr.error('Error.');
        });
    }
    markAllocate() {
        if (!$('#markallocateComments').val()) {
            this.toastr.error('Please enter comments.');
            return false;
        }
        this.loader = true;
        this.ajaxService.markforallocation(this.selectedlineItems).subscribe(result => {
            this.toastr.success('MarkAllocation sucessfully.');
            this.selectedlineItems = [];
            this.selectedlineItems = [];
            this.applyFilter(this.p, this.GlobalfilterColoumn);
            this.loader = false;
            $('#markallocateComments').val('');
            $('#markAllocationModal').modal('hide');
        }, error => {
            this.loader = false;
            this.toastr.error('Error.');
        });
    }
    calculate() {
        var item;
        var successcount = 0;
        var tax_calc_date;
        var that = this;
        if (!$('#calculateComments').val()) {
            this.toastr.error('Please enter comments.');
            return false;
        }
        this.loader = true;

        var tempItemDetailsList = [];
        for (var i = 0; i < this.selectedlineItems.length; i++) {
            for (var j = 0; j < this.transactions.itemlist.length; j++) {
                if (this.selectedlineItems[i] == this.transactions.itemlist[j].lineitemid) {
                    tempItemDetailsList.push(this.transactions.itemlist[j]);
                    break;
                }
            }
        }
        this.ajaxService.getItemDetails(this.selectedlineItems.join(','), "EDIT").subscribe(result => {
            var itemDataList = JSON.parse(result.lineitemdata);
            for (var l = 0; l < itemDataList.length; l++) {
                for (var z = 0; z < tempItemDetailsList.length; z++) {
                    if (itemDataList[l].line_item_id == tempItemDetailsList[z].lineitemid) {
                        tempItemDetailsList[z].fulldetails = [];
                        tempItemDetailsList[z].fulldetails[0] = itemDataList[l];
                        break;
                    }
                }
            }

            console.log(tempItemDetailsList);
            var count = 0;

            for(var x=0;x<tempItemDetailsList.length;x++) {
                that.ajaxService.getAllocatedItems(tempItemDetailsList[x].lineitemid).subscribe(allocationres => {
                    count = count + 1;
                    for (var z = 0; z < tempItemDetailsList.length; z++) {
                        if (allocationres.allocatedItemDetails != null && JSON.parse(allocationres.allocatedItemDetails)[0].line_item_id == tempItemDetailsList[z].lineitemid) {
                            tempItemDetailsList[z].allocations = [];
                            tempItemDetailsList[z].allocations = JSON.parse(allocationres.allocatedItemDetails);
                            break;
                        }
                    }

                    if(count==tempItemDetailsList.length) {
                        console.log(tempItemDetailsList);
                        var completeJSON = JSON.stringify(tempItemDetailsList);
                        for(var i=0;i<tempItemDetailsList.length;i++) {
                            tempItemDetailsList[i].fulldetails[0].audit_note = $('#calculateComments').val();
                            tempItemDetailsList[i].fulldetails[0].line_audit_note = $('#calculateComments').val();
                        }
                        console.log(completeJSON);
                        this.ajaxService.calculate(tempItemDetailsList).subscribe(result => {
                            this.toastr.success('calculation sucessfully.');
                            this.selectedlineItems = [];
                            this.selectedlineItems = [];
                            this.applyFilter(this.p, this.GlobalfilterColoumn);
                            this.loader = false;
                            $('#calculateComments').val('');
                            $('#calculateModal').modal('hide');
                        }, error => {
                            this.loader = false;
                            this.toastr.error('Error.');
                        });
                        
                    }
                });
            }
        });

        
    }
    confirmTransaction() {
        if (!$('#confirmtransComments').val()) {
            this.toastr.error('Please enter comments.');
            return false;
        }
        this.loader = true;
        this.ajaxService.Confirmtransactios(this.selectedlineItems).subscribe(result => {
            this.toastr.success('confirm transaction sucessfully.');
            this.selectedlineItems = [];
            this.selectedlineItems = [];
            this.applyFilter(this.p, this.GlobalfilterColoumn);
            this.loader = false;
            $('#confirmtransComments').val('');
            $('#confirmtransactionModal').modal('hide');
        }, error => {
            this.loader = false;
            this.toastr.error('Error.');
        });
    }
    Committoavatax() {
        var ItemIds = '';
        var that = this;
        var finalLineItemIds = '';
        if (!$('#CommittoavataxComments').val()) {
            this.toastr.error('Please enter comments.');
            return false;
        }
        this.loader = true;
        if (this.selectedlineItems.length > 0) {
            /* ItemIds = "" + this.selectedlineItems[0];
         
         for(var i=1;i<this.selectedlineItems.length;i++) {
             ItemIds = ItemIds + "," + this.selectedlineItems[i];
         } */

            var tempItemDetailsList = [];
            for (var i = 0; i < this.selectedlineItems.length; i++) {
                for (var j = 0; j < this.transactions.itemlist.length; j++) {
                    if (this.selectedlineItems[i] == this.transactions.itemlist[j].lineitemid) {
                        tempItemDetailsList.push(this.transactions.itemlist[j]);
                        break;
                    }
                }
            }
            var docCodesList = [];
            docCodesList.push(tempItemDetailsList[0].doc);
            ItemIds = "" + tempItemDetailsList[0].lineitemid;

            for (var j = 1; j < tempItemDetailsList.length; j++) {
                var docCodePresentFlag = false;
                for (var k = 0; k < docCodesList.length; k++) {
                    if (tempItemDetailsList[j].doc == docCodesList[k]) {
                        docCodePresentFlag = true;
                    }
                }

                if (docCodePresentFlag == false) {
                    docCodesList.push(tempItemDetailsList[j].doc);
                    ItemIds = ItemIds + "," + tempItemDetailsList[j].lineitemid;
                }
            }

            console.log();

            this.ajaxService.getItemDetails(ItemIds, "COMMIT").subscribe(result => {
                console.log(result);
                // if(that.item == null) {
                //     that.item = {fulldetails:[]};
                // }

                if (result.statusmessage == "success") {

                    finalLineItemIds = "" + that.selectedlineItems[0];

                    for (var i = 1; i < that.selectedlineItems.length; i++) {
                        finalLineItemIds = finalLineItemIds + "," + that.selectedlineItems[i];
                    }

                    that.ajaxService.Committoavatax(finalLineItemIds, 'MANCOM').subscribe(res => {
                        that.toastr.success('commit to AvaTax sucessfully.');
                        that.selectedlineItems = [];
                        that.selectedlineItems = [];
                        that.applyFilter(that.p, that.GlobalfilterColoumn);
                        that.loader = false;
                        $('#CommittoavataxComments').val('');
                        $('#CommittoavataxModal').modal('hide');
                    }, error => {
                        that.loader = false;
                        that.toastr.error('Error.');
                    });
                } else if (result.statuscode == "-1") {
                    that.loader = false;
                    that.toastr.error('Failed to initiate commit');
                }

                //     that.item.fulldetails = JSON.parse(result.lineitemdata);

                //    var client = new Avatax(config).withSecurity(creds);
                //    console.log(client);
                //    var fullDet = this.item.fulldetails[0];

                //    var createTransactionObj = {
                //        "lines":[],
                //          "type":"PurchaseInvoice",
                //          "companyCode":"ICONICSOLUTIONS",
                //          "date":fullDet.doc_date,
                //          "customerCode":"ICONICSOLUTIONS-Customer",
                //          "purchaseOrderNo":fullDet.doc_code,
                //          "commit":true,
                //          "code":fullDet.doc_code,
                //          "currencyCode":"USD",
                //          "description":"Commit"
                //  }

                //    for (var i = 0; i < that.item.fulldetails.length; i++) {
                //    // item.allocations[i].orderNumber = i;
                //        createTransactionObj.lines.push(
                //            {
                //                "number":i+1,
                //                "quantity":parseFloat(that.item.fulldetails[i].quantity),
                //                "amount":that.item.fulldetails[i].taxable_amount,
                //                "taxCode":that.item.fulldetails[i].taxcode == undefined ? null :that.item.fulldetails[i].taxcode,
                //                "itemCode":that.item.fulldetails[i].item_id,
                //                "description":"Commit",
                //                "addresses": {
                //                    "shipFrom": {
                //                        "line1":that.item.fulldetails[i].org_address==null?"":that.item.fulldetails[i].org_address,
                //                        "city":that.item.fulldetails[i].org_city==null?"":that.item.fulldetails[i].org_city,
                //                        "region":that.item.fulldetails[i].org_region==null?"":that.item.fulldetails[i].org_region,
                //                        "country":that.item.fulldetails[i].org_country==null?"":that.item.fulldetails[i].org_country,
                //                        "postalCode":that.item.fulldetails[i].org_postal_code==null?"":that.item.fulldetails[i].org_postal_code
                //                    },
                //                    "shipTo": {
                //                        "line1": that.item.fulldetails[i].dest_address,
                //                        "city": that.item.fulldetails[i].dest_city,
                //                        "region": that.item.fulldetails[i].dest_region,
                //                        "country": that.item.fulldetails[i].dest_country,
                //                        "postalCode": that.item.fulldetails[i].dest_postal_code
                //                      }
                //                }
                //              }
                //        );
                //            }

                //            console.log(createTransactionObj);

                //      /*******************Recalculating Tax********************/

                //      $.ajax({
                //        timeout: 0,
                //        type: 'POST',
                //        async: true,
                //        url: client.baseUrl + '/api/v2/transactions/createoradjust',
                //        contentType: 'application/json',
                //        dataType: "json",
                //        data: JSON.stringify({
                //            createTransactionModel: createTransactionObj
                //        })
                //        ,headers: {
                //            'Authorization': client.auth
                //          },
                //        success: function (json) {
                //          console.log("After Allocation Calculation JSON is : "+json);

                //          finalLineItemIds = "" + that.item.fulldetails[0].line_item_id;

                //         for(var i=1;i<that.item.fulldetails.length;i++) {
                //             finalLineItemIds = finalLineItemIds + "," + that.item.fulldetails[i].line_item_id;
                //         }

                //         that.ajaxService.Committoavatax(finalLineItemIds,'MANCOM').subscribe(result => {
                //             that.toastr.success('commit to AvaTax sucessfully.');
                //             that.selectedlineItems = [];
                //             that.selectedlineItems = [];
                //             that.applyFilter(that.p, that.GlobalfilterColoumn);
                //             that.loader = false;
                //             $('#CommittoavataxComments').val('');
                //             $('#CommittoavataxModal').modal('hide');
                //         }, error => {
                //             that.loader = false;
                //             that.toastr.error('Error.');
                //         });

                //         /* for(var i=0;i<json.lines.length;i++)     {
                //              for(var j=0;j<item.allocations.length;j++) {
                //                  if(json.lines[i].lineNumber == (j+1)) {
                //                    item.allocations[j].calculated_tax = json.lines[i].taxCalculated;
                //                    item.allocations[j].variance = json.lines[i].taxCalculated - parseFloat(item.allocations[j].charged_tax ? item.allocations[j].charged_tax : 0);
                //                    item.allocations[j].status_code = "MANCOM";
                //                  }
                //              }
                //          }

                //          console.log(item);
                //          that.ajaxService.allocateItem(item.allocations, item.lineitemid).subscribe(result => {
                //            item.history = result;
                //            that.loader = false;
                //            that.toastr.success('Saved successfully.');
                //            item.splitcount = item.allocations.length;
                //            that.selectedlineItems = [];
                //            that.applyFilter(that.p, that.GlobalfilterColoumn);
                //           }, error => {
                //            that.toastr.error('Error.');
                //            that.loader = false;
                //           }); */

                //          that.loader = false;

                //        },error: function (jqXHR, exception) { 
                //            console.log(exception);
                //            //that.loader = false;
                //            var def = JSON.parse(jqXHR.responseText);
                //            if(def.error.message) {
                //                that.toastr.error("We cannot recalculate tax,"+def.error.message);
                //            }
                //            finalLineItemIds = "" + that.item.fulldetails[0].lineitemid;

                //         for(var i=1;i<that.item.fulldetails.length;i++) {
                //             finalLineItemIds = finalLineItemIds + "," + that.item.fulldetails[i].lineitemid;
                //         }

                //         that.ajaxService.Committoavatax(finalLineItemIds,'CALCFAILED').subscribe(result => {
                //             that.toastr.success('commit to AvaTax sucessfully.');
                //             that.selectedlineItems = [];
                //             that.selectedlineItems = [];
                //             that.applyFilter(that.p, that.GlobalfilterColoumn);
                //             that.loader = false;
                //             $('#CommittoavataxComments').val('');
                //             $('#CommittoavataxModal').modal('hide');
                //         }, error => {
                //             that.loader = false;
                //             that.toastr.error('Error.');
                //         });
                //           /* that.ajaxService.allocateItem(item.allocations, item.lineitemid).subscribe(result => {
                //                item.history = result;
                //                that.loader = false;
                //                that.toastr.success('Saved successfully.');
                //                item.splitcount = item.allocations.length;
                //                that.selectedlineItems = [];
                //                that.applyFilter(that.p, that.GlobalfilterColoumn);
                //               }, error => {
                //                that.toastr.error('Error.');
                //                that.loader = false;
                //               }); */

                //        }
                //    }); 

            }, error => {
                this.loader = false;
                this.toastr.error('Error.');
            });
        }
        /*this.ajaxService.Committoavatax(this.selectedlineItems).subscribe(result => {
            this.toastr.success('commit to AvaTax sucessfully.');
            this.selectedlineItems = [];
            this.selectedlineItems = [];
            this.applyFilter(this.p, this.GlobalfilterColoumn);
            this.loader = false;
            $('#CommittoavataxComments').val('');
             $('#CommittoavataxModal').modal('hide');
        }, error => {
            this.loader = false;
            this.toastr.error('Error.');
        });       */
    }
    enableFields(enable) {
        if (enable) {
            $(".disable_fields").hide();
        } else {
            $(".disable_fields").show();
        }
    }
    cancelExport() {
        $('#expcomments').val('');
    }
    download() {
        if (!$('#expcomments').val()) {
            this.toastr.error('Please enter comments.');
            return false;
        }

        var balancing = this.i_is_balancing == false ? 'no' : 'yes';
        if (this.selectedExpOpt == 'linelevel') {
            this.loader = true;
            this.ajaxService.exportLineItems(this.selectedlineItems, balancing).subscribe(result => {
                let csvContent = atob(result.filecontent);
                var blob = new Blob([csvContent], { type: "data:application/octet-stream;base64" });
                this.saveFile(blob, "export.csv");
                $('#exporttransactionmodal').modal('hide');
                this.loader = false;
                this.i_is_balancing = false;
                this.selectedlineItems = [];
                $('#expcomments').val('');
                this.applyFilter(this.p, this.GlobalfilterColoumn);
            }, error => {
                this.loader = false;
                this.toastr.error('Error.');
                this.i_is_balancing = false;
                $('#expcomments').val('');
            });
        } else {
            this.loader = true;
            var arr = [];
            $('#movabelist li').each(function () {
                var checked = $(this).find('.checkmark_export').css('background-color').indexOf('33');
                if (checked >= 0) {
                    arr.push($(this).data('value'));
                }
            });
            if(arr.length == 0) {
                this.loader = false;
                this.toastr.error('Please Select atleast one column headers');
            } else {
            this.ajaxService.exportLineItems2($('#expcomments').val(), arr, this.selectedlineItems, balancing).subscribe(result => {
                let csvContent = atob(result.filedata);
                var blob = new Blob([csvContent], { type: "data:application/octet-stream;base64" });
                this.saveFile(blob, "export.csv");
                $('#exporttransactionmodal').modal('hide');
                //$(':input').val("");
                this.selectedlineItems = [];
                $('input:checkbox').removeAttr('checked');
                this.loader = false;
                this.i_is_balancing = false;
                $('#expcomments').val('');
                this.applyFilter(this.p, this.GlobalfilterColoumn);
            }, error => {
                this.loader = false;
                this.i_is_balancing = false;
                this.toastr.error('Error.');
                $('#expcomments').val('');
            });    
        }
        }
    }
    addAnotherBulkSec() {

        if (this.bulkAllocation.length > 0) {
            this.bulkAllocation.push({
                "company_id": localStorage.getItem("seleCompany"),
                "cost_center_id": null,
                "purpose_id": null,
                "allocated_percentage": 0,
                "dest_address": "",
                "dest_city": "",
                "dest_region": "",
                "dest_postal_code": "",
                "dest_country": "",
                "dest_location_code": "",
                "insert_user": localStorage.getItem('userId'),
                "accrual_method": "DISTRIBUTED",
                "status_code": "ALLOCATED",
                "submit": false
            });
        } else {
            this.bulkAllocation.push({
                "company_id": localStorage.getItem("seleCompany"),
                "cost_center_id": null,
                "purpose_id": null,
                "allocated_percentage": 100,
                "dest_address": "",
                "dest_city": "",
                "dest_region": "",
                "dest_postal_code": "",
                "dest_country": "",
                "dest_location_code": "",
                "insert_user": localStorage.getItem('userId'),
                "accrual_method": "DISTRIBUTED",
                "status_code": "ALLOCATED",
                "submit": false
            });
        }

    }
    askbulkAllocate() {
        var error = false;

        for (var i = 0; i < this.bulkAllocation.length; i++) {
            this.bulkAllocation[i].submit = true;
            if (!this.bulkAllocation[i].company_id ||
                // !this.bulkAllocation[i].cost_center_id || !this.bulkAllocation[i].purpose_id ||
                !this.bulkAllocation[i].accrual_method || !this.bulkAllocation[i].allocated_percentage) {
                error = true;
            }
        }
        if (error) {
            this.toastr.error('Please enter all the required fields');
            return false;
        }
        $('#defineallocationmodal1').modal('hide');
        $('#allocationModal').modal('show');
    }

    cancelDoBulkAllocate() {
        $('#defineallocationmodal1').modal('hide');
        this.loader = false;
        this.selectedlineItems = [];
        this.bulkAllocationLineItemDetails = [];
        this.bulkAllocation = [];
    }

    okDoBulkAllocate() {

        var allocatComments = $('#allocateComments').val();
        if (!allocatComments) {
            this.toastr.error('Please enter comments.');
            return false;
        }
        this.loader = true;
        var that = this;
        var successflag = true;
        var ListCount = 0;
        var orderNumber = [];
        var client = new Avatax(config).withSecurity(creds);
        console.log(client);

        /*********************Tax Calculation Part Call Avatax API**********************************************/
        for (var x = 0; x < this.bulkAllocationLineItemDetails.length; x++) {
            var item = this.bulkAllocationLineItemDetails[x];

            var fullDet = item;
            fullDet.allocations = [];

            var createTransactionObj = {
                "lines": [],
                "type": "PurchaseInvoice",
                "companyCode": "ICONICSOLUTIONS",
                "date": fullDet.doc_date,
                "customerCode": "ICONICSOLUTIONS-Customer",
                "purchaseOrderNo": fullDet.doc_code,
                "commit": false,
                "code": fullDet.line_item_id,
                "currencyCode": "USD",
                "description": "Commit"
            }

            for (var i = 0; i < this.bulkAllocation.length; i++) {


                /*********************Add Allocate Items*****************************/
                var obj = {
                    line_item_id: "",
                    document_id: "",
                    line_number: "",
                    doc_date: "",
                    cost_center_id: 0,
                    tax_calc_date: null,
                    vendor_id: "",
                    use_id: "",
                    tax_code: "",
                    item_id: "",
                    description: "",
                    allocated_percentage: 100,
                    discount: "",
                    tax_included: "",
                    taxable_amount: item.taxable,
                    charged_tax: item.charged_tax,
                    total_amount: "",
                    ref1: null,
                    ref2: null,
                    rev_account: null,
                    dest_address: "",
                    dest_city: "",
                    dest_region: "",
                    dest_postal_code: "",
                    dest_country: "",
                    org_address: fullDet.org_address,
                    org_city: fullDet.org_city,
                    org_region: fullDet.org_region,
                    org_postal_code: fullDet.org_postal_code,
                    org_country: fullDet.org_country,
                    dest_location_code: "",
                    org_location_code: "",
                    purchasing_agent_code: null,
                    purchasing_order_number: null,
                    address: null,
                    city: null,
                    region: null,
                    postal_code: null,
                    country: null,
                    import_id: "",
                    company_id: null,
                    cost_center_id_2: "",
                    calculated_tax: fullDet.caluculated_tax,
                    marked_for_review: "",
                    line_item_status: "",
                    warning_status: "",
                    insert_user: "",
                    cut_line_number: "",
                    processing_stage: "",
                    user_id: "",
                    cut_proc_number: "",
                    variance: item.variance,
                    purpose_id: 0,
                    error_code_id: "",
                    islocked: "",
                    audit_note: "",
                    accrual: item.accrual,
                    accrual_method: "DISTRIBUTED",
                    status_code: 'ALLOCATED',
                    orderNumber: 0,
                    allocatComments: allocatComments
                };
                if (fullDet) {

                    for (var j = 0; j < this.purpose.length; j++) {
                        if (fullDet.purpose_desc === this.purpose[j].purpose_desc) {
                            this.SelectedPurposeId = this.purpose[j].purpose_id;
                            break;
                        }
                    }
                    for (var j = 0; j < this.custom1.length; j++) {
                        if (fullDet.ref1 === this.custom1[j].custom1) {
                            this.SelectedCustomRef1 = this.custom1[j].custom1_id;
                            break;
                        }
                    }
                    for (var j = 0; j < this.custom2.length; j++) {
                        if (fullDet.ref2 === this.custom2[j].custom2) {
                            this.SelectedCustomRef2 = this.custom2[j].custom2_id;
                            break;
                        }
                    }
                    for (var y = 0; y < this.costCenter.length; y++) {
                        if (fullDet.cost_center_name === this.costCenter[y].cost_center_name) {
                            this.SelectedCostCenterId = this.costCenter[y].cost_center_id;
                            break;
                        }
                    }

                    if (fullDet) {
                        obj.line_item_id = fullDet.line_item_id;
                        obj.document_id = fullDet.document_id;
                        obj.line_number = fullDet.line_number;
                        obj.doc_date = fullDet.doc_date;
                        obj.cost_center_id = this.bulkAllocation[i].cost_center_id;
                        obj.tax_calc_date = fullDet.tax_calc_date;
                        obj.vendor_id = fullDet.vendor_id;
                        obj.use_id = fullDet.use_id;
                        obj.tax_code = fullDet.tax_code;
                        obj.item_id = fullDet.item_id;
                        obj.description = fullDet.description;
                        obj.discount = fullDet.discount;
                        obj.tax_included = fullDet.tax_included;
                        obj.total_amount = fullDet.total_amount;
                        obj.ref1 = fullDet.ref1;
                        obj.ref2 = fullDet.ref2;
                        obj.rev_account = fullDet.rev_account;
                        obj.dest_address = this.bulkAllocation[i].dest_address;
                        obj.dest_city = this.bulkAllocation[i].dest_city;
                        obj.dest_region = this.bulkAllocation[i].dest_region;
                        obj.dest_postal_code = this.bulkAllocation[i].dest_postal_code;
                        obj.dest_country = this.bulkAllocation[i].dest_country;
                        obj.org_address = fullDet.org_address;
                        obj.org_city = fullDet.org_city;
                        obj.org_region = fullDet.org_region;
                        obj.org_postal_code = fullDet.org_postal_code;
                        obj.org_country = fullDet.org_country;
                        obj.dest_location_code = fullDet.dest_location_code;
                        obj.org_location_code = fullDet.org_location_code;
                        obj.purchasing_agent_code = fullDet.purchasing_agent_code;
                        obj.purchasing_order_number = fullDet.purchasing_order_number;
                        obj.address = fullDet.org_address;
                        obj.city = fullDet.org_city;
                        obj.region = fullDet.org_region;
                        obj.postal_code = fullDet.org_postal_code;
                        obj.country = fullDet.org_country;
                        obj.import_id = fullDet.import_id;
                        obj.company_id = fullDet.company_id;
                        obj.cost_center_id_2 = null;
                        obj.marked_for_review = fullDet.marked_for_review;
                        obj.line_item_status = fullDet.line_item_status;
                        obj.warning_status = fullDet.warning_status;
                        obj.insert_user = fullDet.insert_user;
                        obj.cut_line_number = fullDet.cut_line_number;
                        obj.processing_stage = null;
                        obj.user_id = fullDet.doc_user_id;
                        obj.cut_proc_number = fullDet.cut_proc_number;
                        obj.purpose_id = this.bulkAllocation[i].purpose_id;
                        obj.error_code_id = fullDet.error_code_id;
                        obj.islocked = null;
                        obj.audit_note = fullDet.line_audit_note;
                        obj.taxable_amount = (parseFloat(fullDet.taxable_amount) * this.bulkAllocation[i].allocated_percentage) / 100;
                        obj.charged_tax = (parseFloat(fullDet.charged_tax) * this.bulkAllocation[i].allocated_percentage) / 100;
                        obj.calculated_tax = fullDet.caluculated_tax;
                        obj.variance = fullDet.variance;
                        obj.allocated_percentage = this.bulkAllocation[i].allocated_percentage;
                        obj.orderNumber = this.bulkAllocation[i].orderNumber = i;
                    }
                }
                fullDet.allocations.push(obj);

                /**********************************************************************************************/


                createTransactionObj.lines.push(
                    {
                        "number": i + 1,
                        "quantity": (parseFloat(fullDet.quantity) * this.bulkAllocation[i].allocated_percentage) / 100,
                        "amount": (parseFloat(fullDet.taxable_amount) * this.bulkAllocation[i].allocated_percentage) / 100,
                        "taxCode": fullDet.tax_code,
                        "itemCode": fullDet.item_id,
                        "description": "Commit",
                        "addresses": {
                            "shipFrom": {
                                "line1": fullDet.org_address == null ? "" : fullDet.org_address,
                                "city": fullDet.org_city == null ? "" : fullDet.org_city,
                                "region": fullDet.org_region == null ? "" : fullDet.org_region,
                                "country": fullDet.org_country == null ? "" : fullDet.org_country,
                                "postalCode": fullDet.org_postal_code == null ? "" : fullDet.org_postal_code
                            },
                            "shipTo": {
                                "line1": this.bulkAllocation[i].dest_address,
                                "city": this.bulkAllocation[i].dest_city,
                                "region": this.bulkAllocation[i].dest_region,
                                "country": this.bulkAllocation[i].dest_country,
                                "postalCode": this.bulkAllocation[i].dest_postal_code
                            }
                        }
                    }
                );
            }

            that.bulkAllocationLineItemsAfterCalculation.push(fullDet);
            console.log(that.bulkAllocationLineItemsAfterCalculation);

            /*******************Recalculating Tax********************/

            $.ajax({
                timeout: 0,
                type: 'POST',
                async: true,
                url: client.baseUrl + '/api/v2/transactions/createoradjust',
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify({
                    createTransactionModel: createTransactionObj
                })
                , headers: {
                    'Authorization': client.auth
                },
                success: function (json) {
                    if (json != null && json) {
                        for (var z = 0; z < that.bulkAllocationLineItemsAfterCalculation.length; z++) {
                            if (json.code == that.bulkAllocationLineItemsAfterCalculation[z].line_item_id) {
                                console.log("After Allocation Calculation JSON is : " + json);
                                for (var p = 0; p < json.lines.length; p++) {
                                    for (var q = 0; q < fullDet.allocations.length; q++) {
                                        if (json.lines[p].lineNumber == (q + 1)) {
                                            that.bulkAllocationLineItemsAfterCalculation[z].allocations[q].calculated_tax = json.lines[p].taxCalculated;
                                            that.bulkAllocationLineItemsAfterCalculation[z].allocations[q].variance = json.lines[p].taxCalculated - parseFloat(that.bulkAllocationLineItemsAfterCalculation[z].allocations[q].charged_tax ? that.bulkAllocationLineItemsAfterCalculation[z].allocations[q].charged_tax : 0);
                                        }
                                    }
                                }

                                if (successflag == true) {
                                    ListCount++;

                                    if (ListCount == that.bulkAllocationLineItemDetails.length) {

                                        for (var e = 0; e < ListCount; e++) {
                                            that.ajaxService.allocateItem(that.bulkAllocationLineItemsAfterCalculation[e].allocations, that.bulkAllocationLineItemsAfterCalculation[e].line_item_id).subscribe(result => {
                                                that.loader = false;
                                                that.toastr.success('Saved successfully.');
                                                that.selectedlineItems = [];
                                                that.bulkAllocationLineItemDetails = [];
                                                that.bulkAllocationLineItemsAfterCalculation = [];
                                                that.bulkAllocation = [];
                                                $('#defineallocationmodal1').modal('hide');
                                                $('#allocationModal').modal('hide');
                                                //$(':textarea').val("");
                                                that.applyFilter(that.p, that.GlobalfilterColoumn);
                                            }, error => {
                                                that.toastr.error('Error.');
                                                that.loader = false;
                                            });
                                        }

                                    }

                                }
                            }
                        }

                    } else {
                        successflag = false;
                        that.loader = false;
                        that.selectedlineItems = [];
                        that.bulkAllocationLineItemDetails = [];
                        that.bulkAllocationLineItemsAfterCalculation = [];
                        that.bulkAllocation = [];
                        $('#defineallocationmodal1').modal('hide');
                        $('#allocationModal').modal('hide');
                        //$(':textarea').val("");
                        return false;
                    }

                }, error: function (jqXHR, exception) {
                    console.log(exception);
                    //that.loader = false;
                    ListCount++;
                    var def = JSON.parse(jqXHR.responseText);
                    if (def.error.message) {
                        that.toastr.error("We cannot recalculate tax," + def.error.message);
                    }
                    successflag = false;
                    that.loader = false;
                    that.selectedlineItems = [];
                    that.bulkAllocationLineItemDetails = [];
                    that.bulkAllocationLineItemsAfterCalculation = [];
                    that.bulkAllocation = [];
                    $('#defineallocationmodal1').modal('hide');
                    $('#allocationModal').modal('hide');
                    //$(':textarea').val("");
                    return false;
                }
            });
            /***************************************/
        }
        /*********************Tax Calculation Part Call Avatax API**********************************************/


        // this.ajaxService.bulkAllocateItem(this.bulkAllocation, this.selectedlineItems).subscribe(result => {
        //  this.loader = false;
        //  this.toastr.success('Saved successfully.');
        //  this.selectedlineItems = [];
        //  this.applyFilter(this.p, '');
        //  $('#allocationModal').modal('hide');

        // }, error => {
        //     this.toastr.error('Error.');
        //     this.loader = false;
        // });
    }
    doBulkAllocate() {
        var error = false;
        for (var i = 0; i < this.bulkAllocation.length; i++) {
            this.bulkAllocation[i].submit = true;
            if (!this.bulkAllocation[i].company_id ||
                //  !this.bulkAllocation[i].cost_center_id || !this.bulkAllocation[i].purpose_id ||
                !this.bulkAllocation[i].accrual_method || !this.bulkAllocation[i].allocated_percentage) {
                error = true;
            }
        }
        if (error) {
            this.toastr.error('Please enter all the required fields');
            return false;
        }
        this.loader = true;
        console.log(JSON.stringify(this.bulkAllocation));
        this.ajaxService.bulkAllocateItem(this.bulkAllocation, this.selectedlineItems).subscribe(result => {
            this.loader = false;
            this.toastr.success('Saved successfully.');
            this.selectedlineItems = [];
            this.applyFilter(this.p, this.GlobalfilterColoumn);
            $('#defineallocationmodal1').modal('hide');
        }, error => {
            this.toastr.error('Error.');
            this.loader = false;
        });
    }
    AdjustTable() {
        $('#bulkSelection').addClass('fix_table');
        $('.bg_changer_fixed').show();
        var tablewidth = $(".table_container_transaction table").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi").width(tablewidth);
        var tablewidth1 = $(".table_container_transaction thead.normalposi th:nth-child(1)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(1)").width(tablewidth1);
        var tablewidth2 = $(".table_container_transaction thead.normalposi th:nth-child(2)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(2)").width(tablewidth2);
        var tablewidth3 = $(".table_container_transaction thead.normalposi th:nth-child(3)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(3)").width(tablewidth3);
        var tablewidth4 = $(".table_container_transaction thead.normalposi th:nth-child(4)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(4)").width(tablewidth4);
        var tablewidth5 = $(".table_container_transaction thead.normalposi th:nth-child(5)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(5)").width(tablewidth5);
        var tablewidth6 = $(".table_container_transaction thead.normalposi th:nth-child(6)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(6)").width(tablewidth6);
        var tablewidth7 = $(".table_container_transaction thead.normalposi th:nth-child(7)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(7)").width(tablewidth7);
        var tablewidth8 = $(".table_container_transaction thead.normalposi th:nth-child(8)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(8)").width(tablewidth8);
        var tablewidth9 = $(".table_container_transaction thead.normalposi th:nth-child(9)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(9)").width(tablewidth9);
        var tablewidth10 = $(".table_container_transaction thead.normalposi th:nth-child(10)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(10)").width(tablewidth10);
        var tablewidth11 = $(".table_container_transaction thead.normalposi th:nth-child(11)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(11)").width(tablewidth11);
        var tablewidth12 = $(".table_container_transaction thead.normalposi th:nth-child(12)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(12)").width(tablewidth12);
        var tablewidth13 = $(".table_container_transaction thead.normalposi th:nth-child(13)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(13)").width(tablewidth13);
        var tablewidth14 = $(".table_container_transaction thead.normalposi th:nth-child(14)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(14)").width(tablewidth14);
        var tablewidth15 = $(".table_container_transaction thead.normalposi th:nth-child(15)").width();
        $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(15)").width(tablewidth15);
    }
    initscroll() {
        $(window).scroll(function () {
            if (window.matchMedia('(min-width: 1009px)').matches) {
                // var scrollingvlue = $("#bulkSelection").offset().top;
                var scrollingvalue = 0;
                if ($('#table_transaction_con').offset() != undefined) {
                    scrollingvalue = $('#table_transaction_con').offset().top;
                }
                var screenPosition = $(window).scrollTop();
                if (screenPosition < scrollingvalue) {
                    $('#bulkSelection').removeClass('fix_table');
                    $('.bg_changer_fixed').hide();
                }
                if (screenPosition >= scrollingvalue) {
                    $('#bulkSelection').addClass('fix_table');
                    $('.bg_changer_fixed').show();
                    var tablewidth = $(".table_container_transaction table").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi").width(tablewidth);
                    var tablewidth1 = $(".table_container_transaction thead.normalposi th:nth-child(1)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(1)").width(tablewidth1);
                    var tablewidth2 = $(".table_container_transaction thead.normalposi th:nth-child(2)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(2)").width(tablewidth2);
                    var tablewidth3 = $(".table_container_transaction thead.normalposi th:nth-child(3)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(3)").width(tablewidth3);
                    var tablewidth4 = $(".table_container_transaction thead.normalposi th:nth-child(4)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(4)").width(tablewidth4);
                    var tablewidth5 = $(".table_container_transaction thead.normalposi th:nth-child(5)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(5)").width(tablewidth5);
                    var tablewidth6 = $(".table_container_transaction thead.normalposi th:nth-child(6)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(6)").width(tablewidth6);
                    var tablewidth7 = $(".table_container_transaction thead.normalposi th:nth-child(7)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(7)").width(tablewidth7);
                    var tablewidth8 = $(".table_container_transaction thead.normalposi th:nth-child(8)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(8)").width(tablewidth8);
                    var tablewidth9 = $(".table_container_transaction thead.normalposi th:nth-child(9)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(9)").width(tablewidth9);
                    var tablewidth10 = $(".table_container_transaction thead.normalposi th:nth-child(10)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(10)").width(tablewidth10);
                    var tablewidth11 = $(".table_container_transaction thead.normalposi th:nth-child(11)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(11)").width(tablewidth11);
                    var tablewidth12 = $(".table_container_transaction thead.normalposi th:nth-child(12)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(12)").width(tablewidth12);
                    var tablewidth13 = $(".table_container_transaction thead.normalposi th:nth-child(13)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(13)").width(tablewidth13);
                    var tablewidth14 = $(".table_container_transaction thead.normalposi th:nth-child(14)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(14)").width(tablewidth14);
                    var tablewidth15 = $(".table_container_transaction thead.normalposi th:nth-child(15)").width();
                    $(".transactionscrollscreensection.fix_table thead.fixposi th:nth-child(15)").width(tablewidth15);
                }
            }
        })
    }
}
