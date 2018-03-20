// RFC 2822 compliant regex
const email_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export function emailValidator(emailToBeValidated: string): boolean {
  const isValidEmail = emailToBeValidated.match(email_regex);
  return !!isValidEmail;
}
