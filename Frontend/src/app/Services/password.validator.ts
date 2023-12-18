import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';

export class PasswordValidator {
  static areEqual(pw:any,pwc:any) {
    let value;
    let valid = true;
    // for (let key in formGroup.controls) {
    //   if (formGroup.controls.hasOwnProperty(key)) {
    //     let control: FormControl = <FormControl>formGroup.controls[key];

        if (pw === pwc) {
          return true;//value = control.value
        } else {
          return false;
          // if (value !== control.value) {
          //   valid = false;
          //   break;
        //   }
        // }
      }
    }

    // if (valid) {
    //   return null;
    // }

    // return {
    //   areEqual: true
    // };
  }
// }
