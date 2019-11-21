import { Directive, Input } from "@angular/core";
import { ValidatorFn, FormGroup, ValidationErrors, NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";

@Directive({
    selector: "[appPasswordMatch]",
    providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMathcValidatorDirective, multi: true }]
})
export class PasswordMathcValidatorDirective implements Validator {
    @Input("appPasswordMatch") password: string;

    validate(control: AbstractControl): ValidationErrors | null {
        return this.password && control.value && this.password === control.value ? null : { passwordMatch: true };
    }
}
