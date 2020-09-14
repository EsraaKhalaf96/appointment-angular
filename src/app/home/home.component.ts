import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../shared/loader/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
    // this.loaderService.show();
  }

}
