export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = new RegExp(/^(?=.*[A-Za-z])(?=.*\d).+$/);

export const USERNAME_TYPE_ERROR = "사용자 이름은 문자만 허용됩니다.";
export const USERNAME_INVALID_ERROR = "사용자 이름이 확인되지 않습니다.";

export const EMAIL_ERROR = "이메일 형식이 아닙니다.";

export const PASSWORD_MIN_LENGTH_ERROR = `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야합니다.`;
export const PASSWORD_REGEX_ERROR = "비밀번호는 영어, 숫자를 포함해야 합니다.";
export const PASSWORD_NOT_CONFIRMED_ERROR = "비밀번호가 일치하지 않습니다.";
