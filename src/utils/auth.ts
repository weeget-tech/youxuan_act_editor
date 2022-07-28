import Cookies from 'js-cookie';

const TokenKey = '';
const userIdKey = '';
const groupIdKey = '';

export function getUser() {
  return {
    'X-AUTH-TOKEN': getToken(),
    userId: getUserId(),
    groupId: getGroupId(),
  };
}

export function setUser(user: any) {
  setToken(user['X-AUTH-TOKEN']);
  setUserId(user.userId);
  setGroupId(user.groupId);
}

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token, {
    expires: 30,
  });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getUserId() {
  return Cookies.get(userIdKey);
}

export function removeUserId() {
  return Cookies.remove(userIdKey);
}

export function setUserId(userId: string) {
  return Cookies.set(userIdKey, userId, {
    expires: 30,
  });
}

export function getGroupId() {
  return Cookies.get(groupIdKey);
}

export function removeGroupId() {
  return Cookies.remove(groupIdKey);
}

export function setGroupId(groupId: string) {
  return Cookies.set(groupIdKey, groupId, {
    expires: 30,
  });
}
