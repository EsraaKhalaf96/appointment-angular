import { Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MessagesHelper } from './MessagesService';
import { MessagesTypeEnum } from '../enum/MessagesTypeEnum';
import { FormBase } from './FormBase';

@Injectable()
export class FormTableBase  implements OnInit {

    constructor(public _msgs: MessagesHelper) {
    }

    ngOnInit() {

    }

    searchKey = new FormControl('');

    pageSize: number = 10;
    currentPage: number = 1;
    listCount: Number = 0;

    DTsettings = {
        pager: {
            display: true,
            perPage: this.pageSize
        },
        hideSubHeader: true,
        mode: 'external',
        attr: {
            class: 'table table-bordered',
        },
        add: {

        },
        edit: {

        },
        delete: {

            confirmDelete: true,
            saveButtonContent: 'save',
            cancelButtonContent: 'cancel'
        },
        actions: {
            add: false,
            edit: true,
            delete: true,
            position: "right"
        },
        columns: {}
    };
}