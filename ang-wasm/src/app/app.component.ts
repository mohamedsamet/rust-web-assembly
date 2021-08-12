import {Component} from '@angular/core';
import {Row} from "angular-google-charts";

export interface FibResult {
  result: number,
  time: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public fibRustResult: FibResult[] = [];
  public fibJsResult: FibResult[] = [];
  iterations = 0;

  fibonacciJS(number: number) {
    function fib(n: number): any {
      if (n === 0 || n === 1) {
        return 1;
      } else {
        return (fib(n - 1) + fib(n - 2));
      }
    }
    const timeStart = new Date().getTime();
    const result = fib(number);
    const timeEnd = new Date().getTime();
    this.fibJsResult.push({result, time:(timeEnd - timeStart) / 1000});
  }

  private fibonacciRUST(n: number) {
    import('../../../pkg/rust_wasm_bg.wasm').then((module) => {
      const timeStart = new Date().getTime();
      const result = module.fibonacci(n);
      const timeEnd = new Date().getTime();
      this.fibRustResult.push({result, time:(timeEnd - timeStart) / 1000});
    })
  }

  processCalculation(iter: number) {
    this.fibRustResult = [];
    this.fibJsResult = [];
    for(let i = 1; i <= iter; i++) {
      this.fibonacciJS(i);
      this.fibonacciRUST(i);
    }
  }

  getRate(timeJS: number, timeRust: number) {
    if (timeJS && timeRust) {
      return ((timeJS - timeRust) / timeRust) * 100;
    }
    return 0;
  }
}
