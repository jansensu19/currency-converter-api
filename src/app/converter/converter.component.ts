import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ConverterService } from './converter.service';
import { HttpClientModule } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'currency-converter',
  templateUrl: './converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
})
export class ConverterComponent implements OnInit {
  public cityName: { [key: string]: string } = {};
  public amount: UntypedFormControl = new UntypedFormControl(10);
  public from: UntypedFormControl = new UntypedFormControl('');
  public to: UntypedFormControl = new UntypedFormControl('');
  public result: number = 0;
  public disabledNone: boolean = true;
  public isLoading: boolean = true;
  public apiMode: string = 'axios';

  constructor(
    protected _converterService: ConverterService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.disabledNone = true;
    this.handleCurrencyAxios();
  }

  changeApiMode(mode: string) {
    this.isLoading = true;
    this.amount = new UntypedFormControl(10); 
    this.from = new UntypedFormControl('');
    this.to = new UntypedFormControl('');
    this.disabledNone = true
    this.result = 0
    if (mode === 'axios') {
      this.apiMode = mode;
      this.handleCurrencyAxios();
    } else if (mode === 'httpclient') {
      this.apiMode = mode;
      this.handleCurrencyHttpClient();
    }

    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._ngZone.run(() => {
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        });
      }, 200);
    });
  }

  checkValue() {
    const fromIsEmpty = !this.from || !this.from.value;
    const toIsEmpty = !this.to || !this.to.value;

    this.disabledNone = fromIsEmpty || toIsEmpty;

    this._changeDetectorRef.markForCheck();
  }

  async handleCurrencyAxios(): Promise<void> {
    try {
      const res = await this._converterService.getCurrencyAxios();

      if (res && res.names) {
        this.cityName = res.names;
        this.isLoading = false;
        this._changeDetectorRef.markForCheck();
      } else {
        console.error('Response from API is undefined or falsy.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleCurrencyHttpClient(): Promise<void> {
    try {
      this._converterService.getCurrencyHTTPClient().subscribe((res) => {
        if (res && res.names) {
          this.cityName = res.names;
          console.log(res.names, 'http');
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        } else {
          console.error('Response from API is undefined or falsy.');
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async convertCurrencyAxios(): Promise<void> {
    try {
      const res = await this._converterService.ConvertCurrencyAxios(
        this.amount.value,
        this.from.value,
        this.to.value
      );

      this.result = res.total;
      this._changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async convertCurrencyHttpClient(): Promise<void> {
    try {
      this._converterService
        .ConvertCurrencyHTTPClient(
          this.amount.value,
          this.from.value,
          this.to.value
        )
        .subscribe((res) => {
          this.result = res.total;
          this._changeDetectorRef.markForCheck();
        });
    } catch (error) {
      console.error(error);
    }
  }

  title = 'currency-converter-api';
}
