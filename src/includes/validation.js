import {
  Form as VeeForm, Field as VeeField, defineRule, ErrorMessage,
  configure,
} from 'vee-validate';
import {
  required, min, max, alpha_spaces as alphaSpaces, email, confirmed,
  numeric,
} from '@vee-validate/rules';

export default {

  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('confirmed', confirmed);
    defineRule('numeric', numeric);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `the field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} may only contain characters and spaces.`,
          email: `The ${ctx.field} must be a valid email.`,
          confirmed: 'The passwords do not match.',
          tos: 'You must accept the Terms of Service.',
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is Invalid.`;

        return message;
      },
    });
  },
};
